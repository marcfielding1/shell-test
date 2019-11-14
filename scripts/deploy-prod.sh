#!/usr/bin/env bash
set -euo pipefail

echo "Building..."
gulp build
cd build
rm package-lock.json
echo "Removing old node_modules"
rm -rf node_modules/
echo "Installing new node_modules..."
npm i
echo "Deploying..."
export NODE_ENV=prod && sls deploy --stage prod --aws-s3-accelerate