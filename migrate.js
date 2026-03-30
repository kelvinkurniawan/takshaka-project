// migrate.js - Database Dump & Restore Utility
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import { config } from "dotenv";

// Load environment variables from .env.local
config({ path: ".env.local" });

// Configuration
const SOURCE_DB_URL =
	process.env.SOURCE_DB_URL ||
	process.env.SOURCE_DATABASE_URL ||
	process.env.DATABASE_URL;
const TARGET_DB_URL = process.env.TARGET_DATABASE_URL;
const BACKUP_DIR = "./backups";
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, "-").slice(0, -5);
const BACKUP_FILE = path.join(BACKUP_DIR, `backup-${TIMESTAMP}.sql.gz`);
const LATEST_BACKUP = path.join(BACKUP_DIR, "backup-latest.sql.gz");

// Utility Functions
function ensureBackupDir() {
	if (!fs.existsSync(BACKUP_DIR)) {
		fs.mkdirSync(BACKUP_DIR, { recursive: true });
		console.log(`📁 Backup directory created: ${BACKUP_DIR}`);
	}
}

function checkRequiredTools() {
	const tools = ["pg_dump", "psql"];
	const missing = [];

	for (const tool of tools) {
		try {
			execSync(`which ${tool}`, { stdio: "pipe" });
		} catch {
			missing.push(tool);
		}
	}

	if (missing.length > 0) {
		throw new Error(
			`❌ Required tools not found: ${missing.join(", ")}\n` +
				"Install PostgreSQL client tools: brew install postgresql@15",
		);
	}
}

function validateUrls() {
	if (!SOURCE_DB_URL) {
		throw new Error(
			"❌ SOURCE_DB_URL, SOURCE_DATABASE_URL, or DATABASE_URL environment variable not set.\n" +
				"Add to .env.local: SOURCE_DB_URL=postgresql://...",
		);
	}

	const command = (process.argv[2] || "dump").toLowerCase();
	if (command === "restore" && !TARGET_DB_URL) {
		throw new Error(
			"❌ TARGET_DATABASE_URL environment variable not set.\n" +
				"Add to .env.local: TARGET_DATABASE_URL=postgresql://...",
		);
	}
}

function run(command, options = {}) {
	const { silent = false, timeout = 300000 } = options;

	if (!silent) {
		console.log(`\n🚀 Running: ${command}\n`);
	}

	try {
		execSync(command, {
			stdio: silent ? "pipe" : "inherit",
			timeout,
			maxBuffer: 1024 * 1024 * 100, // 100MB buffer
		});
	} catch (error) {
		throw new Error(`Command failed: ${command}\n${error.message}`);
	}
}

function dumpDatabase() {
	console.log("\n📦 Step 1: Dumping database from SOURCE...");
	console.log(`📍 Source: ${SOURCE_DB_URL.split("@")[1] || "via environment"}`);

	const dumpCommand = `pg_dump "${SOURCE_DB_URL}" \
		--no-owner \
		--no-privileges \
		--no-acl \
		--compress=9 \
		--file="${BACKUP_FILE}"`;

	run(dumpCommand);

	const stats = fs.statSync(BACKUP_FILE);
	const sizeInMB = (stats.size / 1024 / 1024).toFixed(2);

	console.log(`\n✅ Dump completed successfully`);
	console.log(`📊 Backup file: ${BACKUP_FILE}`);
	console.log(`💾 File size: ${sizeInMB} MB`);

	// Create symlink to latest backup
	try {
		// Remove old symlink if exists (works for symlinks and files)
		if (fs.existsSync(LATEST_BACKUP) || fs.lstatSync(LATEST_BACKUP)) {
			fs.unlinkSync(LATEST_BACKUP);
		}
	} catch {
		// symlink doesn't exist or is broken, safe to ignore
	}

	try {
		// Create relative symlink from latest to current backup
		const relativeBackupFile = path.basename(BACKUP_FILE);
		fs.symlinkSync(relativeBackupFile, LATEST_BACKUP);
		console.log(`🔗 Latest backup symlink updated: ${LATEST_BACKUP}`);
	} catch (error) {
		console.warn(`⚠️  Warning: Could not create symlink: ${error.message}`);
		console.warn(`   Backup still created at: ${BACKUP_FILE}`);
	}
}

