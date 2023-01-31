import { watch } from 'vue';
import { useEventListener } from '@vueuse/core';
import type { Ref } from 'vue';

export const usePreventGlobal = <E extends keyof DocumentEventMap>(
  indicator: Ref<boolean>,
  event_: E,
  callback: (e: DocumentEventMap[E]) => boolean,
) => {
  const prevent = (e: DocumentEventMap[E]) => {
    if (callback(e)) e.stopImmediatePropagation();
  };
  let stop: (() => void) | undefined;
  watch(
    () => indicator.value,
    value => {
      if (value) {
        stop = useEventListener(document, event_, prevent, true);
      } else {
        stop?.();
      }
    },
    { immediate: true },
  );
};
