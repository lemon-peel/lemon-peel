<template>
  <component
    :is="tag"
    :id="groupId"
    :class="ns.b('group')"
    role="group"
    :aria-label="!isLabeledByFormItem ? label || 'checkbox-group' : undefined"
    :aria-labelledby="isLabeledByFormItem ? formItem?.labelId : undefined"
  >
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { computed, nextTick, provide, toRefs, watch } from 'vue';
import { pick } from 'lodash-unified';

import { UPDATE_MODEL_EVENT } from '@lemon-peel/constants';
import { debugWarn } from '@lemon-peel/utils';
import { useFormItem, useFormItemInputId, useNamespace } from '@lemon-peel/hooks';
import { checkboxGroupContextKey } from '@lemon-peel/tokens';

import { checkboxGroupEmits, checkboxGroupProps } from './checkboxGroup';

import type { CheckboxValueType } from './checkbox';

defineOptions({
  name: 'LpCheckboxGroup',
});

const props = defineProps(checkboxGroupProps);
const emit = defineEmits(checkboxGroupEmits);
const ns = useNamespace('checkbox');

const { formItem } = useFormItem();
const { inputId: groupId, isLabeledByFormItem } = useFormItemInputId(props, {
  formItemContext: formItem,
});

const changeEvent = async (value: CheckboxValueType[]) => {
  emit(UPDATE_MODEL_EVENT, value);
  await nextTick();
  emit('change', value);
};

const modelValue = computed({
  get() {
    return props.modelValue;
  },
  set(value: CheckboxValueType[]) {
    changeEvent(value);
  },
});

provide(checkboxGroupContextKey, {
  ...pick(toRefs(props), [
    'size',
    'min',
    'max',
    'disabled',
    'validateEvent',
    'fill',
    'textColor',
  ]),
  modelValue,
  changeEvent,
});

watch(
  () => props.modelValue,
  () => {
    if (props.validateEvent) {
      formItem?.validate('change').catch(error => debugWarn(error));
    }
  },
);
</script>
