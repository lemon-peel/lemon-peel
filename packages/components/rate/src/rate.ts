import { Star, StarFilled } from '@element-plus/icons-vue';
import { CHANGE_EVENT, UPDATE_MODEL_EVENT_OLD } from '@lemon-peel/constants';
import { buildProps, iconPropType, isNumber, isValidComponentSize, mutable } from '@lemon-peel/utils';
import type { ComponentSize } from '@lemon-peel/constants';
import type { Component, ExtractPropTypes, PropType } from 'vue';
import type Rate from './Rate.vue';

export const rateProps = buildProps({
  modelValue: { type: Number, default: 0 },
  id: { type: String, default: undefined },
  lowThreshold: { type: Number, default: 2 },
  highThreshold: { type: Number, default: 4 },
  max: { type: Number, default: 5 },
  colors: { type: [Array, Object] as PropType<string[] | Record<number, string>>, default: () => mutable(['', '', ''] as const) },
  voidColor: { type: String, default: '' },
  disabledVoidColor: { type: String, default: '' },
  icons: {
    type: [Array, Object] as PropType<Array<string | Component> | Record<number, string | Component>>,
    default: () => [StarFilled, StarFilled, StarFilled],
  },
  voidIcon: { type: iconPropType, default: () => Star },
  disabledVoidIcon: { type: iconPropType, default: () => StarFilled },
  disabled: { type: Boolean },
  allowHalf: { type: Boolean },
  showText: { type: Boolean },
  showScore: { type: Boolean },
  textColor: { type: String, default: '' },
  texts: {
    type: Array as PropType<string[]>,
    default: () =>
      mutable(['Extremely bad', 'Disappointed', 'Fair', 'Satisfied', 'Surprise'] as const),
  },
  scoreTemplate: { type: String, default: '{value}' },
  size: { type: String as PropType<ComponentSize>, validator: isValidComponentSize },
  label: { type: String, default: undefined },
  clearable: { type: Boolean, default: false },
} as const);

export type RateProps = ExtractPropTypes<typeof rateProps>;

export const rateEmits = {
  [CHANGE_EVENT]: (value: number) => isNumber(value),
  [UPDATE_MODEL_EVENT_OLD]: (value: number) => isNumber(value),
};
export type RateEmits = typeof rateEmits;

export type RateInstance = InstanceType<typeof Rate>;
