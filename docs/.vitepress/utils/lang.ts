import fs from 'node:fs';
import path from 'node:path';
import { docDir } from '@lemon-peel/build-utils';

export const languages = fs.readdirSync(path.resolve(__dirname, '../crowdin'));

export const ensureLang = (lang: string) => `/${lang}`;

export const getLang = (id: string) =>
  path.relative(docDir, id).split(path.sep)[0];
