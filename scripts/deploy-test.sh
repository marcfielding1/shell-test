#!/usr/bin/env bash
set -euo pipefail

echo "Building..."
gulp build
cd build
rm package-lock.json
rm -rf node_modules/
npm i
echo "Deploying to Test environment..."
export NODE_ENV=test && sls deploy --stage test --aws-s3-accelerate