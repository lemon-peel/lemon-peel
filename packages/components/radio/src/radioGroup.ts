import { buildProps, isBoolean, isNumber, isString } from '@lemon-peel/utils';
import { useSizeProp } from '@lemon-peel/hooks';
import { UPDATE_MODEL_EVENT, CHANGE_EVENT } from '@lemon-peel/constants';

import type { ExtractPropTypes } from 'vue';
import type RadioGroup from './RadioGroup.vue';

export const radioGroupProps = buildProps({
  id: { type: String, default: undefined },
  size: useSizeProp,
  disabled: Boolean,
  value: { type: [String, Number, Boolean], default: '' },
  fill: { type: String, default: '' },
  label: { type: String, default: undefined },
  textColor: { type: String, default: '' },
  name: { type: String, default: '' },
  validateEvent: { type: Boolean, default: true },
} as const);

export type RadioGroupProps = ExtractPropTypes<typeof radioGroupProps>;

export const radioGroupEmits = {
  [CHANGE_EVENT]: (val: string | number | boolean) =>
    isString(val) || isNumber(val) || isBoolean(val),
  [UPDATE_MODEL_EVENT]: (val: string | number | boolean) =>
    isString(val) || isNumber(val) || isBoolean(val),
};

export type RadioGroupEmits = typeof radioGroupEmits;

export type RadioGroupInstance = InstanceType<typeof RadioGroup>;
