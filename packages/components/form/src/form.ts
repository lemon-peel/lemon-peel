import { componentSizes } from '@lemon-peel/constants';
import { buildProps, isArray, isBoolean, isString } from '@lemon-peel/utils';

import type { ExtractPropTypes, PropType } from 'vue';
import type { FormItemProp } from './formItem';
import type { FormRules } from '@lemon-peel/tokens';

export const formProps = buildProps({
  model: Object,
  rules: { type: Object as PropType<FormRules> },
  labelPosition: { type: String, values: ['left', 'right', 'top'], default: 'right' },
  requireAsteriskPosition: { type: String, values: ['left', 'right'], default: 'left' },
  labelWidth: { type: [String, Number], default: '' },
  labelSuffix: { type: String, default: '' },
  inline: Boolean,
  inlineMessage: Boolean,
  statusIcon: Boolean,
  showMessage: { type: Boolean, default: true },
  size: { type: String, values: componentSizes },
  disabled: Boolean,
  validateOnRuleChange: { type: Boolean, default: true },
  hideRequiredAsterisk: { type: Boolean, default: false },
  scrollToError: Boolean,
} as const);

export type FormProps = ExtractPropTypes<typeof formProps>;

export const formEmits = {
  validate: (property: FormItemProp, isValid: boolean, message: string) =>
    (isArray(property) || isString(property)) &&
    isBoolean(isValid) &&
    isString(message),
};
export type FormEmits = typeof formEmits;
