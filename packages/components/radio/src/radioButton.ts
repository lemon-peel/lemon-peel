import { radioBasicProps } from './radio';
import type { ExtractPropTypes } from 'vue';
import type RadioButton from './RadioButton.vue';

export const radioButtonProps = radioBasicProps;

export type RadioButtonProps = ExtractPropTypes<typeof radioButtonProps>;
export type RadioButtonInstance = InstanceType<typeof RadioButton>;
