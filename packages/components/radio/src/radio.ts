import { buildProps, isBoolean } from '@lemon-peel/utils';
import { CHANGE_EVENT } from '@lemon-peel/constants';
import { useSizeProp } from '@lemon-peel/hooks';
import type { ExtractPropTypes } from 'vue';
import type Radio from './Radio.vue';

export const radioBasicProps = buildProps({
  size: useSizeProp,
  disabled: Boolean,
  label: { type: [String, Number, Boolean], default: '' },
  value: { type: [String, Number, Boolean], required: true },
  name: { type: String, default: '' },
  border: Boolean,
} as const);

export const radioProps = buildProps({
  ...radioBasicProps,
  checked: { type: Boolean, default: false },
} as const);

export const radioEmits = {
  [CHANGE_EVENT]: null,
  ['update:checked']: (value: boolean) => isBoolean(value),
};

export type RadioProps = ExtractPropTypes<typeof radioProps>;
export type RadioEmits = typeof radioEmits;
export type RadioInstance = InstanceType<typeof Radio>;
