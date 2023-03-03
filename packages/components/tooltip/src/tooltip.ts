import { buildProps } from '@lemon-peel/utils';
import { createModelToggleComposable } from '@lemon-peel/hooks/src';
import { popperArrowProps, popperProps } from '@lemon-peel/components/popper';
import { useTooltipContentProps } from './content';
import { useTooltipTriggerProps } from './trigger';
import type Tooltip from './Tooltip.vue';

import type { ExtractPropTypes } from 'vue';

export const {
  useModelToggleProps: useTooltipModelToggleProps,
  useModelToggleEmits: useTooltipModelToggleEmits,
  useModelToggle: useTooltipModelToggle,
} = createModelToggleComposable('visible' as const);

export const useTooltipProps = buildProps({
  ...popperProps,
  ...useTooltipModelToggleProps,
  ...useTooltipContentProps,
  ...useTooltipTriggerProps,
  ...popperArrowProps,
  showArrow: {
    type: Boolean,
    default: true,
  },
});

export const tooltipEmits = [
  ...useTooltipModelToggleEmits,
  'before-show',
  'before-hide',
  'show',
  'hide',
  'open',
  'close',
];

export type LpTooltipProps = ExtractPropTypes<typeof useTooltipProps>;

export type TooltipInstance = InstanceType<typeof Tooltip>;
