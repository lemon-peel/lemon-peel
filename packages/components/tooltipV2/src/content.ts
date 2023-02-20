import { buildProps } from '@lemon-peel/utils';

import type { ExtractPropTypes, PropType } from 'vue';
import type { Placement, Strategy, VirtualElement } from '@floating-ui/dom';

const tooltipV2Strategies = ['absolute', 'fixed'] as const;

const tooltipV2Placements = [
  'top-start',
  'top-end',
  'top',
  'bottom-start',
  'bottom-end',
  'bottom',
  'left-start',
  'left-end',
  'left',
  'right-start',
  'right-end',
  'right',
] as const;

export const tooltipV2ContentProps = buildProps({
  ariaLabel: String,
  arrowPadding: { type: Number as PropType<number>, default: 5 },
  effect: { type: String, default: '' },
  contentClass: String,
  /**
   * Placement of tooltip content relative to reference element (when absent it refers to trigger)
   */
  placement: { type: String as PropType<Placement>, values: tooltipV2Placements, default: 'bottom' },
  /**
   * Reference element for tooltip content to set its position
   */
  reference: { type: Object as PropType<HTMLElement | VirtualElement | null>, default: null },
  offset: { type: Number, default: 8 },
  strategy: { type: String as PropType<Strategy>, values: tooltipV2Strategies, default: 'absolute' },
  showArrow: { type: Boolean, default: false },
} as const);

export type TooltipV2ContentProps = ExtractPropTypes<typeof tooltipV2ContentProps>;
