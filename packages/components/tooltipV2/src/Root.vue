<template>
  <slot :open="open" />
</template>

<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  provide,
  ref,
  unref,
  watch,
} from 'vue';
import { useTimeoutFn } from '@vueuse/core';
import { useId, useNamespace } from '@lemon-peel/hooks';
import { isNumber, isPropAbsent } from '@lemon-peel/utils';
import type { TooltipV2Context } from '@lemon-peel/tokens';
import { TOOLTIP_V2_OPEN, tooltipV2RootKey } from '@lemon-peel/tokens';
import { tooltipV2RootProps } from './root';

defineOptions({
  name: 'LpTooltipV2Root',
});

const props = defineProps(tooltipV2RootProps);

/**
 * internal open state, when no model value was provided, use this as indicator instead
 */
const openState = ref(props.defaultOpen);
const triggerRef = ref<HTMLElement | null>(null);

const open = computed<boolean>({
  get: () => (isPropAbsent(props.open) ? openState.value : props.open),
  set: val => {
    openState.value = val;
    props['onUpdate:open']?.(val);
  },
});

const isOpenDelayed = computed(
  () => isNumber(props.delayDuration) && props.delayDuration > 0,
);

const { start: onDelayedOpen, stop: clearTimer } = useTimeoutFn(
  () => {
    open.value = true;
  },
  computed(() => props.delayDuration),
  {
    immediate: false,
  },
);

const ns = useNamespace('tooltip-v2');

const contentId = useId();

const onNormalOpen = () => {
  clearTimer();
  open.value = true;
};

const onDelayOpen = () => {
  unref(isOpenDelayed) ? onDelayedOpen() : onNormalOpen();
};

const onOpen = onNormalOpen;

const onClose = () => {
  clearTimer();
  open.value = false;
};

const onChange = (val: boolean) => {
  if (open.value) {
    document.dispatchEvent(new CustomEvent(TOOLTIP_V2_OPEN));
    onOpen();
  }

  props.onOpenChange?.(val);
};

watch(open, onChange);

onMounted(() => {
  // Keeps only 1 tooltip open at a time
  document.addEventListener(TOOLTIP_V2_OPEN, onClose);
});

onBeforeUnmount(() => {
  clearTimer();
  document.removeEventListener(TOOLTIP_V2_OPEN, onClose);
});

provide(tooltipV2RootKey, {
  contentId,
  triggerRef,
  ns,

  onClose,
  onDelayOpen,
  onOpen,
} as TooltipV2Context);

defineExpose({
  /**
   * @description open tooltip programmatically
   */
  onOpen,

  /**
   * @description close tooltip programmatically
   */
  onClose,
});
</script>
