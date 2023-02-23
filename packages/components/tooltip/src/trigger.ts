import { buildProps } from '@lemon-peel/utils';
import { popperTriggerProps } from '@lemon-peel/components/popper';
import { EVENT_CODE } from '@lemon-peel/constants';
import type { Arrayable } from '@lemon-peel/utils';
import type { ExtractPropTypes, PropType } from 'vue';

export type TooltipTriggerType = 'hover' | 'focus' | 'click' | 'contextmenu';

export const useTooltipTriggerProps = buildProps({
  ...popperTriggerProps,
  disabled: Boolean,
  trigger: {
    type: [String, Array] as PropType<Arrayable<TooltipTriggerType>>,
    default: 'hover',
  },
  triggerKeys: {
    type: Array as PropType<string[]>,
    default: () => [EVENT_CODE.enter, EVENT_CODE.space],
  },
} as const);

export type LpTooltipTriggerProps = ExtractPropTypes<
  typeof useTooltipTriggerProps
>;
