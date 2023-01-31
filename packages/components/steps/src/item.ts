import { buildProps, iconPropType } from '@lemon-peel/utils';
import type Step from './Item.vue';
import type { ExtractPropTypes } from 'vue';

export const stepProps = buildProps({
  title: {
    type: String,
    default: '',
  },
  icon: {
    type: iconPropType,
  },
  description: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    values: ['', 'wait', 'process', 'finish', 'error', 'success'],
    default: '',
  },
} as const);

export type StepProps = ExtractPropTypes<typeof stepProps>;

export type StepInstance = InstanceType<typeof Step>;
