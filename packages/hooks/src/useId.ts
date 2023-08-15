import { computed, inject, unref } from 'vue';
import { isClient } from '@vueuse/core';
import { debugWarn } from '@lemon-peel/utils';
import { useGlobalConfig } from './useGlobalConfig';
import { defaultNamespace } from './useNamespace';

import type { InjectionKey, Ref } from 'vue';
import type { MaybeRef } from '@vueuse/core';

export type ElIdInjectionContext = {
  prefix: number;
  current: number;
};

const defaultIdInjection = {
  prefix: Math.floor(Math.random() * 10_000),
  current: 0,
};

export const ID_INJECTION_KEY: InjectionKey<ElIdInjectionContext> =
  Symbol('lpIdInjection');

export const useId = (deterministicId?: MaybeRef<string>): Ref<string> => {
  const idInjection = inject(ID_INJECTION_KEY, defaultIdInjection);

  if (!isClient && idInjection === defaultIdInjection) {
    debugWarn(
      'IdInjection',
      `Looks like you are using server rendering, you must provide a id provider to ensure the hydration process to be succeed
usage: app.provide(ID_INJECTION_KEY, {
  prefix: number,
  current: number,
})`,
    );
  }

  const namespace = useGlobalConfig('namespace', defaultNamespace);
  const idReference = computed(
    () =>
      unref(deterministicId) ||
      `${namespace.value}-id-${idInjection.prefix}-${idInjection.current++}`,
  );

  return idReference;
};
