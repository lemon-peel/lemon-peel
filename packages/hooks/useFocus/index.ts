import type { Ref } from 'vue';

export const useFocus = (
  element: Ref<{
    focus: () => void;
  } | null>,
) => {
  return {
    focus: () => {
      element.value?.focus?.();
    },
  };
};
