import { getCurrentInstance, inject, onMounted, onUnmounted, reactive, ref, unref } from 'vue';
import { debugWarn, isUndefined } from '@lemon-peel/utils';
import { carouselContextKey } from '@lemon-peel/tokens';

import type { CarouselItemProps } from './carouselItem';

function processIndex(index: number, activeIndex: number, length: number) {
  const lastItemIndex = length - 1;
  const previousItemIndex = activeIndex - 1;
  const nextItemIndex = activeIndex + 1;
  const halfItemIndex = length / 2;

  if (activeIndex === 0 && index === lastItemIndex) {
    return -1;
  } else if (activeIndex === lastItemIndex && index === 0) {
    return length;
  } else if (index < previousItemIndex && activeIndex - index >= halfItemIndex) {
    return length + 1;
  } else if (index > nextItemIndex && index - activeIndex >= halfItemIndex) {
    return -2;
  }
  return index;
}

export const useCarouselItem = (
  props: CarouselItemProps,
  componentName: string,
) => {
  const carouselContext = inject(carouselContextKey)!;
  // instance
  const instance = getCurrentInstance()!;
  if (!carouselContext) {
    debugWarn(
      componentName,
      'usage: <lp-carousel></lp-carousel-item></lp-carousel>',
    );
  }

  if (!instance) {
    debugWarn(
      componentName,
      'compositional hook can only be invoked inside setups',
    );
  }

  const CARD_SCALE = 0.83;

  const hover = ref(false);
  const translate = ref(0);
  const scale = ref(1);
  const active = ref(false);
  const ready = ref(false);
  const inStage = ref(false);
  const animating = ref(false);

  // computed
  const { isCardType, isVertical } = carouselContext;

  // methods
  function calcCardTranslate(index: number, activeIndex: number) {
    const parentWidth = carouselContext.root.value?.offsetWidth || 0;
    if (inStage.value) {
      return (parentWidth * ((2 - CARD_SCALE) * (index - activeIndex) + 1)) / 4;
    } else if (index < activeIndex) {
      return (-(1 + CARD_SCALE) * parentWidth) / 4;
    } else {
      return ((3 + CARD_SCALE) * parentWidth) / 4;
    }
  }

  function calcTranslate(
    index: number,
    activeIndex: number,
    vertical: boolean,
  ) {
    const rootElement = carouselContext.root.value;
    if (!rootElement) return 0;

    const distance = (vertical ? rootElement.offsetHeight : rootElement.offsetWidth) || 0;
    return distance * (index - activeIndex);
  }

  const translateItem = (
    index: number,
    activeIndex: number,
    oldIndex?: number,
  ) => {
    const isCard = unref(isCardType);
    const carouselItemLength = carouselContext.items.value.length ?? Number.NaN;

    const isActive = index === activeIndex;
    if (!isCard && !isUndefined(oldIndex)) {
      animating.value = isActive || index === oldIndex;
    }

    if (!isActive && carouselItemLength > 2 && carouselContext.loop) {
      index = processIndex(index, activeIndex, carouselItemLength);
    }

    const sureVertical = unref(isVertical);
    active.value = isActive;

    if (isCard) {
      if (sureVertical) {
        debugWarn(
          'Carousel',
          'vertical direction is not supported for card mode',
        );
      }
      inStage.value = Math.round(Math.abs(index - activeIndex)) <= 1;
      translate.value = calcCardTranslate(index, activeIndex);
      scale.value = unref(active) ? 1 : CARD_SCALE;
    } else {
      translate.value = calcTranslate(index, activeIndex, sureVertical);
    }

    ready.value = true;
  };

  function handleItemClick() {
    if (carouselContext && unref(isCardType)) {
      const index = carouselContext.items.value.findIndex(
        ({ uid }) => uid === instance.uid,
      );
      carouselContext.setActiveItem(index);
    }
  }

  // lifecycle
  onMounted(() => {
    carouselContext.addItem({
      props,
      states: reactive({
        hover,
        translate,
        scale,
        active,
        ready,
        inStage,
        animating,
      }),
      uid: instance.uid,
      translateItem,
    });
  });

  onUnmounted(() => {
    carouselContext.removeItem(instance.uid);
  });

  return {
    active,
    animating,
    hover,
    inStage,
    isVertical,
    translate,
    isCardType,
    scale,
    ready,
    handleItemClick,
  };
};
