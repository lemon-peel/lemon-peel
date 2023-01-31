import { computed, ref } from 'vue';
import { useGlobalConfig } from '../useGlobalConfig';

const zIndex = ref(0);

export const useZIndex = () => {
  const initialZIndex = useGlobalConfig('zIndex', 2000); // TODO: move to @lemon-peel/constants
  const currentZIndex = computed(() => initialZIndex.value + zIndex.value);

  const nextZIndex = () => {
    zIndex.value++;
    return currentZIndex.value;
  };

  return {
    initialZIndex,
    currentZIndex,
    nextZIndex,
  };
};
