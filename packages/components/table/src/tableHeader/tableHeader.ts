
import { buildProps } from '@lemon-peel/utils';

import type { ExtractPropTypes, PropType } from 'vue';
import type { Sort } from '../table/defaults';


export const tableHeaderProps = buildProps({
  fixed: { type: String, default: '' },
  border: Boolean,
  defaultSort: {
    type: Object as PropType<Sort>,
    default: () => ({ prop: '', order: '' }),
  },
});

export type TableHeaderProps = Readonly<ExtractPropTypes<typeof tableHeaderProps>>;

export const tableHeaderEmits = ['set-drag-visible'];