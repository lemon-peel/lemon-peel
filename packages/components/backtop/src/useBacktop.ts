import { onMounted, ref, shallowRef } from 'vue';
import { useEventListener, useThrottleFn } from '@vueuse/core';
import { easeInOutCubic, throwError } from '@lemon-peel/utils';

import type { SetupContext } from 'vue';
import type { BacktopEmits, BacktopProps } from './backtop';

export const useBackTop = (
  props: BacktopProps,
  emit: SetupContext<BacktopEmits>['emit'],
  componentName: string,
) => {
  const element = shallowRef<HTMLElement>();
  const container = shallowRef<Document | HTMLElement>();
  const visible = ref(false);

  const scrollToTop = () => {
    // TODO: use https://developer.mozilla.org/en-US/docs/Web/API/Window/scrollTo, with behavior: 'smooth'

    if (!element.value) return;
    const beginTime = Date.now();
    const beginValue = element.value.scrollTop;
    const frameFunction = () => {
      if (!element.value) return;
      const progress = (Date.now() - beginTime) / 500;
      if (progress < 1) {
        element.value.scrollTop = beginValue * (1 - easeInOutCubic(progress));
        requestAnimationFrame(frameFunction);
      } else {
        element.value.scrollTop = 0;
      }
    };
    requestAnimationFrame(frameFunction);
  };
  const handleScroll = () => {
    if (element.value) visible.value = element.value.scrollTop >= props.visibilityHeight;
  };

  const handleClick = (event: MouseEvent) => {
    scrollToTop();
    emit('click', event);
  };

  const handleScrollThrottled = useThrottleFn(handleScroll, 300, true);

  useEventListener(container, 'scroll', handleScrollThrottled);
  onMounted(() => {
    container.value = document;
    element.value = document.documentElement;

    if (props.target) {
      element.value = document.querySelector<HTMLElement>(props.target) ?? undefined;
      if (!element.value) {
        throwError(componentName, `target does not exist: ${props.target}`);
      }
      container.value = element.value;
    }
  });

  return {
    visible,
    handleClick,
  };
};
