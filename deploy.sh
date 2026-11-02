#!/usr/bin/env bash
set -euo pipefail

ENV="${1:-dev}"

if [[ "$ENV" != "dev" && "$ENV" != "prod" ]]; then
  echo "Usage: $0 [dev|prod]" >&2
  exit 1
fi

trap 'firebase use dev' EXIT

npm test -- --watch=false
firebase use "$ENV"
firebase deploy --only apphosting,functions,firestore
