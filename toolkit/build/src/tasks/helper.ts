import path from 'node:path';
import {
  arrayToRegExp,
  getTypeSymbol,
  hyphenate,
  isCommonType,
  isUnionType,
  main,
} from 'components-helper';
import {
  lpOutput,
  mainPackage,
  getPackageManifest,
  lpRoot,
} from '@lemon-peel/build-utils';

import type { TaskFunction } from 'gulp';
import type {
  ReAttribute,
  ReComponentName,
  ReDocUrl,
  ReWebTypesSource,
  ReWebTypesType,
} from 'components-helper';

const typeMap = {
  vue: ['Component', 'VNode', 'CSSProperties', 'StyleValue'],
};

const reComponentName: ReComponentName = title =>
  `lp-${hyphenate(title).replace(/ +/g, '-')}`;

const reDocUrl: ReDocUrl = (fileName, header) => {
  const docs = 'https://lemon-peel.org/en-US/component/';
  const hash = header ? header.replaceAll(/\s+/g, '-').toLowerCase() : '';

  return `${docs}${fileName}.html${hash ? '#' : ''}${hash}`;
};

const reWebTypesSource: ReWebTypesSource = title => {
  const symbol = `El${title
    .replaceAll(/-/g, ' ')
    .replaceAll(/^\w|\s+\w/g, item => {
      return item.trim().toUpperCase();
    })}`;

  return { symbol };
};

const reAttribute: ReAttribute = (value, key) => {
  const str = value
    .replace(/^\*\*(.*)\*\*$/, '$1')
    .replace(/^`(.*)`$/, '$1')
    .replace(/^~~(.*)~~$/, '')
    .replaceAll(/<del>.*<\/del>/g, '');

  if (key === 'Name' && /^(-|—)$/.test(str)) {
    return 'default';
  } else if (str === '' || /^(-|—)$/.test(str)) {
    return;
  } else if (key === 'Name' && /v-model:(.+)/.test(str)) {
    const m = str.match(/v-model:(.+)/);
    return m ? m[1] : undefined;
  } else if (key === 'Name' && /v-model/.test(str)) {
    return 'model-value';
  } else switch (key) {
    case 'Name': {
      return str
        .replaceAll(/\s*[*\\]\s*/g, '')
        .replaceAll(/\s*<.*>\s*/g, '')
        .replaceAll(/\s*\(.*\)\s*/g, '')
        .replaceAll(/\B([A-Z])/g, '-$1')
        .toLowerCase();
    }
    case 'Type': {
      return str
        .replaceAll(/\bfunction(\(.*\))?(:\s*\w+)?\b/gi, 'Function')
        .replaceAll(/\bdate\b/g, 'Date')
        .replaceAll(/\([^)]*\)(?!\s*=>)/g, '')
        .replaceAll(/(<[^>]*>|{[^}]*}|\([^)]*\))/g, item => {
          return item.replaceAll(/(\/|\|)/g, '=_0!');
        })
        .replaceAll(/(\b\w+)\s*\|/g, '$1 /')
        .replaceAll(/\|\s*(\b\w+)/g, '/ $1')
        .replaceAll(/=_0!/g, '|');
    }
    case 'Accepted Values': {
      return /\[.+]\(.+\)/.test(str) || /^\*$/.test(str)
        ? undefined
        : str.replaceAll(/`/g, '').replaceAll(/\([^)]*\)(?!\s*=>)/g, '');
    }
    case 'Subtags': {
      return str
        ? `el-${str
          .replaceAll(/\s*\/\s*/g, '/el-')
          .replaceAll(/\B([A-Z])/g, '-$1')
          .replaceAll(/\s+/g, '-')
          .toLowerCase()}`
        : undefined;
    }
    default: {
      return str;
    }
  }
};

const findModule = (type: string): string | undefined => {
  let result: string | undefined;

  for (const key in typeMap) {
    const regExp = arrayToRegExp(typeMap[key as keyof typeof typeMap]);
    const inModule = regExp.test(getTypeSymbol(type));

    if (inModule) {
      result = key;
      break;
    }
  }

  return result;
};

const reWebTypesType: ReWebTypesType = type => {
  const isPublicType = isCommonType(type);
  const symbol = getTypeSymbol(type);
  const isUnion = isUnionType(symbol);
  const module = findModule(symbol);

  return isPublicType || !symbol || isUnion
    ? type
    : { name: type, source: { symbol, module } };
};

export const buildHelper: TaskFunction = done => {
  const { name, version } = getPackageManifest(mainPackage);

  const tagVer = process.env.TAG_VERSION;
  const ver = tagVer
    ? tagVer.startsWith('v')
      ? tagVer.slice(1)
      : tagVer
    : version!;

  main({
    name: name!,
    version: ver,
    entry: `${path.resolve(
      lpRoot,
      'docs/en-US/component',
    )}/!(datetime-picker|message-box|message).md`,
    outDir: lpOutput,
    reComponentName,
    reDocUrl,
    reWebTypesSource,
    reAttribute,
    reWebTypesType,
    props: 'Attributes',
    propsOptions: 'Accepted Values',
    tableRegExp:
      /#+\s+(.*\s*Attributes|.*\s*Events|.*\s*Slots|.*\s*Directives)\s*\n+(\|?.+\|.+)\n\|?\s*:?-+:?\s*\|.+((\n\|?.+\|.+)+)/g,
  });

  done();
};
