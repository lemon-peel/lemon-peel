<template>
  <lp-popper ref="popperRef" :role="role">
    <lp-tooltip-trigger :disabled="disabled" :trigger="trigger" :trigger-keys="triggerKeys" :virtual-ref="virtualRef" :virtual-triggering="virtualTriggering">
      <slot v-if="$slots.default" />
    </lp-tooltip-trigger>
    <lp-tooltip-content
      ref="contentRef"
      :aria-label="ariaLabel" :boundaries-padding="boundariesPadding" :content="content" :disabled="disabled" :effect="effect" :enterable="enterable"
      :fallback-placements="fallbackPlacements" :hide-after="hideAfter" :gpu-acceleration="gpuAcceleration" :offset="offset" :persistent="persistent"
      :popper-class="popperClass" :popper-style="popperStyle" :placement="placement" :popper-options="popperOptions" :pure="pure" :raw-content="rawContent"
      :reference-el="referenceEl" :trigger-target-el="triggerTargetEl" :show-after="showAfter" :strategy="strategy" :teleported="teleported" :transition="transition"
      :virtual-triggering="virtualTriggering" :z-index="zIndex" :append-to="appendTo"
    >
      <slot name="content">
        <span v-if="rawContent" v-html="content" />
        <span v-else>{{ content }}</span>
      </slot>
      <lp-popper-arrow v-if="showArrow" :arrow-offset="arrowOffset" />
    </lp-tooltip-content>
  </lp-popper>
</template>

<script lang="ts" setup>
import { computed, onDeactivated, provide, readonly, ref, toRef, unref, watch } from 'vue';

import { isBoolean } from '@lemon-peel/utils';
import { useDelayedToggle, useId, usePopperContainer } from '@lemon-peel/hooks';
import { TOOLTIP_INJECTION_KEY } from '@lemon-peel/tokens';
import { LpPopperArrow } from '@lemon-peel/components/popper';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import LpPopper from '@lemon-peel/components/popper';

import { tooltipEmits, useTooltipModelToggle, useTooltipProps } from './tooltip';
import LpTooltipTrigger from './Trigger.vue';
import LpTooltipContent from './Content.vue';

defineOptions({
  name: 'LpTooltip',
});

const props = defineProps(useTooltipProps);
const emit = defineEmits(tooltipEmits);

usePopperContainer();

const id = useId();
// TODO any is temporary, replace with `InstanceType<typeof LpPopper> | null` later
const popperRef = ref<InstanceType<typeof LpPopper>>(null as any);
// TODO any is temporary, replace with `InstanceType<typeof LpTooltipContent> | null` later
const contentRef = ref<any>();

const updatePopper = () => {
  const popperComponent = unref(popperRef);
  if (popperComponent) {
    popperComponent.popperInstanceRef?.update();
  }
};

const open = ref(false);
const toggleReason = ref<Event>();

const { show, hide, hasUpdateHandler } = useTooltipModelToggle({
  indicator: open,
  toggleReason,
});

const { onOpen, onClose } = useDelayedToggle({
  showAfter: toRef(props, 'showAfter'),
  hideAfter: toRef(props, 'hideAfter'),
  open: show,
  close: hide,
});

const controlled = computed(
  () => isBoolean(props.visible) && !hasUpdateHandler.value,
);

provide(TOOLTIP_INJECTION_KEY, {
  controlled,
  id,
  open: readonly(open),
  trigger: toRef(props, 'trigger'),
  onOpen: (event?: Event) => {
    onOpen(event);
  },
  onClose: (event?: Event) => {
    onClose(event);
  },
  onToggle: (event?: Event) => {
    if (unref(open)) {
      onClose(event);
    } else {
      onOpen(event);
    }
  },
  onShow: () => {
    emit('show', toggleReason.value);
  },
  onHide: () => {
    emit('hide', toggleReason.value);
  },
  onBeforeShow: () => {
    emit('before-show', toggleReason.value);
  },
  onBeforeHide: () => {
    emit('before-hide', toggleReason.value);
  },
  updatePopper,
});

watch(
  () => props.disabled,
  disabled => {
    if (disabled && open.value) {
      open.value = false;
    }
  },
);

const isFocusInsideContent = () => {
  const popperContent: HTMLElement | undefined =
    contentRef.value?.contentRef?.popperContentRef;
  return popperContent && popperContent.contains(document.activeElement);
};

onDeactivated(() => open.value && hide());

defineExpose({
  /**
   * @description lp-popper component instance
   */
  popperRef,
  /**
   * @description lp-tooltip-content component instance
   */
  contentRef,
  /**
   * @description validate current focus event is trigger inside lp-tooltip-content
   */
  isFocusInsideContent,
  /**
   * @description update lp-popper component instance
   */
  updatePopper,
  /**
   * @description expose onOpen function to mange lp-tooltip open state
   */
  onOpen,
  /**
   * @description expose onOpen function to mange lp-tooltip open state
   */
  onClose,
  /**
   * @description expose hide function
   */
  hide,
});
</script>
