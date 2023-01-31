<template>
  <div
    v-show="ready"
    :class="[
      ns.e('item'),
      ns.is('active', active),
      ns.is('in-stage', inStage),
      ns.is('hover', hover),
      ns.is('animating', animating),
      { [ns.em('item', 'card')]: isCardType },
    ]"
    :style="itemStyle"
    @click="handleItemClick"
  >
    <div v-if="isCardType" v-show="!active" :class="ns.e('mask')" />
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed, unref } from 'vue';
import { useNamespace } from '@lemon-peel/hooks';
import { carouselItemProps } from './carouselItem';
import { useCarouselItem } from './useCarouselItem';

import type { CSSProperties } from 'vue';

defineOptions({
  name: 'LpCarouselItem',
});

const props = defineProps(carouselItemProps);
const ns = useNamespace('carousel');
const COMPONENT_NAME = 'LpCarouselItem';
// inject
const {
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
} = useCarouselItem(props, COMPONENT_NAME);

const itemStyle = computed<CSSProperties>(() => {
  const translateType = `translate${unref(isVertical) ? 'Y' : 'X'}`;
  const transform = `${translateType}(${unref(translate)}px) scale(${unref(scale)})`;

  return {
    transform,
  };
});
</script>
