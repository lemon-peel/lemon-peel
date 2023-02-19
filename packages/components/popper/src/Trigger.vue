<template>
  <lp-only-child
    v-if="!virtualTriggering"
    v-bind="$attrs"
    :aria-controls="ariaControls"
    :aria-describedby="ariaDescribedby"
    :aria-expanded="ariaExpanded"
    :aria-haspopup="ariaHaspopup"
  >
    <slot />
  </lp-only-child>
</template>

<script lang="ts" setup>
import { computed, inject, onBeforeUnmount, onMounted, watch } from 'vue';
import { isNil } from 'lodash-es';
import { unrefElement } from '@vueuse/core';
import { LpOnlyChild } from '@lemon-peel/components/slot';
import { useForwardRef } from '@lemon-peel/hooks';
import { POPPER_INJECTION_KEY } from '@lemon-peel/tokens';
import { isElement } from '@lemon-peel/utils';
import { popperTriggerProps } from './trigger';

import type { WatchStopHandle } from 'vue';

defineOptions({
  name: 'LpPopperTrigger',
  inheritAttrs: false,
});

const props = defineProps(popperTriggerProps);

const { role, triggerRef } = inject(POPPER_INJECTION_KEY)!;

useForwardRef(triggerRef);

const ariaHaspopup = computed<string | null>(() => {
  if (role && role.value !== 'tooltip') {
    return role.value;
  }
  return null;
});

const ariaControls = computed<string | undefined>(() => {
  return ariaHaspopup.value ? props.id : undefined;
});

const ariaDescribedby = computed<string | null>(() => {
  if (role && role.value === 'tooltip') {
    return props.open && props.id ? props.id : null;
  }
  return null;
});

const ariaExpanded = computed<string | undefined>(() => {
  return ariaHaspopup.value ? `${props.open}` : undefined;
});

let virtualTriggerAriaStopWatch: WatchStopHandle | undefined;

onMounted(() => {
  watch(
    () => props.virtualRef,
    virtualElement => {
      if (virtualElement) {
        triggerRef.value = unrefElement(virtualElement as HTMLElement);
      }
    },
    {
      immediate: true,
    },
  );

  watch(
    triggerRef,
    (element, previousElement) => {
      virtualTriggerAriaStopWatch?.();
      virtualTriggerAriaStopWatch = undefined;
      if (isElement(element)) {
        for (const eventName of ([
          'onMouseenter',
          'onMouseleave',
          'onClick',
          'onKeydown',
          'onFocus',
          'onBlur',
          'onContextmenu',
        ] as const)) {
          const handler = props[eventName];
          if (handler) {
            (element as HTMLElement).addEventListener(
              eventName.slice(2).toLowerCase(),
              handler,
            )
            ;(previousElement as HTMLElement)?.removeEventListener?.(
              eventName.slice(2).toLowerCase(),
              handler,
            );
          }
        }
        virtualTriggerAriaStopWatch = watch(
          [ariaControls, ariaDescribedby, ariaHaspopup, ariaExpanded],
          watches => {
            for (const [index, key] of [
              'aria-controls',
              'aria-describedby',
              'aria-haspopup',
              'aria-expanded',
            ].entries()) {
              isNil(watches[index])
                ? element.removeAttribute(key)
                : element.setAttribute(key, watches[index]!);
            }
          },
          { immediate: true },
        );
      }
      if (isElement(previousElement)) {
        for (const key of [
          'aria-controls',
          'aria-describedby',
          'aria-haspopup',
          'aria-expanded',
        ]) previousElement.removeAttribute(key);
      }
    },
    {
      immediate: true,
    },
  );
});

onBeforeUnmount(() => {
  virtualTriggerAriaStopWatch?.();
  virtualTriggerAriaStopWatch = undefined;
});

defineExpose({
  /**
   * @description trigger element
   */
  triggerRef,
});
</script>
