#!/bin/bash
# Verify running agents via curl

echo "Verifying Agents on http://localhost:3001..."

# 1. Test Chat API (Simple Intent)
echo "Testing /api/chat (Agent A)..."
curl -s -X POST http://localhost:3001/api/chat \
  -H "Content-Type: application/json" \
  -d '{"messages": [{"role": "user", "content": "I want to learn about GCP Architecture"}]}' > response_a.json

if grep -q "content" response_a.json; then
  echo "✅ Agent A Response Valid"
else
  echo "❌ Agent A Failed"
  cat response_a.json
fi

echo "Done."
