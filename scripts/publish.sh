#!/usr/bin/env bash

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

change_then_do() {
  echo "check $1 changes: $recent_tag..$current_tag"
  {
    git diff --exit-code --quiet $recent_tag..$current_tag $1 &&
    echo "📦 No changes in $1, skip publish"
  } || {
    echo "📦 Changes in $1, start publish"
    eval $2
  }
}

change_then_do "packages" publish_lemon_peel
change_then_do "toolkit/unplugin-resolver" public_unplugin_resolver
change_then_do "toolkit/metadata" public_metadata

echo "✅ Publish completed"
