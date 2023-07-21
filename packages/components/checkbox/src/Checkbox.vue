<template>
  <component
    :is="!hasOwnLabel && isLabeledByFormItem ? 'span' : 'label'"
    :class="[
      ns.b(),
      ns.m(checkboxSize),
      ns.is('disabled', isDisabled),
      ns.is('bordered', border),
      ns.is('checked', isChecked),
    ]"
    :aria-controls="indeterminate ? controls : null"
    @click="onClickRoot"
  >
    <span
      :class="[
        ns.e('input'),
        ns.is('disabled', isDisabled),
        ns.is('checked', isChecked),
        ns.is('indeterminate', indeterminate),
        ns.is('focus', isFocused),
      ]"
      :tabindex="indeterminate ? 0 : undefined"
      :role="indeterminate ? 'checkbox' : undefined"
      :aria-checked="indeterminate ? 'mixed' : undefined"
    >
      <input
        :id="inputId"
        type="checkbox"
        :class="ns.e('original')"
        :aria-hidden="indeterminate ? 'true' : 'false'"
        :name="name"
        :disabled="isDisabled"
        :tabindex="tabindex"
        :checked="isChecked"
        @change="onChange"
        @focus="isFocused = true"
        @blur="isFocused = false"
      >
      <span :class="ns.e('inner')" />
    </span>
    <span v-if="hasOwnLabel" :class="ns.e('label')">
      <slot />
      <template v-if="!$slots.default">{{ label }}</template>
    </span>
  </component>
</template>

<script lang="ts" setup>
import { useSlots } from 'vue';
import { useNamespace } from '@lemon-peel/hooks';
import { checkboxEmits, checkboxProps } from './checkbox';
import { useCheckbox } from './useCheckbox';

defineOptions({ name: 'LpCheckbox' });

const props = defineProps(checkboxProps);
const emit = defineEmits(checkboxEmits);
const slots = useSlots();

const {
  inputId,
  isLabeledByFormItem,
  isChecked,
  isDisabled,
  isFocused,
  checkboxSize,
  hasOwnLabel,
  onChange,
  onClickRoot,
} = useCheckbox(props, slots, emit);

const ns = useNamespace('checkbox');

defineExpose({
  checked: isChecked,
});
</script>
