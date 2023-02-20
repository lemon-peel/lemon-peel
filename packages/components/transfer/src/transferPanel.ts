import { buildProps } from '@lemon-peel/utils';
import { transferCheckedChangeFn, transferProps } from './transfer';

import type { ExtractPropTypes, PropType, VNode } from 'vue';
import type { TransferDataItem, TransferKey } from './transfer';
import type TransferPanel from './TransferPanel.vue';

export interface TransferPanelState {
  checked: TransferKey[];
  allChecked: boolean;
  query: string;
  inputHover: boolean;
  checkChangeByUser: boolean;
}

export const CHECKED_CHANGE_EVENT = 'checked-change';

export const transferPanelProps = buildProps({
  data: transferProps.data,
  optionRender: { type: Function as PropType<(option: TransferDataItem) => VNode | VNode[]> },
  placeholder: String,
  title: String,
  filterable: Boolean,
  format: transferProps.format,
  filterMethod: transferProps.filterMethod,
  defaultChecked: transferProps.leftDefaultChecked,
  props: transferProps.props,
} as const);
export type TransferPanelProps = ExtractPropTypes<typeof transferPanelProps>;

export const transferPanelEmits = {
  [CHECKED_CHANGE_EVENT]: transferCheckedChangeFn,
};
export type TransferPanelEmits = typeof transferPanelEmits;

export type TransferPanelInstance = InstanceType<typeof TransferPanel>;
