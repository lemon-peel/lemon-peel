import { buildProps } from '@lemon-peel/utils';
import { radioPropsBase } from './radio';
import type { ExtractPropTypes } from 'vue';
import type RadioButton from './RadioButton.vue';

export const radioButtonProps = buildProps({
  ...radioPropsBase,
  name: {
    type: String,
    default: '',
  },
} as const);

export type RadioButtonProps = ExtractPropTypes<typeof radioButtonProps>;
export type RadioButtonInstance = InstanceType<typeof RadioButton>;
