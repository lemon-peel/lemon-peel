import { buildProps } from '@lemon-peel/utils';

import type { ExtractPropTypes, PropType } from 'vue';

type AutoResizeHandler = (event: { height: number, width: number }) => void;

export const autoResizerProps = buildProps({
  disableWidth: Boolean,
  disableHeight: Boolean,
  onResize: {
    type: Function as PropType<AutoResizeHandler>,
  },
} as const);

export type AutoResizerProps = ExtractPropTypes<typeof autoResizerProps>;
