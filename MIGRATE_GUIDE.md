# Database Migration Guide

## 🗄️ Backup & Restore Database

Gunakan script `migrate.js` untuk backup dan restore database PostgreSQL.

### Prerequisites

Pastikan PostgreSQL client tools sudah terinstall:

```bash
# macOS
brew install postgresql@15

# Linux (Ubuntu/Debian)
sudo apt-get install postgresql-client

# Verify installation
which pg_dump psql
```

### Commands

#### 1. **Dump Database (Backup)**

```bash
# Backup dengan DATABASE_URL dari .env.local
npm run db:dump

# Atau menggunakan explicit URL
SOURCE_DATABASE_URL="postgresql://..." node migrate.js dump
```

Backup file akan disimpan di folder `./backups/` dengan format:

- `backup-2025-03-30-10-30-45.sql.gz` (timestamped)
- `backup-latest.sql.gz` (symlink ke backup terakhir)

#### 2. **Restore Database**

```bash
# Restore dari backup terakhir ke database baru
SOURCE_DATABASE_URL="postgresql://..." \
TARGET_DATABASE_URL="postgresql://..." \
node migrate.js restore
```

**⚠️ Warning**: Operasi restore akan mengganti semua data di target database!

#### 3. **List Available Backups**

```bash
npm run db:list
# atau
node migrate.js list
```

### Setup Environment Variables

Tambahkan ke `.env.local`:

```bash
# Source Database (untuk dump)
DATABASE_URL="postgresql://user:password@source-host:5432/mydb"

# Target Database (untuk restore - opsional)
TARGET_DATABASE_URL="postgresql://user:password@target-host:5432/mydb"
```

### NPM Scripts

Tambahkan ke `package.json` untuk kemudahan:

```json
{
	"scripts": {
		"db:dump": "node migrate.js dump",
		"db:restore": "node migrate.js restore",
		"db:list": "node migrate.js list",
		"db:help": "node migrate.js --help"
	}
}
```

### Features

✅ **Compressed Backups** - Menggunakan gzip untuk file lebih kecil
✅ **Timestamped Files** - Backup terorganisir dengan waktu pembuatan
✅ **Latest Symlink** - Kemudahan restore dengan `backup-latest.sql.gz`
✅ **Tool Validation** - Cek `pg_dump` dan `psql` tersedia
✅ **Error Handling** - Error messages yang jelas dan actionable
✅ **Progress Logging** - Tracking ukuran file dan progress
✅ **Help Command** - `node migrate.js --help`

### Workflow Examples

#### Scenario 1: Backup Production ke Local Development

```bash
# Set environment variables
export SOURCE_DATABASE_URL="postgresql://prod-user:pass@prod-host/proddb"
export DATABASE_URL="postgresql://dev-user:pass@localhost/devdb"

# Dump dari production
node migrate.js dump

# Restore ke local development
export TARGET_DATABASE_URL="postgresql://dev-user:pass@localhost/devdb"
node migrate.js restore
```

#### Scenario 2: Multiple Backups

```bash
# Create multiple backups
node migrate.js dump  # backup-2025-03-30-10-30-45.sql.gz
node migrate.js dump  # backup-2025-03-30-10-35-12.sql.gz
node migrate.js dump  # backup-2025-03-30-10-40-22.sql.gz

# List semua backups
node migrate.js list

# Latest symlink selalu point ke backup terbaru
ls -la backups/backup-latest.sql.gz
```

### Troubleshooting

#### Error: "Required tools not found: pg_dump, psql"

```bash
# Install PostgreSQL client tools
brew install postgresql@15

# Verify
which pg_dump psql
```

#### Error: "SOURCE_DATABASE_URL or DATABASE_URL not set"

```bash
# Set environment variable
export DATABASE_URL="postgresql://..."
node migrate.js dump

# Atau tambahkan ke .env.local
# DATABASE_URL="postgresql://..."
npm run db:dump
```

#### Error: "TARGET_DATABASE_URL not set for restore"

```bash
export TARGET_DATABASE_URL="postgresql://..."
node migrate.js restore
```

#### Large Database Timeout

Jika dump timeout untuk database besar, naikkan timeout:

Edit `migrate.js` line `timeout: 300000,` menjadi timeout lebih besar (dalam milliseconds).

#### Connection Refused

Pastikan database connection valid:

```bash
# Test connection
psql "postgresql://user:pass@host:5432/db" -c "SELECT 1"

# Jika tidak bisa connect, check:
# - Host/port correct?
# - Username/password correct?
# - Network access allowed (firewall, allowlist)?
```

### Best Practices

1. **Regular Backups** - Backup secara berkala sebelum perubahan penting
2. **Test Restore** - Selalu test restore ke database terpisah dulu
3. **Keep Multiple Backups** - Jangan hapus semua backups lama
4. **Monitor File Size** - Track ukuran backup untuk storage planning
5. **Gitignore Backups** - Tambahkan `/backups/` ke `.gitignore`
6. **Use Latest Symlink** - Gunakan `backup-latest.sql.gz` untuk automation

### Security Notes

⚠️ **Never commit database credentials to git!**

- Database URLs sensitif, gunakan environment variables
- `.env.local` sudah di-gitignore
- Backup files mungkin berisi sensitif data, simpan aman
- Restrict access ke database credentials

### Additional Resources

- [PostgreSQL pg_dump Documentation](https://www.postgresql.org/docs/current/app-pgdump.html)
- [PostgreSQL psql Documentation](https://www.postgresql.org/docs/current/app-psql.html)
- [Drizzle ORM Docs](https://orm.drizzle.team)
