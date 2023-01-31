<template>
  <span ref="arrowRef" :class="ns.e('arrow')" data-popper-arrow="" />
</template>

<script lang="ts" setup>
import { inject, onBeforeUnmount, watch } from 'vue';
import { useNamespace } from '@lemon-peel/hooks';
import { POPPER_CONTENT_INJECTION_KEY } from '@lemon-peel/tokens';
import { popperArrowProps } from './arrow';

defineOptions({
  name: 'LpPopperArrow',
  inheritAttrs: false,
});

const props = defineProps(popperArrowProps);

const ns = useNamespace('popper');

const { arrowOffset, arrowRef } = inject(
  POPPER_CONTENT_INJECTION_KEY,
)!;

watch(
  () => props.arrowOffset,
  value => {
    arrowOffset.value = value;
  },
);

onBeforeUnmount(() => {
  arrowRef.value = undefined;
});

defineExpose({
  /**
   * @description Arrow element
   */
  arrowRef,
});
</script>
