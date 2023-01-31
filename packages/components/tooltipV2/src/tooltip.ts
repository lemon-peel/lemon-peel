import { buildProps, definePropType } from '@lemon-peel/utils';
import { tooltipV2RootProps } from './Root.vue';
import { tooltipV2TriggerProps } from './Trigger.vue';
import { tooltipV2ArrowProps } from './Arrow.vue';
import { tooltipV2ContentProps } from './Content.vue';

import type { ExtractPropTypes, TeleportProps, TransitionProps } from 'vue';

export const tooltipV2Props = buildProps({
  ...tooltipV2RootProps,
  ...tooltipV2ArrowProps,
  ...tooltipV2TriggerProps,
  ...tooltipV2ContentProps,
  alwaysOn: Boolean,
  fullTransition: Boolean,
  transitionProps: {
    type: definePropType<TransitionProps | null>(Object),
    default: null,
  },
  teleported: Boolean,
  to: {
    type: definePropType<TeleportProps['to']>(String),
    default: 'body',
  },
} as const);

export type TooltipV2Props = ExtractPropTypes<typeof tooltipV2Props>;
