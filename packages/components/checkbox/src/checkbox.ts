import { UPDATE_MODEL_EVENT } from '@lemon-peel/constants';
import { useSizeProp } from '@lemon-peel/hooks/src';
import { isBoolean, isNumber, isString } from '@lemon-peel/utils';

import type { ExtractPropTypes } from 'vue';
import type Checkbox from './Checkbox.vue';

export type CheckboxValueType = string | number | boolean;

export const checkboxProps = {
  modelValue: {
    type: [Number, String, Boolean],
    default: undefined,
  },
  label: {
    type: [String, Boolean, Number, Object],
  },
  indeterminate: Boolean,
  disabled: Boolean,
  checked: Boolean,
  name: {
    type: String,
    default: undefined,
  },
  trueLabel: {
    type: [String, Number],
    default: undefined,
  },
  falseLabel: {
    type: [String, Number],
    default: undefined,
  },
  id: {
    type: String,
    default: undefined,
  },
  controls: {
    type: String,
    default: undefined,
  },
  border: Boolean,
  size: useSizeProp,
  tabindex: [String, Number],
  validateEvent: {
    type: Boolean,
    default: true,
  },
};

export const checkboxEmits = {
  [UPDATE_MODEL_EVENT]: (value: CheckboxValueType) =>
    isString(value) || isNumber(value) || isBoolean(value),
  change: (value: CheckboxValueType) =>
    isString(value) || isNumber(value) || isBoolean(value),
};

export type CheckboxProps = ExtractPropTypes<typeof checkboxProps>;
export type CheckboxEmits = typeof checkboxEmits;
export type CheckboxInstance = InstanceType<typeof Checkbox>;
