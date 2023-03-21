import { placements } from '@popperjs/core';
import { buildProps, isArray, isNumber } from '@lemon-peel/utils';
import { CHANGE_EVENT, INPUT_EVENT, UPDATE_MODEL_EVENT } from '@lemon-peel/constants';
import { useSizeProp } from '@lemon-peel/hooks';

import type { Arrayable } from '@lemon-peel/utils';
import type { ExtractPropTypes, PropType } from 'vue';
import type { SliderMarkerProps } from './Marker';
import type Slider from './Slider.vue';

type SliderMarks = Record<number, string | SliderMarkerProps['mark']>;

export interface SliderInitData {
  firstValue: number;
  secondValue: number;
  oldValue?: Arrayable<number>;
  dragging: boolean;
  sliderSize: number;
}

export const sliderProps = buildProps({
  value: { type: [Number, Array] as PropType<Arrayable<number>>, default: 0 },
  id: { type: String, default: undefined },
  min: { type: Number, default: 0 },
  max: { type: Number, default: 100 },
  step: { type: Number, default: 1 },
  showInput: Boolean,
  showInputControls: { type: Boolean, default: true },
  size: useSizeProp,
  inputSize: useSizeProp,
  showStops: Boolean,
  showTooltip: { type: Boolean, default: true },
  formatTooltip: { type: Function as PropType<(val: number) => number | string>, required: false },
  disabled: Boolean,
  range: Boolean,
  vertical: Boolean,
  height: String,
  debounce: { type: Number, default: 300 },
  label: { type: String, default: undefined },
  rangeStartLabel: { type: String, default: undefined },
  rangeEndLabel: { type: String, default: undefined },
  formatValueText: { type: Function as PropType<(val: number) => string>, required: false },
  tooltipClass: { type: String, default: undefined },
  placement: { type: String, values: placements, default: 'top' },
  marks: { type: Object as PropType<SliderMarks> },
  validateEvent: { type: Boolean, default: true },
} as const);

export type SliderProps = ExtractPropTypes<typeof sliderProps>;

const isValidValue = (value: Arrayable<number>) =>
  isNumber(value) || (isArray(value) && value.every(isNumber));

export const sliderEmits = {
  [UPDATE_MODEL_EVENT]: isValidValue,
  [INPUT_EVENT]: isValidValue,
  [CHANGE_EVENT]: isValidValue,
};

export type SliderEmits = typeof sliderEmits;

export type SliderInstance = InstanceType<typeof Slider>;
