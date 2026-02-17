# NextCMS - Sistem Authentication

## Ringkasan Fitur

Sistem authentication yang telah diimplementasikan mencakup:

✅ **Login tanpa Register** - User hanya bisa login, tidak ada fitur registrasi publik
✅ **Session-based Authentication** - Menggunakan httpOnly cookies untuk keamanan
✅ **Protected Routes** - Middleware melindungi `/app/dashboard` dan route lainnya
✅ **Password Hashing** - Menggunakan PBKDF2 dengan salt untuk keamanan password
✅ **Logout Functionality** - Endpoint untuk clear session

---

## Struktur File

### Authentication Routes

| Route              | Method | Deskripsi                             |
| ------------------ | ------ | ------------------------------------- |
| `/api/auth/login`  | POST   | Login dengan email & password         |
| `/api/auth/logout` | POST   | Logout & clear session                |
| `/api/seed`        | POST   | Seed endpoint untuk membuat test user |
| `/secure-access`   | GET    | Halaman login                         |
| `/app/dashboard`   | GET    | Protected dashboard (requires auth)   |

### Files Baru

```
lib/
  ├── auth.ts              # Password hashing & token generation
  ├── session.ts           # Session management dengan cookies
  └── schema.ts            # (Updated) Database schema dengan auth fields

app/
  ├── api/
  │   ├── auth/
  │   │   ├── login/route.ts       # Login endpoint
  │   │   └── logout/route.ts      # Logout endpoint
  │   └── seed/route.ts            # User creation endpoint
  ├── secure-access/page.tsx       # Login page
  └── app/dashboard/page.tsx       # Protected dashboard page

middleware.ts               # Middleware untuk protect routes
```

---

## Cara Menggunakan

### 1. **Setup Awal**

Database sudah dibuat dengan struktur:

```sql
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  created_at INTEGER NOT NULL DEFAULT (current timestamp)
)
```

### 2. **Membuat User Test (Seed)**

```bash
curl -X POST http://localhost:3001/api/seed \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"password123",
    "name":"Test User"
  }'
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "User berhasil dibuat",
  "user": {
    "email": "test@example.com",
    "name": "Test User"
  }
}
```

### 3. **Login**

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"password123"
  }'
```

**Response (200 OK):**

```json
{
  "success": true,
  "user": {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com"
  }
}
```

Server akan set `auth_session` cookie secara otomatis.

### 4. **Akses Dashboard**

Setelah login, Anda bisa akses:

- **Login Page:** http://localhost:3001/secure-access
- **Dashboard:** http://localhost:3001/app/dashboard

Tanpa authentication cookie, dashboard akan redirect ke `/secure-access`.

### 5. **Logout**

```bash
curl -X POST http://localhost:3001/api/auth/logout
```

Session cookie akan dihapus dan user redirect ke login page.

---

## Implementasi Detail

### Password Security (`lib/auth.ts`)

Menggunakan **PBKDF2** dengan:

- **Salt:** Random 16 bytes
- **Iterations:** 100,000
- **Hash Algorithm:** SHA-256
- **Output:** `salt:hash` (60+ karakter)

```typescript
verifyPassword("password123", storedHash); // true/false
```

### Session Management (`lib/session.ts`)

Cookie Configuration:

- **Name:** `auth_session`
- **Value:** User ID (encrypted)
- **Duration:** 24 hours
- **HttpOnly:** ✅ (tidak bisa diakses via JavaScript)
- **Secure:** ✅ (HTTPS in production)
- **SameSite:** lax (CSRF protection)

### Middleware Protection (`middleware.ts`)

```typescript
// Regular expressions define protected routes
const protectedRoutes = ["/app/dashboard"];

