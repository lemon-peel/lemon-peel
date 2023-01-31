import { buildProps, isBoolean, isNumber, isString } from '@lemon-peel/utils';
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '@lemon-peel/constants';
import { useSizeProp } from '@lemon-peel/hooks';
import type { ExtractPropTypes } from 'vue';
import type Radio from './Radio.vue';

export const radioPropsBase = buildProps({
  size: useSizeProp,
  disabled: Boolean,
  label: {
    type: [String, Number, Boolean],
    default: '',
  },
});

export const radioProps = buildProps({
  ...radioPropsBase,
  modelValue: {
    type: [String, Number, Boolean],
    default: '',
  },
  name: {
    type: String,
    default: '',
  },
  border: Boolean,
} as const);

export const radioEmits = {
  [UPDATE_MODEL_EVENT]: (value: string | number | boolean) =>
    isString(value) || isNumber(value) || isBoolean(value),
  [CHANGE_EVENT]: (value: string | number | boolean) =>
    isString(value) || isNumber(value) || isBoolean(value),
};

export type RadioProps = ExtractPropTypes<typeof radioProps>;
export type RadioEmits = typeof radioEmits;
export type RadioInstance = InstanceType<typeof Radio>;
