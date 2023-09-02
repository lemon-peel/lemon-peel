import consola from 'consola';

import { docsDirName } from '@lemon-peel/build-utils';
import { REPO_BRANCH, REPO_PATH } from '@lemon-peel/build-constants';

import { languages } from '../utils/lang';
import { features } from './features';
import { head } from './head';
import { mdPlugin } from './plugins';
import { nav } from './nav';
import { sidebars } from './sidebars';

import type { UserConfig } from 'vitepress';

type FuncTransformer = () => {
  props: string[];
  needRuntime: boolean;
};

const buildTransformers = () => {
  const transformer: FuncTransformer = () => {
    return {
      props: [],
      needRuntime: true,
    };
  };

  const transformers: Record<string, FuncTransformer> = {};
  const directives = [
    'infinite-scroll',
    'loading',
    'popover',
    'click-outside',
    'repeat-click',
    'trap-focus',
    'mousewheel',
    'resize',
  ];

  directives.forEach(k => {
    transformers[k] = transformer;
  });

  return transformers;
};

consola.debug(`DOC_ENV: ${process.env.DOC_ENV}`);

const locales: Record<string, {
  label: string;
  lang: string;
}> = {};

languages.forEach(lang => {
  locales[`/${lang}`] = { label: lang, lang };
});

export const config: UserConfig = {
  title: 'Element Plus',
  description: 'a Vue 3 based component library for designers and developers',
  lastUpdated: true,
  head,
  themeConfig: {
    repo: REPO_PATH,
    docsBranch: REPO_BRANCH,
    docsDir: docsDirName,

    editLinks: true,
    editLinkText: 'Edit this page on GitHub',
    lastUpdated: 'Last Updated',

    logo: '/images/element-plus-logo.svg',
    logoSmall: '/images/element-plus-logo-small.svg',
    sidebars,
    nav,
    agolia: {
      apiKey: '377f2b647a96d9b1d62e4780f2344da2',
      appId: 'BH4D9OD16A',
    },
    features,
    langs: languages,
  },

  locales,

  markdown: {
    config: md => mdPlugin(md),
  },

  vue: {
    template: {
      compilerOptions: {
        directiveTransforms: buildTransformers() as any,
      },
    },
  },
};

export default config;