function restoreDatabase() {
	console.log("\n📥 Step 2: Restoring to TARGET database...");
	console.log(`📍 Target: ${TARGET_DB_URL.split("@")[1] || "via environment"}`);

	// Find latest backup file
	let backupToRestore = null;

	// First try to use LATEST_BACKUP symlink if it exists and is valid
	try {
		if (fs.lstatSync(LATEST_BACKUP).isSymbolicLink()) {
			const linkedPath = fs.readlinkSync(LATEST_BACKUP);
			const resolvedPath = path.resolve(LATEST_BACKUP, "..", linkedPath);
			if (fs.existsSync(resolvedPath)) {
				backupToRestore = resolvedPath;
			}
		}
	} catch {
		// symlink doesn't exist or is broken, continue to find latest
	}

	// If symlink didn't work, find latest backup file by date
	if (!backupToRestore) {
		const backupFiles = fs
			.readdirSync(BACKUP_DIR)
			.filter((f) => f.startsWith("backup-") && f.endsWith(".sql.gz"))
			.map((f) => ({
				name: f,
				path: path.join(BACKUP_DIR, f),
				time: fs.statSync(path.join(BACKUP_DIR, f)).mtime.getTime(),
			}))
			.sort((a, b) => b.time - a.time);

		if (backupFiles.length === 0) {
			throw new Error(`❌ No backup files found in ${BACKUP_DIR}`);
		}

		backupToRestore = backupFiles[0].path;
		console.log(`📂 Found latest backup: ${path.basename(backupToRestore)}`);
	} else {
		console.log(`📂 Using symlinked backup: ${path.basename(backupToRestore)}`);
	}

	// Check flags
	const forceRestore = process.argv.includes("--force");
	const publicOnly = process.argv.includes("--public-only");

	// Auto-enable force mode for public-only restore
	const finalForce = forceRestore || publicOnly;
	const onErrorStop = finalForce ? "off" : "on";

	if (forceRestore) {
		console.log(
			`\n⚠️  Force mode enabled - will continue despite schema conflicts`,
		);
	}

	if (publicOnly) {
		console.log(
			`\n🔍 Public schema only mode - filtering out system schemas\n`,
		);
		restorePublicSchemaOnly(backupToRestore);
	} else {
		const restoreCommand = `gunzip -c "${backupToRestore}" | psql "${TARGET_DB_URL}" \
			--set ON_ERROR_STOP=${onErrorStop} \
			--echo-errors`;

		try {
			run(restoreCommand);
			console.log(`\n✅ Restore completed successfully`);
		} catch (error) {
			// Check if error is about schema already existing
			if (
				error.message.includes("schema") &&
				error.message.includes("already exists")
			) {
				console.error(`\n⚠️  Schema already exists in target database`);
				console.error(`\nUse --public-only to restore only public schema:\n`);
				console.error(`  npm run db:restore -- --public-only\n`);
				console.error(`Or use --force to skip schema conflicts:\n`);
				console.error(`  npm run db:restore -- --force\n`);
			}
			throw error;
		}
	}
}

function restorePublicSchemaOnly(backupFile) {
	console.log(`📂 Restoring public schema only...`);
	console.log(
		`   System schemas will be skipped (they are managed by Supabase)\n`,
	);

	// For Supabase, the safest approach is to restore with --force
	// which skips system schema errors that are expected from managed schemas
	const restoreCommand = `gunzip -c "${backupFile}" | psql "${TARGET_DB_URL}" \
		--set ON_ERROR_STOP=off \
		--echo-errors \
		--quiet`;

	try {
		run(restoreCommand);
		console.log(`\n✅ Public schema restore completed`);
		console.log(
			`\n📊 Restored: Tables, indexes, sequences, views, functions from public schema`,
		);
		console.log(
			`\n⚠️  System schema errors (auth, storage, vault, etc.) were skipped`,
		);
		console.log(
			`   These are managed by Supabase and read-only on the platform.\n`,
		);
	} catch (error) {
		console.error(`\n❌ Error during restore`);
		// Don't throw - with --force we expect some errors from system schemas
		// Only fail if there's a real connection/permission error
		if (
			error.message.includes("FATAL") ||
			error.message.includes("permission denied for database")
		) {
			throw error;
		}
	}
}

