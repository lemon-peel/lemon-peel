import { isString } from '@vue/shared';
import { buildProps, iconPropType, mutable } from '@lemon-peel/utils';
import { UPDATE_MODEL_EVENT } from '@lemon-peel/constants';
import { useSizeProp } from '@lemon-peel/hooks';
import type Input from './Input.vue';
import type { ExtractPropTypes, PropType, StyleValue } from 'vue';

export type InputAutoSize = { minRows?: number, maxRows?: number } | boolean;

export const inputProps = buildProps({
  /* native input id */
  id: { type: String, default: undefined },
  size: useSizeProp,
  disabled: Boolean,
  value: { type: [String, Number, Object] as PropType<string | number | null | undefined>, default: '' },
  type: { type: String, default: 'text' },
  resize: { type: String, values: ['none', 'both', 'horizontal', 'vertical'] },
  autosize: { type: [Boolean, Object] as PropType<InputAutoSize>, default: false },
  autocomplete: { type: String, default: 'off' },
  formatter: { type: Function },
  parser: { type: Function },
  placeholder: { type: String },
  form: { type: String },
  readonly: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  showPassword: { type: Boolean, default: false },
  showWordLimit: { type: Boolean, default: false },
  suffixIcon: { type: iconPropType },
  prefixIcon: { type: iconPropType },
  containerRole: { type: String, default: undefined },
  label: { type: String, default: undefined },
  tabindex: { type: [String, Number], default: 0 },
  validateEvent: { type: Boolean, default: true },
  inputStyle: { type: [Object, Array, String] as PropType<StyleValue>, default: () => mutable({} as const) },
});

export type InputProps = ExtractPropTypes<typeof inputProps>;

export const inputEmits = {
  [UPDATE_MODEL_EVENT]: (value: string) => isString(value),
  input: (value: string) => isString(value),
  change: (value: string) => isString(value),
  focus: (evt: FocusEvent) => evt instanceof FocusEvent,
  blur: (evt: FocusEvent) => evt instanceof FocusEvent,
  clear: () => true,
  mouseleave: (evt: MouseEvent) => evt instanceof MouseEvent,
  mouseenter: (evt: MouseEvent) => evt instanceof MouseEvent,
  // NOTE: when autofill by browser, the keydown event is instanceof Event, not KeyboardEvent
  // relative bug report https://github.com/element-plus/element-plus/issues/6665
  keydown: (evt: KeyboardEvent | Event) => evt instanceof Event,
  compositionstart: (evt: CompositionEvent) => evt instanceof CompositionEvent,
  compositionupdate: (evt: CompositionEvent) => evt instanceof CompositionEvent,
  compositionend: (evt: CompositionEvent) => evt instanceof CompositionEvent,
};

export type InputEmits = typeof inputEmits;

export type InputInstance = InstanceType<typeof Input>;
