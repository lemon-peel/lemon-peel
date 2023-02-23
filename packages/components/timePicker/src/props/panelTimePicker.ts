import { buildProps } from '@lemon-peel/utils';
import { timePanelSharedProps } from './shared';

import type { ExtractPropTypes, PropType } from 'vue';
import type { Dayjs } from 'dayjs';

export const panelTimePickerProps = buildProps({
  ...timePanelSharedProps,
  datetimeRole: String,
  parsedValue: {
    type: Object as PropType<Dayjs>,
  },
} as const);

export type PanelTimePickerProps = ExtractPropTypes<typeof panelTimePickerProps>;
