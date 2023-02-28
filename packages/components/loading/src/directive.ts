// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { isRef, ref } from 'vue';
import { hyphenate, isObject, isString } from '@vue/shared';
import { Loading } from './service';
import type { Directive, DirectiveBinding, UnwrapRef } from 'vue';
import type { LoadingOptions } from './types';
import type { LoadingInstance } from './loading';

const INSTANCE_KEY = Symbol('LpLoading');

export type LoadingBinding = boolean | UnwrapRef<LoadingOptions>;
export interface ElementLoading extends HTMLElement {
  [INSTANCE_KEY]?: {
    instance: LoadingInstance;
    options: LoadingOptions;
  };
}

const createInstance = (
  element: ElementLoading,
  binding: DirectiveBinding<LoadingBinding>,
) => {
  const vm = binding.instance;

  const getBindingProperty = <K extends keyof LoadingOptions>(
    key: K,
  ): LoadingOptions[K] | undefined => {
    return isObject(binding.value) ? binding.value[key] : undefined;
  };

  const resolveExpression = (key: any) => {
    const data = (isString(key) && vm?.[key]) || key;
    return data ? ref(data) : data;
  };

  const getProperty = <K extends keyof LoadingOptions>(name: K) =>
    resolveExpression(
      getBindingProperty(name) ||
        element.getAttribute(`element-loading-${hyphenate(name)}`),
    );

  const fullscreen =
    getBindingProperty('fullscreen') ?? binding.modifiers.fullscreen;

  const options: LoadingOptions = {
    text: getProperty('text'),
    svg: getProperty('svg'),
    svgViewBox: getProperty('svgViewBox'),
    spinner: getProperty('spinner'),
    background: getProperty('background'),
    customClass: getProperty('customClass'),
    fullscreen,
    target: getBindingProperty('target') ?? (fullscreen ? undefined : element),
    body: getBindingProperty('body') ?? binding.modifiers.body,
    lock: getBindingProperty('lock') ?? binding.modifiers.lock,
  };
  element[INSTANCE_KEY] = {
    options,
    instance: Loading(options),
  };
};

const updateOptions = (
  newOptions: UnwrapRef<LoadingOptions>,
  originalOptions: LoadingOptions,
) => {
  for (const key of Object.keys(originalOptions)) {
    if (isRef(originalOptions[key]))
      originalOptions[key].value = newOptions[key];
  }
};

export const vLoading: Directive<ElementLoading, LoadingBinding> = {
  mounted(element, binding) {
    if (binding.value) {
      createInstance(element, binding);
    }
  },
  updated(element, binding) {
    const instance = element[INSTANCE_KEY];
    if (binding.oldValue !== binding.value) {
      if (binding.value && !binding.oldValue) {
        createInstance(element, binding);
      } else if (binding.value && binding.oldValue) {
        if (isObject(binding.value))
          updateOptions(binding.value, instance!.options);
      } else {
        instance?.instance.close();
      }
    }
  },
  unmounted(element) {
    element[INSTANCE_KEY]?.instance.close();
  },
};
