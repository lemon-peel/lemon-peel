import type { PropType, ExtractPropTypes } from 'vue';
import { buildProps } from '@lemon-peel/utils';
import type Option from './Option.vue';

export const optionProps = buildProps({
  value: { required: true, type: [String, Number, Boolean, Object] as PropType<string | number | boolean | Record<string, any>> },
  label: { type: [String, Number] as PropType<string | number>, default: '' },
  disabled: { type: Boolean, default: false },
});

export type OptionProps = Readonly<ExtractPropTypes<typeof optionProps>>;

export type OptionStates = {
  index: number;
  groupDisabled: boolean;
  visible: boolean;
  hitState: boolean;
  hover: boolean;
};

export type OptionInstance = (InstanceType<typeof Option>);
