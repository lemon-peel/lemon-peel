import { computed, getCurrentInstance, inject, provide, ref, unref } from 'vue';
import { configProviderContextKey } from '@lemon-peel/tokens';
import { debugWarn, keysOf } from '@lemon-peel/utils';

import type { MaybeRef } from '@vueuse/core';
import type { App, Ref } from 'vue';
import type { ConfigProviderContext } from '@lemon-peel/tokens';

// this is meant to fix global methods like `LpMessage(opts)`, this way we can inject current locale
// into the component as default injection value.
// refer to: https://github.com/element-plus/element-plus/issues/2610#issuecomment-887965266
const globalConfig = ref<ConfigProviderContext>();

export function useGlobalConfig<K extends keyof ConfigProviderContext, D extends ConfigProviderContext[K]>(key: K, defaultValue?: D): Ref<Exclude<ConfigProviderContext[K], undefined> | D>;
export function useGlobalConfig(): Ref<ConfigProviderContext>;
export function useGlobalConfig(key?: keyof ConfigProviderContext, defaultValue?: any) {
  const config = getCurrentInstance()
    ? inject(configProviderContextKey, globalConfig)
    : globalConfig;
  return key ? computed(() => config.value?.[key] ?? defaultValue) : config;
}

const mergeConfig = (
  a: ConfigProviderContext,
  b: ConfigProviderContext,
): ConfigProviderContext => {
  const keys = [...new Set([...keysOf(a), ...keysOf(b)])];
  const object: Record<string | symbol, any> = {};
  for (const key of keys) {
    object[key] = b[key] ?? a[key];
  }
  return object;
};

export function provideGlobalConfig(
  config: MaybeRef<ConfigProviderContext>,
  app?: App,
  global = false,
) {
  const inSetup = !!getCurrentInstance();
  const oldConfig = inSetup ? useGlobalConfig() : undefined;

  const provideFn: ((key: any, value: any) => any) | undefined
    = app?.provide ?? (inSetup ? provide : undefined);

  if (!provideFn) {
    debugWarn(
      'provideGlobalConfig',
      'provideGlobalConfig() can only be used inside setup().',
    );
    return;
  }

  const context = computed(() => {
    const cfg = unref(config);
    if (!oldConfig?.value) return cfg;
    return mergeConfig(oldConfig.value, cfg);
  });

  provideFn?.(configProviderContextKey, context);
  if (global || !globalConfig.value) {
    globalConfig.value = context.value;
  }
  return context;
}
