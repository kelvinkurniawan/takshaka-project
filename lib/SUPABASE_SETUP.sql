-- ============================================================================
-- LOGIN ATTEMPTS TABLE SETUP FOR SUPABASE
-- ============================================================================
-- Jalankan query ini di Supabase SQL Editor:
-- 1. Buka https://app.supabase.com → Project → SQL Editor
-- 2. Copy-paste semua query di bawah
-- 3. Klik "Run"
-- ============================================================================

-- Create table untuk login attempts
CREATE TABLE IF NOT EXISTS login_attempts (
  id BIGSERIAL PRIMARY KEY,
  identifier TEXT NOT NULL,
  attempted_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Create index untuk performa query
CREATE INDEX IF NOT EXISTS idx_login_attempts_identifier_time 
ON login_attempts (identifier, attempted_at DESC);

-- Optional: Enable Row Level Security (RLS)
ALTER TABLE login_attempts ENABLE ROW LEVEL SECURITY;

-- Allow service role (backend) to read/write
CREATE POLICY "Service role can manage login attempts"
ON login_attempts
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- ============================================================================
-- MONITORING QUERIES
-- ============================================================================
-- Lihat semua attempts dalam 1 jam terakhir
SELECT identifier, COUNT(*) as attempts, MAX(attempted_at) as last_attempt
FROM login_attempts
WHERE attempted_at > NOW() - INTERVAL '1 hour'
GROUP BY identifier
ORDER BY attempts DESC;

-- Lihat IP yang mencoba login berkali-kali (potential brute force)
SELECT identifier, COUNT(*) as attempts
FROM login_attempts
WHERE identifier LIKE 'login_ip:%'
  AND attempted_at > NOW() - INTERVAL '1 hour'
GROUP BY identifier
HAVING COUNT(*) > 3
ORDER BY attempts DESC;

-- ============================================================================
-- CLEANUP QUERIES (Run occasionally)
-- ============================================================================
-- Delete attempts older than 7 days
DELETE FROM login_attempts 
WHERE attempted_at < NOW() - INTERVAL '7 days';

-- Reset all attempts for testing
DELETE FROM login_attempts;
