<template>
  <form :class="formClasses">
    <slot />
  </form>
</template>

<script lang="ts" setup>
import { computed, provide, reactive, toRefs, watch } from 'vue';
import { debugWarn, isFunction } from '@lemon-peel/utils';
import { formContextKey } from '@lemon-peel/tokens';
import { useNamespace, useSize } from '@lemon-peel/hooks';
import { formEmits, formProps } from './form';
import { filterFields, useFormLabelWidth } from './utils';

import type { ValidateFieldsError } from 'async-validator';
import type { Arrayable } from '@lemon-peel/utils';
import type { FormContext, FormItemContext, FormValidateCallback, FormValidationResult } from '@lemon-peel/tokens';
import type { FormItemProp } from './formItem';

const COMPONENT_NAME = 'LpForm';
defineOptions({
  name: COMPONENT_NAME,
});
const allProps = defineProps(formProps);
const emit = defineEmits(formEmits);

const fields: FormItemContext[] = [];

const formSize = useSize();
const ns = useNamespace('form');
const formClasses = computed(() => {
  const { labelPosition, inline } = allProps;
  return [
    ns.b(),
    // todo: in v2.2.0, we can remove default
    // in fact, remove it doesn't affect the final style
    ns.m(formSize.value || 'default'),
    {
      [ns.m(`label-${labelPosition}`)]: labelPosition,
      [ns.m('inline')]: inline,
    },
  ];
});

const addField: FormContext['addField'] = field => {
  fields.push(field);
};

const removeField: FormContext['removeField'] = field => {
  if (field.prop) {
    fields.splice(fields.indexOf(field), 1);
  }
};

const resetFields: FormContext['resetFields'] = (props = []) => {
  if (!allProps.model) {
    debugWarn(COMPONENT_NAME, 'model is required for resetFields to work.');
    return;
  }
  for (const field of filterFields(fields, props)) field.resetField();
};

const clearValidate: FormContext['clearValidate'] = (props = []) => {
  for (const field of filterFields(fields, props)) field.clearValidate();
};

const isValidatable = computed(() => {
  const hasModel = !!allProps.model;
  if (!hasModel) {
    debugWarn(COMPONENT_NAME, 'model is required for validate to work.');
  }
  return hasModel;
});

const obtainValidateFields = (props: Arrayable<FormItemProp>) => {
  if (fields.length === 0) return [];

  const filteredFields = filterFields(fields, props);
  if (filteredFields.length === 0) {
    debugWarn(COMPONENT_NAME, 'please pass correct props!');
    return [];
  }
  return filteredFields;
};

const doValidateField = async (
  props: Arrayable<FormItemProp> = [],
): Promise<boolean> => {
  if (!isValidatable.value) return false;

  const validFields = obtainValidateFields(props);
  if (validFields.length === 0) return true;

  let validationErrors: ValidateFieldsError = {};
  for (const field of validFields) {
    try {
      await field.validate('');
    } catch (error) {
      validationErrors = {
        ...validationErrors,
        ...(error as ValidateFieldsError),
      };
    }
  }

  if (Object.keys(validationErrors).length === 0) return true;
  throw validationErrors;
};

const scrollToField = (property: FormItemProp) => {
  const field = filterFields(fields, property)[0];
  if (field) {
    field.$el?.scrollIntoView();
  }
};

const validateField: FormContext['validateField'] = async (
  modelProps = [],
  callback?,
) => {
  const shouldThrow = !isFunction(callback);
  try {
    const result = await doValidateField(modelProps);
    // When result is false meaning that the fields are not validatable
    if (result === true) {
      callback?.(result);
    }
    return result;
  } catch (error) {
    if (error instanceof Error) throw error;

    const invalidFields = error as ValidateFieldsError;

    if (allProps.scrollToError) {
      scrollToField(Object.keys(invalidFields)[0]);
    }
    callback?.(false, invalidFields);
    return shouldThrow && Promise.reject(invalidFields);
  }
};

const validate = async (
  callback?: FormValidateCallback,
): FormValidationResult => validateField(undefined, callback);

watch(
  () => allProps.rules,
  () => {
    if (allProps.validateOnRuleChange) {
      validate().catch(error => debugWarn(error));
    }
  },
  { deep: true },
);

provide(
  formContextKey,
  reactive({
    ...toRefs(allProps),
    emit,

    resetFields,
    clearValidate,
    validateField,
    addField,
    removeField,

    ...useFormLabelWidth(),
  }),
);

defineExpose({
  /** @description validate form */
  validate,
  /** @description validate form field */
  validateField,
  /** @description reset fields */
  resetFields,
  /** @description clear validation status */
  clearValidate,
  /** @description scroll to field */
  scrollToField,
});
</script>
