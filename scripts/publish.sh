#!/bin/sh

set -e

pnpm i --frozen-lockfile
pnpm update:version

pnpm build

cd dist/lemon-peel
npm publish
cd -

cd toolkit/unplugin-resolver
pnpm build
npm publish
cd -

cd toolkit/metadata
pnpm build
npm publish
cd -

echo "✅ Publish completed"
