#!/bin/bash

# Test login & check cookies
echo "🔐 Testing Login & Cookie Setup..."
echo ""

# 1. Test login
echo "1️⃣ POST /api/auth/login"
curl -i -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@takshaka.test","password":"admin123"}' \
  -c /tmp/cookies.txt

echo ""
echo ""
echo "2️⃣ Checking cookies saved..."
cat /tmp/cookies.txt

echo ""
echo ""
echo "3️⃣ GET /api/page-sections (with cookies)"
curl -i -X GET http://localhost:3000/api/page-sections \
  -b /tmp/cookies.txt

echo ""
echo "✅ Done"
