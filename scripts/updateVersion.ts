import consola from 'consola';
import chalk from 'chalk';
import { getWorkspacePackages } from '@lemon-peel/build-utils';
import type { Project } from '@pnpm/find-workspace-packages';

async function main() {
  const tagVersion = process.env.TAG_VERSION;
  const gitHead = process.env.GIT_HEAD;
  if (!tagVersion || !gitHead) {
    throw new Error('No tag version or git head were found, make sure that you set the environment variable $TAG_VERSION \n');
  }

  consola.log(chalk.cyan('Start updating version'));
  consola.log(chalk.cyan(`$TAG_VERSION: ${tagVersion}`));
  consola.log(chalk.cyan(`$GIT_HEAD: ${gitHead}`));

  consola.debug(chalk.yellow(`Updating package.json for lemon-peel`));

  const pkgList = await getWorkspacePackages();
  const pkgs = Object.fromEntries(
    pkgList.map(pkg => [pkg.manifest.name!, pkg]),
  );
  const elementPlus = pkgs['lemon-peel'] || pkgs['@lemon-peel/nightly'];
  const eslintConfig = pkgs['@lemon-peel/eslint-config'];
  const metadata = pkgs['@lemon-peel/metadata'];

  const writeVersion = async (project: Project) => {
    await project.writeProjectManifest({
      ...project.manifest,
      version: tagVersion,
      gitHead,
    } as any);
  };

  await writeVersion(elementPlus);
  await writeVersion(eslintConfig);
  await writeVersion(metadata);

  consola.debug(chalk.green(`$GIT_HEAD: ${gitHead}`));
  consola.success(chalk.green(`Git head updated to ${gitHead}`));
}

main();
