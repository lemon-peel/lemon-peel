<template>
  <div ref="contentRef" :style="contentStyle" data-tooltip-v2-root>
    <div v-if="!nowrap" :data-side="side" :class="contentClass">
      <slot :content-style="contentStyle" :content-class="contentClass" />
      <lp-visually-hidden :id="contentId" role="tooltip">
        <template v-if="ariaLabel">
          {{ ariaLabel }}
        </template>
        <slot v-else />
      </lp-visually-hidden>
      <slot name="arrow" :style="arrowStyle" :side="side" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, inject, onMounted, provide, ref, unref, watch } from 'vue';
import { offset } from '@floating-ui/dom';
import { tooltipV2ContentKey, tooltipV2RootKey } from '@lemon-peel/tokens';
import { arrowMiddleware, useFloating, useNamespace, useZIndex } from '@lemon-peel/hooks';
import LpVisuallyHidden from '@lemon-peel/components/visualHidden';
import { tooltipV2ContentProps } from './content';
import type { TooltipV2Sides } from './common';
import { tooltipV2CommonProps } from './common';

import type { CSSProperties } from 'vue';
import type { Middleware } from '@floating-ui/dom';

defineOptions({
  name: 'LpTooltipV2Content',
});

const props = defineProps({ ...tooltipV2ContentProps, ...tooltipV2CommonProps });

const { triggerRef, contentId } = inject(tooltipV2RootKey)!;

const placement = ref(props.placement);
const strategy = ref(props.strategy);
const arrowRef = ref<HTMLElement | null>(null);

const { referenceRef, contentRef, middlewareData, x, y, update } = useFloating({
  placement,
  strategy,
  middleware: computed(() => {
    const middleware: Middleware[] = [offset(props.offset)];

    if (props.showArrow) {
      middleware.push(
        arrowMiddleware({
          arrowRef,
        }),
      );
    }

    return middleware;
  }),
});

const zIndex = useZIndex().nextZIndex();

const ns = useNamespace('tooltip-v2');

const side = computed<TooltipV2Sides>(() => {
  return placement.value.split('-')[0];
});

const contentStyle = computed<CSSProperties>(() => {
  return {
    position: unref(strategy),
    top: `${unref(y) || 0}px`,
    left: `${unref(x) || 0}px`,
    zIndex,
  };
});

const arrowStyle = computed<CSSProperties>(() => {
  if (!props.showArrow) return {};

  const { arrow } = unref(middlewareData);

  return {
    [`--${ns.namespace.value}-tooltip-v2-arrow-x`]: `${arrow?.x}px` || '',
    [`--${ns.namespace.value}-tooltip-v2-arrow-y`]: `${arrow?.y}px` || '',
  };
});

const contentClass = computed(() => [
  ns.e('content'),
  ns.is('dark', props.effect === 'dark'),
  ns.is(unref(strategy)),
  props.contentClass,
]);

watch(arrowRef, () => update());

watch(
  () => props.placement,
  value => (placement.value = value),
);

onMounted(() => {
  watch(
    () => props.reference || triggerRef.value,
    element => {
      referenceRef.value = element || undefined;
    },
    {
      immediate: true,
    },
  );
});

provide(tooltipV2ContentKey, { arrowRef });
</script>
