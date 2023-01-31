<template>
  <div
    ref="root"
    :class="carouselClasses"
    @mouseenter.stop="handleMouseEnter"
    @mouseleave.stop="handleMouseLeave"
  >
    <div :class="ns.e('container')" :style="{ height: height }">
      <transition v-if="arrowDisplay" name="carousel-arrow-left">
        <button
          v-show="
            (arrow === 'always' || hover) && (props.loop || activeIndex > 0)
          "
          type="button"
          :class="[ns.e('arrow'), ns.em('arrow', 'left')]"
          @mouseenter="handleButtonEnter('left')"
          @mouseleave="handleButtonLeave"
          @click.stop="throttledArrowClick(activeIndex - 1)"
        >
          <LpIcon>
            <ArrowLeft />
          </LpIcon>
        </button>
      </transition>
      <transition v-if="arrowDisplay" name="carousel-arrow-right">
        <button
          v-show="
            (arrow === 'always' || hover) &&
              (props.loop || activeIndex < items.length - 1)
          "
          type="button"
          :class="[ns.e('arrow'), ns.em('arrow', 'right')]"
          @mouseenter="handleButtonEnter('right')"
          @mouseleave="handleButtonLeave"
          @click.stop="throttledArrowClick(activeIndex + 1)"
        >
          <LpIcon>
            <ArrowRight />
          </LpIcon>
        </button>
      </transition>
      <slot />
    </div>
    <ul v-if="indicatorPosition !== 'none'" :class="indicatorsClasses">
      <li
        v-for="(item, index) in items"
        :key="index"
        :class="[
          ns.e('indicator'),
          ns.em('indicator', direction),
          ns.is('active', index === activeIndex),
        ]"
        @mouseenter="throttledIndicatorHover(index)"
        @click.stop="handleIndicatorClick(index)"
      >
        <button :class="ns.e('button')">
          <span v-if="hasLabel">{{ item.props.label }}</span>
        </button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { computed, unref } from 'vue';
import { LpIcon } from '@lemon-peel/components/icon';
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue';
import { useNamespace } from '@lemon-peel/hooks';
import { carouselEmits, carouselProps } from './carousel';
import { useCarousel } from './useCarousel';

const COMPONENT_NAME = 'LpCarousel';
defineOptions({ name: COMPONENT_NAME });

const props = defineProps(carouselProps);
const emit = defineEmits(carouselEmits);
const {
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
  prev,
  next,
  throttledArrowClick,
  throttledIndicatorHover,
} = useCarousel(props, emit, COMPONENT_NAME);
const ns = useNamespace('carousel');

const carouselClasses = computed(() => {
  const classes = [ns.b(), ns.m(props.direction)];
  if (unref(isCardType)) {
    classes.push(ns.m('card'));
  }
  return classes;
});

const indicatorsClasses = computed(() => {
  const classes = [ns.e('indicators'), ns.em('indicators', props.direction)];
  if (unref(hasLabel)) {
    classes.push(ns.em('indicators', 'labels'));
  }
  if (props.indicatorPosition === 'outside' || unref(isCardType)) {
    classes.push(ns.em('indicators', 'outside'));
  }
  return classes;
});

defineExpose({
  /** @description manually switch slide */
  setActiveItem,
  /** @description switch to the previous slide */
  prev,
  /** @description switch to the next slide */
  next,
});
</script>
