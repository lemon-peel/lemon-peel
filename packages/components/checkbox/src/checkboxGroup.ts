import { UPDATE_MODEL_EVENT } from '@lemon-peel/constants';
import { useSizeProp } from '@lemon-peel/hooks';
import { buildProps, isArray } from '@lemon-peel/utils';

import type { ExtractPropTypes, PropType } from 'vue';
import type checkboxGroup from './CheckboxGroup.vue';
import type { CheckboxValueType } from './checkbox';

export const checkboxGroupProps = buildProps({
  value: { type: Array as PropType<any[]>, default: () => [] },
  disabled: Boolean,
  size: useSizeProp,
  label: String,
  fill: String,
  textColor: String,
  tag: { type: String, default: 'div' },
  validateEvent: { type: Boolean, default: true },
});

export const checkboxGroupEmits = {
  [UPDATE_MODEL_EVENT]: (value: CheckboxValueType[]) => isArray(value),
  change: (value: CheckboxValueType[]) => isArray(value),
};

export type CheckboxGroupProps = ExtractPropTypes<typeof checkboxGroupProps>;
export type CheckboxGroupEmits = typeof checkboxGroupEmits;
export type CheckboxGroupInstance = InstanceType<typeof checkboxGroup>;
