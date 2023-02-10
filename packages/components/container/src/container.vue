<template>
  <section :class="[ns.b(), ns.is('vertical', isVertical)]">
    <slot />
  </section>
</template>
<script lang="ts" setup>
import { computed, useSlots } from 'vue';
import { useNamespace } from '@lemon-peel/hooks';

import type { Component, VNode } from 'vue';

defineOptions({
  name: 'LpContainer',
});
const props = defineProps({
  direction: {
    type: String,
    default: 'vertical',
  },
});
const slots = useSlots();

const ns = useNamespace('container');

const isVertical = computed(() => {
  if (props.direction === 'vertical') {
    return true;
  } else if (props.direction === 'horizontal') {
    return false;
  }
  if (slots && slots.default) {
    const vNodes: VNode[] = slots.default();
    return vNodes.some(vNode => {
      const tag = (vNode.type as Component).name;
      return tag === 'LpHeader' || tag === 'LpFooter';
    });
  } else {
    return false;
  }
});
</script>
