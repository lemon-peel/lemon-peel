import { componentSizes } from '@lemon-peel/constants';
import { buildProps } from '@lemon-peel/utils';

import type { ExtractPropTypes, PropType } from 'vue';
import type { Arrayable } from '@lemon-peel/utils';
import type { FormItemRule } from '@lemon-peel/tokens';

export const formItemValidateStates = ['', 'error', 'validating', 'success'] as const;

export type FormItemValidateState = typeof formItemValidateStates[number];

export type FormItemProp = Arrayable<string>;

export const formItemProps = buildProps({
  label: String,
  labelWidth: { type: [String, Number], default: '' },
  prop: { type: [String, Array] as PropType<FormItemProp> },
  required: { type: Boolean, default: undefined },
  rules: { type: [Object, Array] as PropType<Arrayable<FormItemRule>> },
  error: String,
  validateStatus: { type: String, values: formItemValidateStates },
  for: String,
  inlineMessage: { type: [String, Boolean], default: '' },
  showMessage: { type: Boolean, default: true },
  size: { type: String, values: componentSizes },
});

export type FormItemProps = ExtractPropTypes<typeof formItemProps>;
