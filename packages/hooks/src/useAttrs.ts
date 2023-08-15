import { computed, getCurrentInstance } from 'vue';
import { fromPairs } from 'lodash';
import { debugWarn } from '@lemon-peel/utils';

import type { ComputedRef } from 'vue';

interface Parameters {
  excludeListeners?: boolean;
  excludeKeys?: ComputedRef<string[]>;
}

const DEFAULT_EXCLUDE_KEYS = ['class', 'style'];
const LISTENER_PREFIX = /^on[A-Z]/;

export const useAttrs = (
  parameters: Parameters = {},
): ComputedRef<Record<string, unknown>> => {
  const { excludeListeners = false, excludeKeys } = parameters;
  const allExcludeKeys = computed<string[]>(() => {
    return [...(excludeKeys?.value || []), ...DEFAULT_EXCLUDE_KEYS];
  });

  const instance = getCurrentInstance();
  if (!instance) {
    debugWarn(
      'use-attrs',
      'getCurrentInstance() returned null. useAttrs() must be called at the top of a setup function',
    );
    return computed(() => ({}));
  }

  return computed(() =>
    fromPairs(
      Object.entries(instance.proxy!.$attrs!).filter(
        ([key]) =>
          !allExcludeKeys.value.includes(key) &&
          !(excludeListeners && LISTENER_PREFIX.test(key)),
      ),
    ),
  );
};
