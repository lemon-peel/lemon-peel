import { buildProps, definePropType } from '@lemon-peel/utils';
import { timePanelSharedProps } from './shared';

import type { ExtractPropTypes } from 'vue';
import type { Dayjs } from 'dayjs';

export const panelTimeRangeProps = buildProps({
  ...timePanelSharedProps,
  parsedValue: {
    type: definePropType<[Dayjs, Dayjs]>(Array),
  },
} as const);

export type PanelTimeRangeProps = ExtractPropTypes<typeof panelTimeRangeProps>;
