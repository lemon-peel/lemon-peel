import { useSizeProp } from '@lemon-peel/hooks';
import { buildProps, isBoolean, isNumber, isObject, isString } from '@lemon-peel/utils';

import type { ExtractPropTypes } from 'vue';
import type Checkbox from './Checkbox.vue';

export type CheckboxValueType = string | number | boolean;

export const checkboxProps = buildProps({
  value: { type: [Number, String, Object], required: true },
  label: { type: [String, Boolean, Number, Object] },
  indeterminate: Boolean,
  disabled: Boolean,
  checked: Boolean,
  name: { type: String, default: undefined },
  id: { type: String, default: undefined },
  controls: { type: String, default: undefined },
  border: Boolean,
  size: useSizeProp,
  tabindex: { type: [String, Number] },
  validateEvent: { type: Boolean, default: true },
});

export const checkboxEmits = {
  ['update:checked']: (val: CheckboxValueType) =>
    isString(val) || isNumber(val) || isBoolean(val) || isObject(val),
  change: (val: CheckboxValueType) =>
    isString(val) || isNumber(val) || isBoolean(val) || isObject(val),
};

export type CheckboxProps = Readonly<ExtractPropTypes<typeof checkboxProps>>;
export type CheckboxEmits = typeof checkboxEmits;
export type CheckboxInstance = InstanceType<typeof Checkbox>;
