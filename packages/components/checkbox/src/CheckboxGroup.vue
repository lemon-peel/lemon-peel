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
import { computed, nextTick, provide, reactive, toRefs, watch } from 'vue';
import { pick } from 'lodash-es';

import { UPDATE_MODEL_EVENT, UPDATE_MODEL_EVENT_OLD } from '@lemon-peel/constants';
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

const providePropKeys = [
  'value',
  'size',
  'disabled',
  'validateEvent',
  'fill',
  'textColor',
] as const;

const  provideObj = reactive({
  ...pick(props, providePropKeys),
  changeEvent,
});

provide(
  checkboxGroupContextKey,
  provideObj,
);

watch(props, () => {
  Object.assign(provideObj, pick(props, providePropKeys));
});

watch(
  () => props.value,
  () => {
    if (props.validateEvent) {
      formItem?.validate('change').catch(error => debugWarn(error));
    }
  },
);
</script>
