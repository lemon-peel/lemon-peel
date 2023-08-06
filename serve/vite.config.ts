import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import Components from 'unplugin-vue-components/vite';
import LomonPeelResolver from '@lemon-peel/unplugin-resolver';
import Inspect from 'vite-plugin-inspect';
import mkcert from 'vite-plugin-mkcert';
import glob from 'fast-glob';
import VueMacros from 'unplugin-vue-macros/vite';
import esbuild from 'rollup-plugin-esbuild';
import eslint from 'vite-plugin-eslint';
import checker from 'vite-plugin-checker';

import { mainPkg, mainDir, getPackageDependencies, pkgDir, projDir } from '@lemon-peel/build-utils';

import type { Plugin } from 'vite';
import './vite.init';

const esbuildPlugin = () => ({
  ...esbuild({
    target: 'chrome85',
    include: /\.vue$/,
    loaders: { '.vue': 'js' },
  }),
  enforce: 'post',
} as Plugin);

const lpComponentList = [
  'LpAffix',
  'LpAlert',
  'LpAutocomplete',
  'LpAutoResizer',
  'LpAvatar',
  'LpBacktop',
  'LpBadge',
  'LpBreadcrumb',
  'LpBreadcrumbItem',
  'LpButton',
  'LpButtonGroup',
  'LpCalendar',
  'LpCard',
  'LpCarousel',
  'LpCarouselItem',
  'LpCascader',
  'LpCascaderPanel',
  'LpCheckTag',
  'LpCheckbox',
  'LpCheckboxButton',
  'LpCheckboxGroup',
  'LpCol',
  'LpCollapse',
  'LpCollapseItem',
  'LpCollapseTransition',
  'LpColorPicker',
  'LpConfigProvider',
  'LpContainer',
  'LpAside',
  'LpFooter',
  'LpHeader',
  'LpMain',
  'LpDatePicker',
  'LpDescriptions',
  'LpDescriptionsItem',
  'LpDialog',
  'LpDivider',
  'LpDrawer',
  'LpDropdown',
  'LpDropdownItem',
  'LpDropdownMenu',
  'LpEmpty',
  'LpForm',
  'LpFormItem',
  'LpIcon',
  'LpImage',
  'LpImageViewer',
  'LpInput',
  'LpInputNumber',
  'LpLink',
  'LpMessage',
  'LpMenu',
  'LpMenuItem',
  'LpMenuItemGroup',
  'LpPageHeader',
  'LpPagination',
  'LpPopconfirm',
  'LpPopover',
  'LpPopper',
  'LpProgress',
  'LpRadio',
  'LpRadioButton',
  'LpRadioGroup',
  'LpRate',
  'LpResult',
  'LpRow',
  'LpScrollbar',
  'LpSelect',
  'LpOption',
  'LpOptionGroup',
  'LpSelectV2',
  'LpSkeleton',
  'LpSkeletonItem',
  'LpSlider',
  'LpSpace',
  'LpSteps',
  'LpStep',
  'LpSwitch',
  'LpTable',
  'LpTableColumn',
  'LpTableV2',
  'LpTabs',
  'LpTabPane',
  'LpTag',
  'LpTimePicker',
  'LpTimeSelect',
  'LpTimeline',
  'LpTimelineItem',
  'LpTooltip',
  'LpTooltipV2',
  'LpTransfer',
  'LpTree',
  'LpTreeSelect',
  'LpTreeV2',
  'LpUpload',
];

export default defineConfig(async ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  let { dependencies } = getPackageDependencies(mainPkg);
  dependencies = dependencies.filter(dep => !dep.startsWith('@types/')); // exclude dts deps
  const dayjsPlugins = await glob(['dayjs/(locale|plugin)/*.js'], {
    cwd: path.resolve(projDir, 'node_modules'),
  });
  const optimizeDeps = dayjsPlugins.map(dep => dep.replace(/\.js$/, ''));

  return {
    resolve: {
      alias: [
        { find: /^lemon-peel(\/(es|lib))?$/, replacement: path.resolve(mainDir, 'index.ts') },
        { find: /^lemon-peel\/(es|lib)\/(.*)$/, replacement: `${pkgDir}/$2` },
      ],
    },
    server: {
      host: true,
      https: !!env.HTTPS,
    },
    plugins: [
      eslint({ fix: true }),
      checker({
        vueTsc: { tsconfigPath: path.resolve(__dirname, '../tsconfig.serve.json') },
      }),
      VueMacros({
        setupComponent: false,
        setupSFC: false,
        plugins: {
          vue: vue(),
          vueJsx: vueJsx(),
        },
      }) as any,
      // vite.config.ts
      // AutoImport({
      //   include: [/\.[jt]sx?$/, /\.vue$/],
      //   vueTemplate: true,
      //   imports: [
      //     'vue',
      //     { 'lemon-peel': lpComponentList },
      //   ],
      //   dts: 'auto-imports.d.ts',
      // }),
      esbuildPlugin(),
      Components({
        include: `${__dirname}/**`,
        resolvers: LomonPeelResolver({ importStyle: 'sass' }),
        dts: false,
      }),
      mkcert(),
      Inspect(),
    ],

    optimizeDeps: {
      include: ['vue', '@vue/shared', ...dependencies, ...optimizeDeps],
    },
    esbuild: {
      target: 'chrome85',
    },
  };
});
