<template>
  <div
    ref="popperContentRef"
    :style="contentStyle"
    :class="contentClass"
    tabindex="-1"
    @mouseenter="(e) => $emit('mouseenter', e)"
    @mouseleave="(e) => $emit('mouseleave', e)"
  >
    <lp-focus-trap
      :trapped="trapped"
      :trap-on-focus-in="true"
      :focus-trap-el="popperContentRef"
      :focus-start-el="focusStartRef"
      @focus-after-trapped="onFocusAfterTrapped"
      @focus-after-released="onFocusAfterReleased"
      @focusin="onFocusInTrap"
      @focusout-prevented="onFocusoutPrevented"
      @release-requested="onReleaseRequested"
    >
      <slot />
    </lp-focus-trap>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, onBeforeUnmount, onMounted, provide, ref, unref, watch } from 'vue';
import { NOOP } from '@vue/shared';
import { isNil } from 'lodash-unified';
import { createPopper } from '@popperjs/core';
import { useNamespace, useZIndex } from '@lemon-peel/hooks';
import { POPPER_CONTENT_INJECTION_KEY, POPPER_INJECTION_KEY, formItemContextKey } from '@lemon-peel/tokens';
import { isElement } from '@lemon-peel/utils';
import LpFocusTrap from '@lemon-peel/components/focusTrap';

import { popperContentEmits, popperContentProps } from './content';
import { buildPopperOptions, unwrapMeasurableEl } from './utils';

import type { WatchStopHandle } from 'vue';
import type { CreatePopperInstanceParams } from './content';

defineOptions({
  name: 'LpPopperContent',
});

const emit = defineEmits(popperContentEmits);

const props = defineProps(popperContentProps);

const { popperInstanceRef, contentRef, triggerRef, role } = inject(
  POPPER_INJECTION_KEY,
)!;
const formItemContext = inject(formItemContextKey);
const { nextZIndex } = useZIndex();
const ns = useNamespace('popper');
const popperContentRef = ref<HTMLElement>();
const focusStartRef = ref<'container' | 'first' | HTMLElement>('first');
const arrowRef = ref<HTMLElement>();
const arrowOffset = ref<number>();
provide(POPPER_CONTENT_INJECTION_KEY, {
  arrowRef,
  arrowOffset,
});

if (
  formItemContext &&
  (formItemContext.addInputId || formItemContext.removeInputId)
) {
  // disallow auto-id from inside popper content
  provide(formItemContextKey, {
    ...formItemContext,
    addInputId: NOOP,
    removeInputId: NOOP,
  });
}

const contentZIndex = ref<number>(props.zIndex || nextZIndex());
const trapped = ref<boolean>(false);

let triggerTargetAriaStopWatch: WatchStopHandle | undefined;

const computedRef = computed(
  () => unwrapMeasurableEl(props.referenceEl) || unref(triggerRef),
);

const contentStyle = computed(
  () => [{ zIndex: unref(contentZIndex) }, props.popperStyle] as any,
);

const contentClass = computed(() => [
  ns.b(),
  ns.is('pure', props.pure),
  ns.is(props.effect),
  props.popperClass,
]);

const ariaModal = computed<string | undefined>(() => {
  return role && role.value === 'dialog' ? 'false' : undefined;
});

const createPopperInstance = ({
  referenceEl,
  popperContentEl,
  arrowEl,
}: CreatePopperInstanceParams) => {
  const options = buildPopperOptions(props, {
    arrowEl,
    arrowOffset: unref(arrowOffset),
  });

  return createPopper(referenceEl, popperContentEl, options);
};

const updatePopper = (shouldUpdateZIndex = true) => {
  unref(popperInstanceRef)?.update();
  shouldUpdateZIndex && (contentZIndex.value = props.zIndex || nextZIndex());
};

const togglePopperAlive = () => {
  const monitorable = { name: 'eventListeners', enabled: props.visible };
  unref(popperInstanceRef)?.setOptions?.(options => ({
    ...options,
    modifiers: [...(options.modifiers || []), monitorable],
  }));
  updatePopper(false);
  if (props.visible && props.focusOnShow) {
    trapped.value = true;
  } else if (props.visible === false) {
    trapped.value = false;
  }
};

const onFocusAfterTrapped = () => {
  emit('focus');
};

const onFocusAfterReleased = (event: CustomEvent) => {
  if (event.detail?.focusReason !== 'pointer') {
    focusStartRef.value = 'first';
    emit('blur');
  }
};

const onFocusInTrap = (event: FocusEvent) => {
  if (props.visible && !trapped.value) {
    if (event.target) {
      focusStartRef.value = event.target as typeof focusStartRef.value;
    }
    trapped.value = true;
  }
};

const onFocusoutPrevented = (event: CustomEvent) => {
  if (!props.trapping) {
    if (event.detail.focusReason === 'pointer') {
      event.preventDefault();
    }
    trapped.value = false;
  }
};

const onReleaseRequested = () => {
  trapped.value = false;
  emit('close');
};

onMounted(() => {
  let updateHandle: WatchStopHandle;
  watch(
    computedRef,
    referenceElement => {
      updateHandle?.();
      const popperInstance = unref(popperInstanceRef);
      popperInstance?.destroy?.();
      if (referenceElement) {
        const popperContentElement = unref(popperContentRef)!;
        contentRef.value = popperContentElement;

        popperInstanceRef.value = createPopperInstance({
          referenceEl: referenceElement,
          popperContentEl: popperContentElement,
          arrowEl: unref(arrowRef),
        });

        updateHandle = watch(
          () => referenceElement.getBoundingClientRect(),
          () => updatePopper(),
          {
            immediate: true,
          },
        );
      } else {
        popperInstanceRef.value = undefined;
      }
    },
    {
      immediate: true,
    },
  );

  watch(
    () => props.triggerTargetEl,
    (triggerTargetElement, previousTriggerTargetElement) => {
      triggerTargetAriaStopWatch?.();
      triggerTargetAriaStopWatch = undefined;

      const element = unref(triggerTargetElement || popperContentRef.value);
      const previousElement = unref(previousTriggerTargetElement || popperContentRef.value);

      if (isElement(element)) {
        triggerTargetAriaStopWatch = watch(
          [role, () => props.ariaLabel, ariaModal, () => props.id],
          watches => {
            for (const [index, key] of ['role', 'aria-label', 'aria-modal', 'id'].entries()) {
              isNil(watches[index])
                ? element.removeAttribute(key)
                : element.setAttribute(key, watches[index]!);
            }
          },
          { immediate: true },
        );
      }
      if (previousElement !== element && isElement(previousElement)) {
        for (const key of ['role', 'aria-label', 'aria-modal', 'id']) {
          previousElement.removeAttribute(key);
        }
      }
    },
    { immediate: true },
  );

  watch(() => props.visible, togglePopperAlive, { immediate: true });

  watch(
    () =>
      buildPopperOptions(props, {
        arrowEl: unref(arrowRef),
        arrowOffset: unref(arrowOffset),
      }),
    option => popperInstanceRef.value?.setOptions(option),
  );
});

onBeforeUnmount(() => {
  triggerTargetAriaStopWatch?.();
  triggerTargetAriaStopWatch = undefined;
});

defineExpose({
  /**
   * @description popper content element
   */
  popperContentRef,
  /**
   * @description popperjs instance
   */
  popperInstanceRef,
  /**
   * @description method for updating popper
   */
  updatePopper,

  /**
   * @description content style
   */
  contentStyle,
});
</script>
