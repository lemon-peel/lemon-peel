import { buildProps } from '@lemon-peel/utils';
import { tooltipV2RootProps } from './root';
import { tooltipV2TriggerProps } from './trigger';
import { tooltipV2ArrowProps } from './arrow';
import { tooltipV2ContentProps } from './content';

import type { ExtractPropTypes, PropType, TeleportProps, TransitionProps } from 'vue';

export const tooltipV2Props = buildProps({
  ...tooltipV2RootProps,
  ...tooltipV2ArrowProps,
  ...tooltipV2TriggerProps,
  ...tooltipV2ContentProps,
  alwaysOn: Boolean,
  fullTransition: Boolean,
  transitionProps: {
    type: Object as PropType<TransitionProps | null>,
    default: null,
  },
  teleported: Boolean,
  to: {
    type: String as PropType<TeleportProps['to']>,
    default: 'body',
  },
} as const);

export type TooltipV2Props = ExtractPropTypes<typeof tooltipV2Props>;
