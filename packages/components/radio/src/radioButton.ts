import { buildProps } from '@lemon-peel/utils';
import { radioProps } from './radio';
import type { ExtractPropTypes } from 'vue';
import type RadioButton from './RadioButton.vue';

export const radioButtonProps = buildProps({
  ...radioProps,
  name: { type: String, default: '' },
} as const);

export type RadioButtonProps = ExtractPropTypes<typeof radioButtonProps>;
export type RadioButtonInstance = InstanceType<typeof RadioButton>;
