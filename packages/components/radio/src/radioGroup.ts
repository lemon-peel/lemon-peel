import { buildProps } from '@lemon-peel/utils';
import { useSizeProp } from '@lemon-peel/hooks';

import type { ExtractPropTypes } from 'vue';

import { radioEmits } from './radio';

import type RadioGroup from './RadioGroup.vue';

export const radioGroupProps = buildProps({
  id: {
    type: String,
    default: undefined,
  },
  size: useSizeProp,
  disabled: Boolean,
  modelValue: {
    type: [String, Number, Boolean],
    default: '',
  },
  fill: {
    type: String,
    default: '',
  },
  label: {
    type: String,
    default: undefined,
  },
  textColor: {
    type: String,
    default: '',
  },
  name: {
    type: String,
    default: undefined,
  },
  validateEvent: {
    type: Boolean,
    default: true,
  },
} as const);
export type RadioGroupProps = ExtractPropTypes<typeof radioGroupProps>;

export const radioGroupEmits = radioEmits;
export type RadioGroupEmits = typeof radioGroupEmits;
export type RadioGroupInstance = InstanceType<typeof RadioGroup>;
