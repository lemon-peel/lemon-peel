import { computed, unref } from 'vue';
import { useData } from 'vitepress';
import { isClient, useBrowserLocation } from '@vueuse/core';
import type { MaybeRef } from '@vueuse/core';

const location = useBrowserLocation();

export const useFeatureFlag = (flag: MaybeRef<string>) => {
  const { theme } = useData();
  return computed(() => {
    const localFlag = unref(flag);

    if (isClient) {
      const params = new URLSearchParams(location.value.search);
      if (params.get(`feature:${localFlag}`)) {
        return true;
      }
    }

    return theme.value.features[localFlag];
  });
};
