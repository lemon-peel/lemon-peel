import type { CSSProperties, ComputedRef } from 'vue';
import { computed, getCurrentInstance } from 'vue';
import { memoize } from 'lodash';
import memoOne from 'memoize-one';

import type { VirtualizedProps } from '../props';

type StyleCacheFactory = (_: any, __: any, ___: any) => (Record<string, CSSProperties>);

export function useCache(): ComputedRef<StyleCacheFactory> {
  const vm = getCurrentInstance()!;

  const props = vm.proxy!.$props as VirtualizedProps;

  return computed(() => {
    const getItemStyleCache: StyleCacheFactory = (_: any, __: any, ___: any) => ({});
    return props.perfMode
      ? memoize(getItemStyleCache)
      : memoOne(getItemStyleCache);
  });
}
