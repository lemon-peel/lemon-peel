import { buildProps } from '@lemon-peel/utils';

import type { ExtractPropTypes, PropType } from 'vue';
import type { Sort, SummaryMethod } from '../table/defaults';

export const tableFooterProps = buildProps({
  fixed: { type: String, default: '' },
  summaryMethod: { type: Function as PropType<SummaryMethod>, default: undefined },
  sumText: { type: String, default: '' },
  border: { type: Boolean, default: false },
  defaultSort: {
    type: Object as PropType<Sort>,
    default: () => ({ prop: '', order: '' }),
  },
});

export type TableFooterProps = Readonly<ExtractPropTypes<typeof tableFooterProps>>;