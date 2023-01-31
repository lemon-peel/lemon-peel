import type { PropType } from 'vue';
import { buildProps } from '@lemon-peel/utils';

export const optionProps = buildProps({
  value: {
    required: true,
    type: [String, Number, Boolean, Object] as PropType<string | number | boolean | Record<string, any>>,
  },
  label: {
    type: [String, Number] as PropType<string | number>,
    default: '',
  },
  created: Boolean,
  disabled: {
    type: Boolean,
    default: false,
  },
});

export type OptionStates = {
  index: number;
  groupDisabled: boolean;
  visible: boolean;
  hitState: boolean;
  hover: boolean;
};

export type OptionInstance = (InstanceType<typeof Option>);
