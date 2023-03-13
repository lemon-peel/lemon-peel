<template>
  <label
    :class="[
      ns.b('button'),
      ns.bm('button', checkboxButtonSize),
      ns.is('disabled', isDisabled),
      ns.is('checked', isChecked),
      ns.is('focus', isFocused),
    ]"
  >
    <input
      :class="ns.be('button', 'original')"
      type="checkbox"
      :name="name"
      :tabindex="tabindex"
      :disabled="isDisabled"
      :value="value"
      :checked="isChecked"
      @change="onChange"
      @focus="isFocused = true"
      @blur="isFocused = false"
    >
    <span
      v-if="$slots.default || label"
      :class="ns.be('button', 'inner')"
      :style="isChecked ? activeStyle : undefined"
    >
      <slot>{{ label }}</slot>
    </span>
  </label>
</template>

<script lang="ts" setup>
import { computed, inject, useSlots } from 'vue';
import { useNamespace } from '@lemon-peel/hooks';
import { checkboxGroupContextKey } from '@lemon-peel/tokens';

import { useCheckbox } from './useCheckbox';
import { checkboxEmits, checkboxProps } from './checkbox';

import type { CSSProperties } from 'vue';

defineOptions({
  name: 'LpCheckboxButton',
});

const props = defineProps(checkboxProps);
const emit = defineEmits(checkboxEmits);
const slots = useSlots();

const {
  isFocused,
  isChecked,
  isDisabled,
  checkboxButtonSize,
  onChange,
} = useCheckbox(props, slots, emit);
const checkboxGroup = inject(checkboxGroupContextKey, null);
const ns = useNamespace('checkbox');

const activeStyle = computed<CSSProperties>(() => {
  const fillValue = checkboxGroup?.fill ?? '';

  return {
    backgroundColor: fillValue,
    borderColor: fillValue,
    color: checkboxGroup?.textColor ?? '',
    boxShadow: fillValue ? `-1px 0 0 0 ${fillValue}` : undefined,
  };
});
</script>
