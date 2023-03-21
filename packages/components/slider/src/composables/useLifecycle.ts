import { nextTick, onMounted, ref } from 'vue';
import { useEventListener } from '@vueuse/core';
import type { SliderInitData, SliderProps } from '../slider';

export const useLifecycle = (
  props: SliderProps,
  initData: SliderInitData,
  resetSize: () => void,
) => {
  const sliderWrapper = ref<HTMLElement>();

  onMounted(async () => {
    if (props.range) {
      if (Array.isArray(props.value)) {
        initData.firstValue = Math.max(props.min, props.value[0]);
        initData.secondValue = Math.min(props.max, props.value[1]);
      } else {
        initData.firstValue = props.min;
        initData.secondValue = props.max;
      }
      initData.oldValue = [initData.firstValue, initData.secondValue];
    } else {
      initData.firstValue = typeof props.value !== 'number' ||
        Number.isNaN(props.value) ? props.min : Math.min(
          props.max,
          Math.max(props.min, props.value),
        );
      initData.oldValue = initData.firstValue;
    }

    useEventListener(window, 'resize', resetSize);

    await nextTick();
    resetSize();
  });

  return {
    sliderWrapper,
  };
};
