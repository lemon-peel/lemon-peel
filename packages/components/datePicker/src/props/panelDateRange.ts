import { buildProps } from '@lemon-peel/utils';
import { panelRangeSharedProps, panelSharedProps } from './shared';

import type { ExtractPropTypes } from 'vue';

export const panelDateRangeProps = buildProps({
  ...panelSharedProps,
  ...panelRangeSharedProps,
} as const);

export type PanelDateRangeProps = ExtractPropTypes<typeof panelDateRangeProps>;
