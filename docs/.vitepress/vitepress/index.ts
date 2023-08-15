import 'normalize.css';
// import 'element-plus/dist/index.css'

// for dev
// reset
import '../../../packages/theme-chalk/src/reset.scss';
import '../../../packages/theme-chalk/src/index.scss';
// for dark mode
import '../../../packages/theme-chalk/src/dark/css-vars.scss';

import './styles/css-vars.scss';
import './styles/app.scss';

// eslint-disable-next-line import/no-unresolved
import 'uno.css';

import VPDemo from './components/VpDemo.vue';
import ApiTyping from './components/globals/VpApiTyping.vue';
import ApiFunctionType from './components/globals/VpApiFunction.vue';
import ApiBooleanType from './components/globals/VpApiBool.vue';
import ApiStringType from './components/globals/VpApiString.vue';
import ApiNumberType from './components/globals/VpApiNumber.vue';
import ApiRefType from './components/globals/VpApiRef.vue';
import ApiEnumType from './components/globals/VpApiEnum.vue';
import ApiExternalType from './components/globals/VpApiExternal.vue';
import IconList from './components/globals/Icons.vue';

import type { Component } from 'vue';

export { default as NotFound } from './components/VpNotFound.vue';


export const globals: [string, Component][] = [
  ['Demo', VPDemo],
  ['IconList', IconList],
  ['ApiTyping', ApiTyping],
  ['FunctionType', ApiFunctionType],
  ['EnumType', ApiEnumType],
  ['BooleanType', ApiBooleanType],
  ['StringType', ApiStringType],
  ['NumberType', ApiNumberType],
  ['RefType', ApiRefType],
  ['ExternalType', ApiExternalType],
];

export { default } from './components/VpApp.vue';
