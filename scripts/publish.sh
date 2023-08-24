#!/bin/sh

set -e

pnpm i --frozen-lockfile
pnpm update:version

pnpm build

cd dist/lemon-peel
npm publish --access=public
cd -

cd toolkit/unplugin-resolver
pnpm version $TAG_VERSION
pnpm build
npm publish --access=public
cd -

cd toolkit/metadata
pnpm version $TAG_VERSION
pnpm build
npm publish --access=public
cd -

echo "✅ Publish completed"
