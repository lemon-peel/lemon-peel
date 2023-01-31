import { buildProps } from '@lemon-peel/utils';
import { datePickerSharedProps } from './shared';

import type { ExtractPropTypes } from 'vue';

const { date, disabledDate, parsedValue } = datePickerSharedProps;

export const basicYearTableProps = buildProps({
  date,
  disabledDate,
  parsedValue,
});

export type BasicYearTableProps = ExtractPropTypes<typeof basicYearTableProps>;
