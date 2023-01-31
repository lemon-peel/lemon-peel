import { componentSizes } from '@lemon-peel/constants';
import { buildProps, definePropType } from '@lemon-peel/utils';

import type { ExtractPropTypes } from 'vue';
import type { Arrayable } from '@lemon-peel/utils';
import type { FormItemRule } from '@lemon-peel/tokens';

export const formItemValidateStates = [
  '',
  'error',
  'validating',
  'success',
] as const;
export type FormItemValidateState = typeof formItemValidateStates[number];

export type FormItemProp = Arrayable<string>;

export const formItemProps = buildProps({
  label: String,
  labelWidth: {
    type: [String, Number],
    default: '',
  },
  prop: {
    type: definePropType<FormItemProp>([String, Array]),
  },
  required: {
    type: Boolean,
    default: undefined,
  },
  rules: {
    type: definePropType<Arrayable<FormItemRule>>([Object, Array]),
  },
  error: String,
  validateStatus: {
    type: String,
    values: formItemValidateStates,
  },
  for: String,
  inlineMessage: {
    type: [String, Boolean],
    default: '',
  },
  showMessage: {
    type: Boolean,
    default: true,
  },
  size: {
    type: String,
    values: componentSizes,
  },
} as const);
export type FormItemProps = ExtractPropTypes<typeof formItemProps>;
