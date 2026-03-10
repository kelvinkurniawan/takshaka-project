#!/bin/bash

# ============================================================================
# RATE LIMITER SETUP CHECKLIST
# ============================================================================

echo "🔐 Rate Limiter Setup Checklist"
echo "================================"

echo ""
echo "STEP 1: Create loginAttempts table in Supabase"
echo "✅ Status: Table definition added to lib/schema.ts"
echo ""
echo "   Copy & paste this SQL into Supabase SQL Editor:"
echo "   https://app.supabase.com → Your Project → SQL Editor"
echo ""
echo "   --- START SQL ---"
cat lib/SUPABASE_SETUP.sql
echo "   --- END SQL ---"
echo ""

echo "STEP 2: Generate Drizzle migration"
echo "   Run: npm run db:generate"
echo ""

echo "STEP 3: Push migration to database"
echo "   Run: npm run db:push"
echo ""

echo "STEP 4: Test rate limiter"
echo "   1. Try login with wrong password 6 times"
echo "   2. 6th attempt should return HTTP 429"
echo "   3. Check server logs for [Rate Limit] messages"
echo ""

echo "STEP 5: Monitor attempts in Supabase"
echo "   SELECT * FROM login_attempts"
echo "   ORDER BY attempted_at DESC LIMIT 10;"
echo ""

echo "================================"
echo "Questions?"
echo "- Check lib/RATE_LIMITER_SETUP.md for full guide"
echo "- Check app/api/auth/login/route.ts for implementation"
echo "- Check lib/rate-limiter-supabase.ts for rate limiter logic"
