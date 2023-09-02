import fs from 'node:fs';
import path from 'node:path';
import glob from 'fast-glob';

import { docDir, docsDirName, projDir } from '@lemon-peel/build-utils';
import { REPO_BRANCH, REPO_PATH } from '@lemon-peel/build-constants';

import { getLang, languages } from '../utils/lang';
import footerLocale from '../i18n/component/footer.json';

import type { Plugin } from 'vite';

type Append = Record<'headers' | 'footers' | 'scriptSetups', string[]>;
type FooterInfo = Record<'docs' | 'component' | 'source' | 'contributors', string>;

let compPaths: string[];

const vpScriptSetupRE = /<vp-script\s(.*\s)?setup(\s.*)?>([\S\s]*)<\/vp-script>/;

const transformVpScriptSetup = (code: string, append: Append) => {
  const matches = code.match(vpScriptSetupRE);
  if (matches) code = code.replace(matches[0], '');
  const scriptSetup = matches?.[3] ?? '';
  if (scriptSetup) append.scriptSetups.push(scriptSetup);
  return code;
};

const GITHUB_BLOB_URL = `https://github.com/${REPO_PATH}/blob/${REPO_BRANCH}`;
const GITHUB_TREE_URL = `https://github.com/${REPO_PATH}/tree/${REPO_BRANCH}`;
function transformComponentMarkdown(
  id: string,
  componentId: string,
  code: string,
  append: Append,
) {
  const lang = getLang(id);
  const footer = (footerLocale as Record<string, FooterInfo>)[lang];
  const docUrl = `${GITHUB_BLOB_URL}/${docsDirName}/en-US/component/${componentId}.md`;
  const componentUrl = `${GITHUB_TREE_URL}/packages/components/${componentId}`;
  const componentPath = path.resolve(projDir, `packages/components/${componentId}`);
  const isComponent = fs.existsSync(componentPath);

  const links = [[footer.docs, docUrl]];
  isComponent && links.unshift([footer.component, componentUrl]);

  const linksText = links
    .filter(Boolean)
    .map(([text, link]) => `[${text}](${link})`)
    .join(' • ');

  const sourceSection = `
## ${footer.source}

${linksText}`;

  const contributorsSection = `
## ${footer.contributors}

<Contributors id="${componentId}" />`;

  append.footers.push(sourceSection, isComponent ? contributorsSection : '');

  return code;
}


function combineScriptSetup(codes: string[]) {
  return `\n<script setup>
${codes.join('\n')}
</script>
`;
}

function combineMarkdown(
  code: string,
  headers: string[],
  footers: string[],
) {
  const frontmatterEnds = code.indexOf('---\n\n');
  const firstHeader = code.search(/\n#{1,6}\s.+/);
  const sliceIndex =
    firstHeader < 0
      ? frontmatterEnds < 0
        ? 0
        : frontmatterEnds + 4
      : firstHeader;

  if (headers.length > 0)
    code =
      code.slice(0, sliceIndex) + headers.join('\n') + code.slice(sliceIndex);
  code += footers.join('\n');

  return `${code}\n`;
}


export function MarkdownTransform(): Plugin {
  return {
    name: 'lemon-peel-md-transform',
    enforce: 'pre',
    async buildStart() {
      const pattern = `{${[...languages, languages[0]].join(',')}}/component`;

      compPaths = await glob(pattern, {
        cwd: docDir,
        absolute: true,
        onlyDirectories: true,
      });
    },

    async transform(code, id) {
      if (!id.endsWith('.md')) return;

      const componentId = path.basename(id, '.md');
      const append: Append = {
        headers: [],
        footers: [],
        scriptSetups: [
          `const demos = import.meta.globEager('../../examples/${componentId}/*.vue')`,
        ],
      };

      code = transformVpScriptSetup(code, append);

      if (compPaths.some(compPath => id.startsWith(compPath))) {
        code = transformComponentMarkdown(id, componentId, code, append);
      }

      return combineMarkdown(
        code,
        [combineScriptSetup(append.scriptSetups), ...append.headers],
        append.footers,
      );
    },
  };
}
