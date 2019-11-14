#!/usr/bin/env bash
set -euo pipefail

echo "Building..."
gulp build
cd build
rm -f package-lock.json
rm -rf node_modules/
npm i
echo "Deploying..."
export NODE_ENV=dev && sls deploy --stage dev --aws-s3-accelerate