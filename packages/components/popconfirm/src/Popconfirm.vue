<template>
  <lp-tooltip
    ref="tooltipRef"
    trigger="click"
    effect="light"
    v-bind="$attrs"
    :popper-class="`${ns.namespace.value}-popover`"
    :popper-style="style"
    :teleported="teleported"
    :fallback-placements="['bottom', 'top', 'right', 'left']"
    :hide-after="hideAfter"
    :persistent="persistent"
  >
    <template #content>
      <div :class="ns.b()">
        <div :class="ns.e('main')">
          <lp-icon
            v-if="!hideIcon && icon"
            :class="ns.e('icon')"
            :style="{ color: iconColor }"
          >
            <component :is="icon" />
          </lp-icon>
          {{ title }}
        </div>
        <div :class="ns.e('action')">
          <lp-button
            size="small"
            :type="cancelButtonType"
            :text="false"
            @click="cancel"
          >
            {{ finalCancelButtonText }}
          </lp-button>
          <lp-button
            size="small"
            :type="confirmButtonType"
            :text="false"
            @click="confirm"
          >
            {{ finalConfirmButtonText }}
          </lp-button>
        </div>
      </div>
    </template>
    <template v-if="$slots.reference">
      <slot name="reference" />
    </template>
  </lp-tooltip>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import LpButton from '@lemon-peel/components/button';
import LpIcon from '@lemon-peel/components/icon';
import LpTooltip from '@lemon-peel/components/tooltip';
import { useLocale, useNamespace } from '@lemon-peel/hooks';
import { addUnit } from '@lemon-peel/utils';
import { popconfirmProps } from './popconfirm';

import type { TooltipInstance } from '@lemon-peel/components/tooltip';

defineOptions({
  name: 'LpPopconfirm',
});

const props = defineProps(popconfirmProps);

const { t } = useLocale();
const ns = useNamespace('popconfirm');
const tooltipRef = ref<TooltipInstance>();

const hidePopper = () => {
  tooltipRef.value?.onClose?.();
};

const style = computed(() => {
  return {
    width: addUnit(props.width),
  };
});

const confirm = (e: Event) => {
  props.onConfirm?.(e);
  hidePopper();
};
const cancel = (e: Event) => {
  props.onCancel?.(e);
  hidePopper();
};

const finalConfirmButtonText = computed(
  () => props.confirmButtonText || t('el.popconfirm.confirmButtonText'),
);
const finalCancelButtonText = computed(
  () => props.cancelButtonText || t('el.popconfirm.cancelButtonText'),
);
</script>