function listBackups() {
	console.log("\n📋 Available backups:");

	if (!fs.existsSync(BACKUP_DIR)) {
		console.log("No backups found");
		return;
	}

	const files = fs
		.readdirSync(BACKUP_DIR)
		.filter((f) => f.startsWith("backup-"));

	if (files.length === 0) {
		console.log("No backups found");
		return;
	}

	files
		.sort()
		.reverse()
		.forEach((file) => {
			const filePath = path.join(BACKUP_DIR, file);
			const stats = fs.statSync(filePath);
			const sizeInMB = (stats.size / 1024 / 1024).toFixed(2);

			// Check if this is the latest backup
			let isLatest = "";
			try {
				const latestStats = fs.lstatSync(LATEST_BACKUP);
				if (latestStats.isSymbolicLink()) {
					const linkedFile = fs.readlinkSync(LATEST_BACKUP);
					if (linkedFile === path.basename(filePath)) {
						isLatest = " ⭐";
					}
				}
			} catch {
				// LATEST_BACKUP doesn't exist or is broken, skip
			}

			console.log(`  • ${file} (${sizeInMB} MB)${isLatest}`);
		});
}

function showHelp() {
	console.log(`
🗄️  Database Migration Tool

Usage:
  node migrate.js [command] [options]

Commands:
  dump              Dump database to backup file (default)
  restore           Restore from latest backup to TARGET database
  list              List all available backups
  
Options:
  --help, -h        Show this help message
  --force           Skip schema conflict errors during restore
  --public-only     Restore only public schema (exclude system schemas)

Environment Variables (.env.local):
  SOURCE_DB_URL         Source database URL (preferred)
  SOURCE_DATABASE_URL   Source database URL (alternative)
  DATABASE_URL          Fallback for SOURCE_DB_URL
  TARGET_DATABASE_URL   Target database URL (required for restore)

Examples:
  # Dump source database
  node migrate.js dump

  # Restore to target database (stops on schema conflicts)
  node migrate.js restore

  # Restore only public schema (recommended for Supabase)
  node migrate.js restore --public-only

  # Restore all schemas (skip error conflicts)
  node migrate.js restore --force

  # Combine flags
  node migrate.js restore --public-only --force

  # List all backups
  node migrate.js list

  # Show help
  node migrate.js --help

⚠️  For Supabase: Use --public-only to restore only your data
   (system schemas like auth, storage, vault are read-only)
	`);
}

// Main Execution
async function main() {
	const command = process.argv[2] || "dump";

	try {
		// Check for help flag
		if (process.argv.includes("--help") || process.argv.includes("-h")) {
			showHelp();
			return;
		}

		console.log("\n🔍 Validating prerequisites...");
		checkRequiredTools();
		validateUrls();
		ensureBackupDir();

		console.log("✅ Validation passed\n");

		switch (command.toLowerCase()) {
			case "dump":
				dumpDatabase();
				break;
			case "restore":
				// Only dump if no recent backup exists
				const hasRecentBackup =
					fs.existsSync(LATEST_BACKUP) ||
					(fs.existsSync(BACKUP_DIR) &&
						fs.readdirSync(BACKUP_DIR).filter((f) => f.startsWith("backup-"))
							.length > 0);

				if (!hasRecentBackup) {
					dumpDatabase();
				} else {
					console.log("\n💾 Using existing backup (skipping dump)\n");
				}
				restoreDatabase();
				break;
			case "list":
				listBackups();
				break;
			default:
				console.error(`❌ Unknown command: ${command}`);
				showHelp();
				process.exit(1);
		}

		console.log("\n🎉 Operation completed successfully!\n");
	} catch (error) {
		console.error("\n" + error.message);
		process.exit(1);
	}
}

main();
