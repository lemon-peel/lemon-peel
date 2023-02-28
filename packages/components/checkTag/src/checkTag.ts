import { buildProps, isBoolean } from '@lemon-peel/utils';
import { CHANGE_EVENT } from '@lemon-peel/constants';

import type CheckTag from './CheckTag.vue';
import type { ExtractPropTypes } from 'vue';

export const checkTagProps = buildProps({
  checked: {
    type: Boolean,
    default: false,
  },
} as const);
export type CheckTagProps = ExtractPropTypes<typeof checkTagProps>;

export const checkTagEmits = {
  'update:checked': (value: boolean) => isBoolean(value),
  [CHANGE_EVENT]: (value: boolean) => isBoolean(value),
};
export type CheckTagEmits = typeof checkTagEmits;

export type CheckTagInstance = InstanceType<typeof CheckTag>;
