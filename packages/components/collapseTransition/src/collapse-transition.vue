<template>
  <transition :name="ns.b()" v-on="on">
    <slot />
  </transition>
</template>
<script lang="ts" setup>
import { useNamespace } from '@lemon-peel/hooks';
import type { RendererElement } from '@vue/runtime-core';

defineOptions({
  name: 'LpCollapseTransition',
});

const ns = useNamespace('collapse-transition');

const on = {
  beforeEnter(element: RendererElement) {
    if (!element.dataset) element.dataset = {};

    element.dataset.oldPaddingTop = element.style.paddingTop;
    element.dataset.oldPaddingBottom = element.style.paddingBottom;

    element.style.maxHeight = 0;
    element.style.paddingTop = 0;
    element.style.paddingBottom = 0;
  },

  enter(element: RendererElement) {
    element.dataset.oldOverflow = element.style.overflow;
    if (element.scrollHeight === 0) {
      element.style.maxHeight = 0;
      element.style.paddingTop = element.dataset.oldPaddingTop;
      element.style.paddingBottom = element.dataset.oldPaddingBottom;
    } else {
      element.style.maxHeight = `${element.scrollHeight}px`;
      element.style.paddingTop = element.dataset.oldPaddingTop;
      element.style.paddingBottom = element.dataset.oldPaddingBottom;
    }

    element.style.overflow = 'hidden';
  },

  afterEnter(element: RendererElement) {
    element.style.maxHeight = '';
    element.style.overflow = element.dataset.oldOverflow;
  },

  beforeLeave(element: RendererElement) {
    if (!element.dataset) element.dataset = {};
    element.dataset.oldPaddingTop = element.style.paddingTop;
    element.dataset.oldPaddingBottom = element.style.paddingBottom;
    element.dataset.oldOverflow = element.style.overflow;

    element.style.maxHeight = `${element.scrollHeight}px`;
    element.style.overflow = 'hidden';
  },

  leave(element: RendererElement) {
    if (element.scrollHeight !== 0) {
      element.style.maxHeight = 0;
      element.style.paddingTop = 0;
      element.style.paddingBottom = 0;
    }
  },

  afterLeave(element: RendererElement) {
    element.style.maxHeight = '';
    element.style.overflow = element.dataset.oldOverflow;
    element.style.paddingTop = element.dataset.oldPaddingTop;
    element.style.paddingBottom = element.dataset.oldPaddingBottom;
  },
};
</script>
