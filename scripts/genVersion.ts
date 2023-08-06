import { writeFile } from 'node:fs/promises';
import path from 'node:path';
import consola from 'consola';
import { mainDir, buildDir } from '@lemon-peel/build-utils';
import pkg from '../packages/main/package.json'; // need to be checked

function getVersion() {
  const tagVer = process.env.TAG_VERSION;
  if (tagVer) {
    return tagVer.startsWith('v') ? tagVer.slice(1) : tagVer;
  } else {
    return pkg.version;
  }
}

const version = getVersion();

async function main() {
  consola.info(`Version: ${version}`);
  await writeFile(
    path.resolve(mainDir, 'version.ts'),
    `export const version = '${version}'\n;`,
  );
  await writeFile(
    path.resolve(buildDir, 'version.ts'),
    `export const version = '${version}'\n;`,
  );
}

main();
