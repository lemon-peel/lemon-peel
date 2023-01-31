import { computed, getCurrentInstance, onBeforeUnmount, onMounted, provide, ref, shallowRef, unref, watch } from 'vue';
import { throttle } from 'lodash-unified';
import { useResizeObserver } from '@vueuse/core';
import { debugWarn, isString } from '@lemon-peel/utils';
import { carouselContextKey } from '@lemon-peel/tokens';
import { useOrderedChildren } from '@lemon-peel/hooks';

import type { SetupContext } from 'vue';
import type { CarouselItemContext } from '@lemon-peel/tokens';
import type { CarouselEmits, CarouselProps } from './carousel';

const THROTTLE_TIME = 300;

export const useCarousel = (
  props: CarouselProps,
  emit: SetupContext<CarouselEmits>['emit'],
  componentName: string,
) => {
  const {
    children: items,
    addChild: addItem,
    removeChild: removeItem,
  } = useOrderedChildren<CarouselItemContext>(
    getCurrentInstance()!,
    'LpCarouselItem',
  );

  // refs
  const activeIndex = ref(-1);
  const timer = ref<ReturnType<typeof setInterval> | null>(null);
  const hover = ref(false);
  const root = ref<HTMLDivElement>();

  const isCardType = computed(() => props.type === 'card');
  const isVertical = computed(() => props.direction === 'vertical');

  // computed
  const arrowDisplay = computed(
    () => props.arrow !== 'never' && !unref(isVertical),
  );

  const hasLabel = computed(() => {
    return items.value.some(item => item.props.label.toString().length > 0);
  });

  function resetItemPosition(oldIndex?: number) {
    for (const [index, item] of items.value.entries()) {
      item.translateItem(index, activeIndex.value, oldIndex);
    }
  }

  function pauseTimer() {
    if (timer.value) {
      clearInterval(timer.value);
      timer.value = null;
    }
  }

  const playSlides = () => {
    if (activeIndex.value < items.value.length - 1) {
      activeIndex.value = activeIndex.value + 1;
    } else if (props.loop) {
      activeIndex.value = 0;
    }
  };

  function startTimer() {
    if (props.interval <= 0 || !props.autoplay || timer.value) return;
    timer.value = setInterval(() => playSlides(), props.interval);
  }

  function resetTimer() {
    pauseTimer();
    startTimer();
  }

  function setActiveItem(index: number | string) {
    if (isString(index)) {
      const filteredItems = items.value.filter(
        item => item.props.name === index,
      );
      if (filteredItems.length > 0) {
        index = items.value.indexOf(filteredItems[0]);
      }
    }
    index = Number(index);
    if (Number.isNaN(index) || index !== Math.floor(index)) {
      debugWarn(componentName, 'index must be integer.');
      return;
    }
    const itemCount = items.value.length;
    const oldIndex = activeIndex.value;
    if (index < 0) {
      activeIndex.value = props.loop ? itemCount - 1 : 0;
    } else if (index >= itemCount) {
      activeIndex.value = props.loop ? 0 : itemCount - 1;
    } else {
      activeIndex.value = index;
    }
    if (oldIndex === activeIndex.value) {
      resetItemPosition(oldIndex);
    }
    resetTimer();
  }

  // methods
  const throttledArrowClick = throttle(
    (index: number) => {
      setActiveItem(index);
    },
    THROTTLE_TIME,
    { trailing: true },
  );

  function handleIndicatorHover(index: number) {
    if (props.trigger === 'hover' && index !== activeIndex.value) {
      activeIndex.value = index;
    }
  }

  const throttledIndicatorHover = throttle((index: number) => {
    handleIndicatorHover(index);
  }, THROTTLE_TIME);

  function itemInStage(item: CarouselItemContext, index: number) {
    const list = unref(items);
    const itemCount = list.length;
    if (itemCount === 0 || !item.states.inStage) return false;
    const nextItemIndex = index + 1;
    const previousItemIndex = index - 1;
    const lastItemIndex = itemCount - 1;
    const isLastItemActive = list[lastItemIndex].states.active;
    const isFirstItemActive = list[0].states.active;
    const isNextItemActive = list[nextItemIndex]?.states?.active;
    const isPreviousItemActive = list[previousItemIndex]?.states?.active;

    if ((index === lastItemIndex && isFirstItemActive) || isNextItemActive) {
      return 'left';
    } else if ((index === 0 && isLastItemActive) || isPreviousItemActive) {
      return 'right';
    }
    return false;
  }

  function handleMouseEnter() {
    hover.value = true;
    if (props.pauseOnHover) {
      pauseTimer();
    }
  }

  function handleMouseLeave() {
    hover.value = false;
    startTimer();
  }

  function handleButtonEnter(arrow: 'left' | 'right') {
    if (unref(isVertical)) return;
    for (const [index, item] of items.value.entries()) {
      if (arrow === itemInStage(item, index)) {
        item.states.hover = true;
      }
    }
  }

  function handleButtonLeave() {
    if (unref(isVertical)) return;
    for (const item of items.value) {
      item.states.hover = false;
    }
  }

  function handleIndicatorClick(index: number) {
    activeIndex.value = index;
  }

  function previous() {
    setActiveItem(activeIndex.value - 1);
  }

  function next() {
    setActiveItem(activeIndex.value + 1);
  }

  // watch
  watch(
    () => activeIndex.value,
    (current, previous_) => {
      resetItemPosition(previous_);
      if (previous_ > -1) {
        emit('change', current, previous_);
      }
    },
  );
  watch(
    () => props.autoplay,
    autoplay => {
      autoplay ? startTimer() : pauseTimer();
    },
  );
  watch(
    () => props.loop,
    () => {
      setActiveItem(activeIndex.value);
    },
  );

  watch(
    () => props.interval,
    () => {
      resetTimer();
    },
  );

  watch(
    () => items.value,
    () => {
      if (items.value.length > 0) setActiveItem(props.initialIndex);
    },
  );

  const resizeObserver = shallowRef<ReturnType<typeof useResizeObserver>>();
  // lifecycle
  onMounted(() => {
    resizeObserver.value = useResizeObserver(root.value, () => {
      resetItemPosition();
    });
    startTimer();
  });

  onBeforeUnmount(() => {
    pauseTimer();
    if (root.value && resizeObserver.value) resizeObserver.value.stop();
  });

  // provide
  provide(carouselContextKey, {
    root,
    isCardType,
    isVertical,
    items,
    loop: props.loop,
    addItem,
    removeItem,
    setActiveItem,
  });

  return {
    root,
    activeIndex,
    arrowDisplay,
    hasLabel,
    hover,
    isCardType,
    items,
    handleButtonEnter,
    handleButtonLeave,
    handleIndicatorClick,
    handleMouseEnter,
    handleMouseLeave,
    setActiveItem,
    prev: previous,
    next,
    throttledArrowClick,
    throttledIndicatorHover,
  };
};
