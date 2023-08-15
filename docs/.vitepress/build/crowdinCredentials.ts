import path from 'node:path';
import fs from 'node:fs/promises';
import chalk from 'chalk';
import consola from 'consola';
import { docDir } from '@lemon-peel/build-utils';

const credentialPlaceholder = 'API_TOKEN_PLACEHOLDER';

const CREDENTIAL = process.env.CROWDIN_TOKEN;
if (!CREDENTIAL) {
  throw new Error('Environment variable CROWDIN_TOKEN cannot be empty');
}

(async () => {
  consola.debug(chalk.cyan('Fetching Crowdin credential'));
  const configPath = path.resolve(docDir, 'crowdin.yml');

  const file = await fs.readFile(configPath, {
    encoding: 'utf8',
  });
  await fs.writeFile(
    configPath,
    file.replace(credentialPlaceholder, CREDENTIAL),
  );
  consola.success(chalk.green('Crowdin credential update successfully'));
})();
