<template>
  <div ref="scrollbar$" :class="ns.b()">
    <div
      ref="wrap$"
      :class="[
        wrapClass,
        ns.e('wrap'),
        { [ns.em('wrap', 'hidden-default')]: !native },
      ]"
      :style="style"
      @scroll="handleScroll"
    >
      <component
        :is="tag"
        ref="resize$"
        :class="[ns.e('view'), viewClass]"
        :style="viewStyle"
      >
        <slot />
      </component>
    </div>
    <template v-if="!native">
      <bar
        ref="barRef"
        :height="sizeHeight"
        :width="sizeWidth"
        :always="always"
        :ratio-x="ratioX"
        :ratio-y="ratioY"
      />
    </template>
  </div>
</template>
<script lang="ts" setup>
import { computed, nextTick, onMounted, onUpdated, provide, reactive, ref, watch } from 'vue';
import { useEventListener, useResizeObserver } from '@vueuse/core';
import { addUnit, debugWarn, isNumber, isObject } from '@lemon-peel/utils';
import { scrollbarContextKey } from '@lemon-peel/tokens';
import { useNamespace } from '@lemon-peel/hooks';

import { GAP } from './util';
import Bar from './Bar.vue';
import { scrollbarEmits, scrollbarProps } from './scrollbar';

import type { BarInstance } from './bar';
import type { CSSProperties, StyleValue } from 'vue';

defineOptions({
  name: 'LpScrollbar',
});

const props = defineProps(scrollbarProps);
const emit = defineEmits(scrollbarEmits);

const ns = useNamespace('scrollbar');

let stopResizeObserver: (() => void) | undefined;
let stopResizeListener: (() => void) | undefined;

const scrollbar$ = ref<HTMLDivElement>();
const wrap$ = ref<HTMLDivElement>();
const resize$ = ref<HTMLElement>();

const sizeWidth = ref('0');
const sizeHeight = ref('0');
const barRef = ref<BarInstance>();
const ratioY = ref(1);
const ratioX = ref(1);
const SCOPE = 'LpScrollbar';

const style = computed<StyleValue>(() => {
  const attach: CSSProperties = {};
  if (props.height) attach.height = addUnit(props.height);
  if (props.maxHeight) attach.maxHeight = addUnit(props.maxHeight);
  return [props.wrapStyle, attach];
});

const handleScroll = () => {
  if (wrap$.value) {
    barRef.value?.handleScroll(wrap$.value);

    emit('scroll', {
      scrollTop: wrap$.value.scrollTop,
      scrollLeft: wrap$.value.scrollLeft,
    });
  }
};

function scrollTo(xCord: number, yCord?: number): void;
function scrollTo(options: ScrollToOptions): void;
function scrollTo(argument1: unknown, argument2?: number) {
  if (isObject(argument1)) {
    wrap$.value!.scrollTo(argument1);
  } else if (isNumber(argument1) && isNumber(argument2)) {
    wrap$.value!.scrollTo(argument1, argument2);
  }
}

const setScrollTop = (value: number) => {
  if (!isNumber(value)) {
    debugWarn(SCOPE, 'value must be a number');
    return;
  }
  wrap$.value!.scrollTop = value;
};

const setScrollLeft = (value: number) => {
  if (!isNumber(value)) {
    debugWarn(SCOPE, 'value must be a number');
    return;
  }
  wrap$.value!.scrollLeft = value;
};

const update = () => {
  if (!wrap$.value) return;
  const offsetHeight = wrap$.value.offsetHeight - GAP;
  const offsetWidth = wrap$.value.offsetWidth - GAP;

  const originalHeight = offsetHeight ** 2 / wrap$.value.scrollHeight;
  const originalWidth = offsetWidth ** 2 / wrap$.value.scrollWidth;
  const height = Math.max(originalHeight, props.minSize);
  const width = Math.max(originalWidth, props.minSize);

  ratioY.value =
    originalHeight /
    (offsetHeight - originalHeight) /
    (height / (offsetHeight - height));
  ratioX.value =
    originalWidth /
    (offsetWidth - originalWidth) /
    (width / (offsetWidth - width));

  sizeHeight.value = height + GAP < offsetHeight ? `${height}px` : '';
  sizeWidth.value = width + GAP < offsetWidth ? `${width}px` : '';
};

watch(
  () => props.noresize,
  noresize => {
    if (noresize) {
      stopResizeObserver?.();
      stopResizeListener?.();
    } else {
      ({ stop: stopResizeObserver } = useResizeObserver(resize$, update));
      stopResizeListener = useEventListener('resize', update);
    }
  },
  { immediate: true },
);

watch(
  () => [props.maxHeight, props.height],
  () => {
    if (!props.native)
      nextTick(() => {
        update();
        if (wrap$.value) {
          barRef.value?.handleScroll(wrap$.value);
        }
      });
  },
);

provide(
  scrollbarContextKey,
  reactive({
    scrollbarElement: scrollbar$,
    wrapElement: wrap$,
  }),
);

onMounted(() => {
  if (!props.native)
    nextTick(() => {
      update();
    });
});
onUpdated(() => update());

defineExpose({
  /** @description scrollbar wrap ref */
  wrap$,
  /** @description update scrollbar state manually */
  update,
  /** @description scrolls to a particular set of coordinates */
  scrollTo,
  /** @description set distance to scroll top */
  setScrollTop,
  /** @description set distance to scroll left */
  setScrollLeft,
  /** @description handle scroll event */
  handleScroll,
});
</script>
