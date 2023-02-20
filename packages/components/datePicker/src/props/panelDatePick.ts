import { buildProps } from '@lemon-peel/utils';
import { panelSharedProps } from './shared';

import type { ExtractPropTypes, PropType } from 'vue';
import type { Dayjs } from 'dayjs';

export const panelDatePickProps = buildProps({
  ...panelSharedProps,
  parsedValue: { type: [Object, Array] as PropType<Dayjs | Dayjs[]> },
  visible: { type: Boolean },
  format: { type: String, default: '' },
});

export type PanelDatePickProps = ExtractPropTypes<typeof panelDatePickProps>;
