import { placements } from '@popperjs/core';
import { buildProps } from '@lemon-peel/utils';

import type { ExtractPropTypes, PropType, StyleValue } from 'vue';
import type { Options, Placement } from '@popperjs/core';
import type { Measurable } from '@lemon-peel/tokens';
import type Content from './Content.vue';

type ClassObjectType = Record<string, boolean>;
type ClassType = string | ClassObjectType | ClassType[];

const POSITIONING_STRATEGIES = ['fixed', 'absolute'] as const;

export interface CreatePopperInstanceParams {
  referenceEl: Measurable;
  popperContentEl: HTMLElement;
  arrowEl: HTMLElement | undefined;
}

export const popperCoreConfigProps = buildProps({
  boundariesPadding: { type: Number, default: 0 },
  fallbackPlacements: { type: Array as PropType<Placement[]>, default: undefined },
  gpuAcceleration: { type: Boolean, default: true },
  offset: { type: Number, default: 12 },
  placement: { type: String, values: placements, default: 'bottom' },
  popperOptions: { type: Object as PropType<Partial<Options>>, default: () => ({}) },
  strategy: { type: String, values: POSITIONING_STRATEGIES, default: 'absolute' },
});

export type PopperCoreConfigProps = ExtractPropTypes<typeof popperCoreConfigProps>;

export const popperContentProps = buildProps({
  ...popperCoreConfigProps,
  id: String,
  style: { type: [String, Array, Object] as PropType<StyleValue> },
  className: { type: [String, Array, Object] as PropType<ClassType> },
  effect: { type: String, default: 'dark' },
  visible: Boolean,
  enterable: { type: Boolean, default: true },
  pure: Boolean,
  focusOnShow: { type: Boolean, default: false },
  trapping: { type: Boolean, default: false },
  popperClass: { type: [String, Array, Object] as PropType<ClassType> },
  popperStyle: { type: [String, Array, Object] as PropType<StyleValue> },
  referenceEl: { type: Object as PropType<HTMLElement> },
  triggerTargetEl: { type: Object as PropType<HTMLElement> },
  stopPopperMouseEvent: { type: Boolean, default: true },
  ariaLabel: { type: String, default: undefined },
  virtualTriggering: Boolean,
  zIndex: Number,
});

export type PopperContentProps = ExtractPropTypes<typeof popperContentProps>;

export const popperContentEmits = {
  mouseenter: (event_: MouseEvent) => event_ instanceof MouseEvent,
  mouseleave: (event_: MouseEvent) => event_ instanceof MouseEvent,
  focus: () => true,
  blur: () => true,
  close: () => true,
};
export type PopperContentEmits = typeof popperContentEmits;

export type PopperContentInstance = InstanceType<typeof Content>;

/** @deprecated use `popperCoreConfigProps` instead, and it will be deprecated in the next major version */
export const usePopperCoreConfigProps = popperCoreConfigProps;

/** @deprecated use `popperContentProps` instead, and it will be deprecated in the next major version */
export const usePopperContentProps = popperContentProps;

/** @deprecated use `popperContentEmits` instead, and it will be deprecated in the next major version */
export const usePopperContentEmits = popperContentEmits;

/** @deprecated use `PopperCoreConfigProps` instead, and it will be deprecated in the next major version */
export type UsePopperCoreConfigProps = PopperCoreConfigProps;

/** @deprecated use `PopperContentProps` instead, and it will be deprecated in the next major version */
export type UsePopperContentProps = PopperContentProps;

/** @deprecated use `PopperContentInstance` instead, and it will be deprecated in the next major version */
export type LpPopperArrowContent = PopperContentInstance;
