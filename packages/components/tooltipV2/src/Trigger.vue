<template>
  <forward-ref v-if="nowrap" :set-ref="setTriggerRef" only-child>
    <slot />
  </forward-ref>
  <button v-else ref="triggerRef" v-bind="$attrs">
    <slot />
  </button>
</template>

<script setup lang="ts">
import { inject, onBeforeUnmount, watch } from 'vue';
import { composeEventHandlers } from '@lemon-peel/utils';
import { tooltipV2RootKey } from '@lemon-peel/tokens';
import ForwardRef from './ForwardRef';
import { tooltipV2TriggerProps } from './trigger';
import { tooltipV2CommonProps } from './common';

defineOptions({
  name: 'LpTooltipV2Trigger',
});

const props = defineProps({
  ...tooltipV2CommonProps,
  ...tooltipV2TriggerProps,
});

/**
 * onOpen opens the tooltip instantly, onTrigger acts a lil bit differently,
 * it will check if delayDuration is set to greater than 0 and based on that result,
 * if true, it opens the tooltip after delayDuration, otherwise it opens it instantly.
 */
const { onClose, onOpen, onDelayOpen, triggerRef, contentId } =
  inject(tooltipV2RootKey)!;

let isMousedown = false;

const setTriggerRef = (element: HTMLElement | null) => {
  triggerRef.value = element;
};

const onMouseup = () => {
  isMousedown = false;
};

const onMouseenter = composeEventHandlers(props.onMouseEnter, onDelayOpen);

const onMouseleave = composeEventHandlers(props.onMouseLeave, onClose);

const onMousedown = composeEventHandlers(props.onMouseDown, () => {
  onClose();
  isMousedown = true;
  document.addEventListener('mouseup', onMouseup, { once: true });
});

const onFocus = composeEventHandlers(props.onFocus, () => {
  if (!isMousedown) onOpen();
});

const onBlur = composeEventHandlers(props.onBlur, onClose);

const onClick = composeEventHandlers(props.onClick, e => {
  if ((e as MouseEvent).detail === 0) onClose();
});

const events = {
  blur: onBlur,
  click: onClick,
  focus: onFocus,
  mousedown: onMousedown,
  mouseenter: onMouseenter,
  mouseleave: onMouseleave,
};

const setEvents = <T extends (e: Event) => void>(element: HTMLElement | null | undefined, type: 'addEventListener' | 'removeEventListener') => {
  if (element) {
    for (const [name, handler] of Object.entries(events)) {
      element[type](name, handler);
    }
  }
};

watch(triggerRef, (triggerElement, previousTriggerElement) => {
  setEvents(triggerElement, 'addEventListener');
  setEvents(previousTriggerElement, 'removeEventListener');

  if (triggerElement) {
    triggerElement.setAttribute('aria-describedby', contentId.value);
  }
});

onBeforeUnmount(() => {
  setEvents(triggerRef.value, 'removeEventListener');
  document.removeEventListener('mouseup', onMouseup);
});
</script>
