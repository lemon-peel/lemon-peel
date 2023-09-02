#!/usr/bin/env sh

set -e

recent_tag=$(git describe --abbrev=0 --tags `git rev-list --tags --skip=1 --max-count=1`)
current_tag=$TAG_VERSION

pnpm i --frozen-lockfile

function publish_lemon_peel() {
  sed -i 's/"name": "@lemon-peel\/main",/"name": "lemon-peel",/' packages/main/package.json
  pnpm update:version
  pnpm build
  cd dist/lemon-peel
  npm publish --access=public
  cd -
}

function public_unplugin_resolver() {
  cd toolkit/unplugin-resolver
  pnpm version $TAG_VERSION
  pnpm build
  npm publish --access=public
  cd -
}

function public_metadata() {
  cd toolkit/metadata
  pnpm version $TAG_VERSION
  pnpm build
  npm publish --access=public
  cd -
}

function change_then_do() {
  git diff --exit-code --quiet -- $recent_tag..$current_tag -- $1
  if [ $? -eq 0 ]; then
    echo "📦 No changes in $1, skip publish"
  else
    eval $2
  fi
}

change_then_do "packages" publish_lemon_peel
change_then_do "toolkit/unplugin-resolver" public_unplugin_resolver
change_then_do "toolkit/metadata" public_metadata

echo "✅ Publish completed"
