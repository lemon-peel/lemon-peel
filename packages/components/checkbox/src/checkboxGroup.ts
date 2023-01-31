import { UPDATE_MODEL_EVENT } from '@lemon-peel/constants';
import { useSizeProp } from '@lemon-peel/hooks';
import { buildProps, definePropType, isArray } from '@lemon-peel/utils';

import type { ExtractPropTypes } from 'vue';
import type checkboxGroup from './CheckboxGroup.vue';
import type { CheckboxValueType } from './Checkbox.vue';

export const checkboxGroupProps = buildProps({
  modelValue: {
    type: definePropType<Array<string | number>>(Array),
    default: () => [],
  },
  disabled: Boolean,
  min: Number,
  max: Number,
  size: useSizeProp,
  label: String,
  fill: String,
  textColor: String,
  tag: {
    type: String,
    default: 'div',
  },
  validateEvent: {
    type: Boolean,
    default: true,
  },
} as const);

export const checkboxGroupEmits = {
  [UPDATE_MODEL_EVENT]: (value: CheckboxValueType[]) => isArray(value),
  change: (value: CheckboxValueType[]) => isArray(value),
};

export type CheckboxGroupProps = ExtractPropTypes<typeof checkboxGroupProps>;
export type CheckboxGroupEmits = typeof checkboxGroupEmits;
export type CheckboxGroupInstance = InstanceType<typeof checkboxGroup>;
