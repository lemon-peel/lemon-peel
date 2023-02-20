import { buildProps } from '@lemon-peel/utils';
import { tooltipV2Sides } from './common';

import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import type { TooltipV2Sides } from './common';

export const tooltipV2ArrowProps = buildProps({
  width: { type: Number, default: 10 },
  height: { type: Number, default: 10 },
  style: { type: Object as PropType<CSSProperties | null>, default: null },
} as const);

export const tooltipV2ArrowSpecialProps = buildProps({
  side: {
    type: String as PropType<TooltipV2Sides>,
    values: tooltipV2Sides,
    required: true,
  },
} as const);

export type TooltipV2ArrowProps = ExtractPropTypes<typeof tooltipV2ArrowProps>;
