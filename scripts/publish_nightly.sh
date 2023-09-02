#!/bin/sh

set -e

sed -i 's/"name": "@lemon-peel\/main",/"name": "@lemon-peel\/nightly",/' packages/main/package.json

pnpm i --frozen-lockfile
pnpm update:version

pnpm build

cd dist/lemon-peel
npm publish
cd -

echo "✅ Publish completed"
