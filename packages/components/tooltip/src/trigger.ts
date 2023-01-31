import { buildProps, definePropType } from '@lemon-peel/utils';
import { popperTriggerProps } from '@lemon-peel/components/popper';
import { EVENT_CODE } from '@lemon-peel/constants';
import type { Arrayable } from '@lemon-peel/utils';
import type { ExtractPropTypes } from 'vue';

export type TooltipTriggerType = 'hover' | 'focus' | 'click' | 'contextmenu';

export const useTooltipTriggerProps = buildProps({
  ...popperTriggerProps,
  disabled: Boolean,
  trigger: {
    type: definePropType<Arrayable<TooltipTriggerType>>([String, Array]),
    default: 'hover',
  },
  triggerKeys: {
    type: definePropType<string[]>(Array),
    default: () => [EVENT_CODE.enter, EVENT_CODE.space],
  },
} as const);

export type LpTooltipTriggerProps = ExtractPropTypes<
  typeof useTooltipTriggerProps
>;