// Unauthenticated users → redirect to /secure-access
if (!session) {
  return NextResponse.redirect(new URL("/secure-access", request.url));
}
```

---

## API Validation

Semua endpoints menggunakan **Zod** untuk validation:

```typescript
const loginSchema = z.object({
  email: z.string().email("Email tidak valid"),
  password: z.string().min(1, "Password tidak boleh kosong"),
});
```

**Error Response (400):**

```json
{
  "error": "Validasi gagal",
  "details": [
    {
      "code": "invalid_string",
      "validation": "email",
      "message": "Invalid email",
      "path": ["email"]
    }
  ]
}
```

---

## Frontend Integration

### Login Page Component (`app/secure-access/page.tsx`)

Fitur:

- ✅ Form validation dengan error messages
- ✅ Loading state saat submit
- ✅ Auto-redirect ke dashboard setelah login
- ✅ Error handling dengan display ke user

```javascript
// Client-side login flow
const response = await fetch("/api/auth/login", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});

if (response.ok) {
  router.push("/app/dashboard"); // Auto-redirect
}
```

### Dashboard Page (`app/app/dashboard/page.tsx`)

Fitur:

- ✅ Protected route (middleware checks)
- ✅ Logout button
- ✅ Loading state
- ✅ Information display

---

## Production Checklist

Untuk deploy ke production:

⚠️ **Database:**

- [ ] Backup dev.db sebelum production migration
- [ ] Configure D1_URL environment variable
- [ ] Run migrations: `npm run build`

⚠️ **Security:**

- [ ] Set `SECURE_COOKIES=true` di environment
- [ ] Configure CORS jika perlu
- [ ] Add rate limiting ke login endpoint
- [ ] Setup monitoring untuk login attempts

⚠️ **Optional Enhancements:**

- [ ] 2FA (Two-Factor Authentication)
- [ ] Password reset email flow
- [ ] Account lockout after failed attempts
- [ ] Login activity logs

---

## Testing Commands

```bash
# Start dev server
npm run dev

# Create test user
curl -X POST http://localhost:3001/api/seed \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","name":"Test User"}'

# Test login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}' \
  -c cookies.txt

# Test protected route (with auth)
curl http://localhost:3001/app/dashboard -b cookies.txt

# Test logout
curl -X POST http://localhost:3001/api/auth/logout -b cookies.txt
```

---

## Troubleshooting

### Error: "Email atau password salah"

- Pastikan email & password sesuai
- Check user sudah dibuat di database

### 307 Redirect ke /secure-access

- Normal behavior jika tidak authenticated
- Pastikan sudah login dan session cookie valid

### Cookie tidak tersimpan

- Pastikan browser mengizinkan cookies
- Check browser security settings
- Use `-c cookies.txt` dengan curl untuk save

### Database: SQLITE_ERROR

- Pastikan `dev.db` sudah dibuat dengan table `users`
- Run: `npm run dev` untuk auto-create table

---

## Architecture Diagram

```
┌─────────────────┐
│ Login Page      │
│ /secure-access  │
└────────┬────────┘
         │ POST
         ▼
┌─────────────────────────────┐
│ /api/auth/login             │
│ • Verify credentials        │
│ • Set session cookie        │
└────────┬────────────────────┘
         │ 200 OK + auth_session
         ▼
┌──────────────────────────────┐
│ Browser                      │
│ • Store auth_session cookie  │
│ • Redirect to /app/dashboard │
└──────────┬───────────────────┘
           │ GET /app/dashboard
           ▼
┌──────────────────────────────┐
│ Middleware                   │
│ • Check auth_session cookie  │
│ • ✅ Allow if exists        │
│ • ❌ Redirect if missing    │
└──────────┬───────────────────┘
           ▼
┌──────────────────────────────┐
│ Dashboard Page               │
│ /app/dashboard               │
│ • Show user info             │
│ • Logout button              │
└──────────────────────────────┘
```

---

## Notes

- Database menggunakan **better-sqlite3** di development
- Production akan switch ke **Cloudflare D1** dengan environment variables
- Session menggunakan **httpOnly cookies** (more secure vs localStorage)
- Password di-hash dengan **PBKDF2** (industry standard)

Sistem ini siap untuk digunakan dan extend dengan fitur tambahan! 🎉
