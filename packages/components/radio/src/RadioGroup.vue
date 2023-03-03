<template>
  <div
    :id="groupId"
    ref="radioGroupRef"
    :class="ns.b('group')"
    role="radiogroup"
    :aria-label="!isLabeledByFormItem ? label || 'radio-group' : undefined"
    :aria-labelledby="isLabeledByFormItem ? formItem!.labelId : undefined"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, provide, reactive, ref, toRefs, watch } from 'vue';
import { useFormItem, useFormItemInputId, useId, useNamespace } from '@lemon-peel/hooks';
import { UPDATE_MODEL_EVENT } from '@lemon-peel/constants';
import { radioGroupKey } from '@lemon-peel/tokens';
import { debugWarn } from '@lemon-peel/utils';

import { radioGroupEmits, radioGroupProps } from './radioGroup';

import type { RadioGroupProps } from './radioGroup';

defineOptions({ name: 'LpRadioGroup' });

const props = defineProps(radioGroupProps);
const emit = defineEmits(radioGroupEmits);

const ns = useNamespace('radio');
const radioId = useId();
const radioGroupRef = ref<HTMLDivElement>();
const { formItem } = useFormItem();
const { inputId: groupId, isLabeledByFormItem } = useFormItemInputId(props, {
  formItemContext: formItem,
});

const changeEvent = (value: RadioGroupProps['modelValue']) => {
  emit(UPDATE_MODEL_EVENT, value);
  nextTick(() => emit('change', value));
};

onMounted(() => {
  const radios =
    radioGroupRef.value!.querySelectorAll<HTMLInputElement>('[type=radio]');
  const firstLabel = radios[0];
  if (![...radios].some(radio => radio.checked) && firstLabel) {
    firstLabel.tabIndex = 0;
  }
});

const name = computed(() => {
  return props.name || radioId.value;
});

provide(
  radioGroupKey,
  reactive({
    ...toRefs(props),
    changeEvent,
    name,
  }),
);

watch(
  () => props.modelValue,
  () => {
    if (props.validateEvent) {
      formItem?.validate('change').catch(error => debugWarn(error));
    }
  },
);
</script>
