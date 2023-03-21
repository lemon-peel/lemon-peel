import { isNil } from 'lodash-es';
import { buildProps, isString } from '@lemon-peel/utils';
import { useSizeProp } from '@lemon-peel/hooks';
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '@lemon-peel/constants';

import type { ComputedRef, ExtractPropTypes, InjectionKey, PropType } from 'vue';
import type ColorPicker from './ColorPicker.vue';

export const colorPickerProps = buildProps({
  value: String,
  id: String,
  showAlpha: Boolean,
  colorFormat: String,
  disabled: Boolean,
  size: useSizeProp,
  popperClass: { type: String, default: '' },
  label: { type: String, default: undefined },
  tabindex: { type: [String, Number], default: 0 },
  predefine: { type: Array as PropType<string[]> },
  validateEvent: { type: Boolean, default: true },
} as const);

export const colorPickerEmits = {
  [UPDATE_MODEL_EVENT]: (value: string | null) => isString(value) || isNil(value),
  [CHANGE_EVENT]: (value: string | null) => isString(value) || isNil(value),
  activeChange: (value: string | null) => isString(value) || isNil(value),
};

export type ColorPickerProps = ExtractPropTypes<typeof colorPickerProps>;
export type ColorPickerEmits = typeof colorPickerEmits;
export type ColorPickerInstance = InstanceType<typeof ColorPicker>;

export interface ColorPickerContext {
  currentColor: ComputedRef<string>;
}

export const colorPickerContextKey: InjectionKey<ColorPickerContext> = Symbol('colorPickerContextKey');
