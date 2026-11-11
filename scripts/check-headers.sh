#!/usr/bin/env bash
# Verify security headers and 404 behaviour of a deployed environment.
# Usage: scripts/check-headers.sh <base-url> [--expect-noindex]
# Optional env: CF_ACCESS_CLIENT_ID / CF_ACCESS_CLIENT_SECRET (Cloudflare Access service token for previews).
set -euo pipefail
base="${1:?usage: check-headers.sh <base-url> [--expect-noindex]}"
base="${base%/}"
expect_noindex="${2:-}"
auth=()
if [[ -n "${CF_ACCESS_CLIENT_ID:-}" && -n "${CF_ACCESS_CLIENT_SECRET:-}" ]]; then
  auth=(-H "CF-Access-Client-Id: ${CF_ACCESS_CLIENT_ID}" -H "CF-Access-Client-Secret: ${CF_ACCESS_CLIENT_SECRET}")
fi
fail=0
headers="$(curl -sS -D - -o /dev/null "${auth[@]}" "$base/")"
echo "$headers" | head -1
check() {
  if echo "$headers" | grep -qi "^$1:"; then
    echo "PASS $1: $(echo "$headers" | grep -i "^$1:" | head -1 | cut -d: -f2- | tr -d '\r' | cut -c1-90)"
  else
    echo "FAIL $1 missing"; fail=1
  fi
}
for h in strict-transport-security content-security-policy x-content-type-options x-frame-options referrer-policy permissions-policy; do
  check "$h"
done
if [[ "$expect_noindex" == "--expect-noindex" ]]; then
  check x-robots-tag
elif echo "$headers" | grep -qi '^x-robots-tag:.*noindex'; then
  echo "FAIL x-robots-tag noindex present on production"; fail=1
fi
code="$(curl -sS -o /dev/null -w '%{http_code}' "${auth[@]}" "$base/__nonexistent-$RANDOM")"
if [[ "$code" == "404" ]]; then echo "PASS 404 status"; else echo "FAIL 404 status (got $code)"; fail=1; fi
exit "$fail"
