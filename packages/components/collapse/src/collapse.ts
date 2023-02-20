import { buildProps, isNumber, isString, mutable } from '@lemon-peel/utils';
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '@lemon-peel/constants';
import type { ExtractPropTypes } from 'vue';
import type { Arrayable } from '@lemon-peel/utils';

export type CollapseActiveName = string | number;
export type CollapseModelValue = Arrayable<CollapseActiveName>;

export const emitChangeFn = (value: CollapseModelValue) =>
  typeof isNumber(value) || isString(value) || Array.isArray(value);

export const collapseProps = buildProps({
  accordion: Boolean,
  modelValue: {
    type: [Array, String, Number] as PropType<CollapseModelValue>,
    default: () => mutable([] as const),
  },
} as const);
export type CollapseProps = ExtractPropTypes<typeof collapseProps>;

export const collapseEmits = {
  [UPDATE_MODEL_EVENT]: emitChangeFn,
  [CHANGE_EVENT]: emitChangeFn,
};
export type CollapseEmits = typeof collapseEmits;
