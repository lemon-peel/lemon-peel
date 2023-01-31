import { isNil } from 'lodash-unified';
import { buildProps, definePropType, isArray, mutable } from '@lemon-peel/utils';
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '@lemon-peel/constants';

import type { ExtractPropTypes, h as H, VNode } from 'vue';
import type Transfer from './Transfer.vue';

export type TransferKey = string | number;
export type TransferDirection = 'left' | 'right';

export type TransferDataItem = Record<string, any>;

export type RenderContent = (
  h: typeof H,
  option: TransferDataItem
) => VNode | VNode[];

export interface TransferFormat {
  noChecked?: string;
  hasChecked?: string;
}

export interface TransferPropsAlias {
  label?: string;
  key?: string;
  disabled?: string;
}

export interface TransferCheckedState {
  leftChecked: TransferKey[];
  rightChecked: TransferKey[];
}

export const LEFT_CHECK_CHANGE_EVENT = 'left-check-change';
export const RIGHT_CHECK_CHANGE_EVENT = 'right-check-change';

export const transferProps = buildProps({
  data: {
    type: definePropType<TransferDataItem[]>(Array),
    default: () => [],
  },
  titles: {
    type: definePropType<[string, string]>(Array),
    default: () => [],
  },
  buttonTexts: {
    type: definePropType<[string, string]>(Array),
    default: () => [],
  },
  filterPlaceholder: String,
  filterMethod: {
    type: definePropType<(query: string, item: TransferDataItem) => boolean>(
      Function,
    ),
  },
  leftDefaultChecked: {
    type: definePropType<TransferKey[]>(Array),
    default: () => [],
  },
  rightDefaultChecked: {
    type: definePropType<TransferKey[]>(Array),
    default: () => [],
  },
  renderContent: {
    type: definePropType<RenderContent>(Function),
  },
  modelValue: {
    type: definePropType<TransferKey[]>(Array),
    default: () => [],
  },
  format: {
    type: definePropType<TransferFormat>(Object),
    default: () => ({}),
  },
  filterable: Boolean,
  props: {
    type: definePropType<TransferPropsAlias>(Object),
    default: () =>
      mutable({
        label: 'label',
        key: 'key',
        disabled: 'disabled',
      } as const),
  },
  targetOrder: {
    type: String,
    values: ['original', 'push', 'unshift'],
    default: 'original',
  },
  validateEvent: {
    type: Boolean,
    default: true,
  },
} as const);
export type TransferProps = ExtractPropTypes<typeof transferProps>;

export const transferCheckedChangeFn = (
  value: TransferKey[],
  movedKeys?: TransferKey[],
) => [value, movedKeys].every(isArray) || (isArray(value) && isNil(movedKeys));

export const transferEmits = {
  [CHANGE_EVENT]: (
    value: TransferKey[],
    direction: TransferDirection,
    movedKeys: TransferKey[],
  ) =>
    [value, movedKeys].every(isArray) && ['left', 'right'].includes(direction),
  [UPDATE_MODEL_EVENT]: (value: TransferKey[]) => isArray(value),
  [LEFT_CHECK_CHANGE_EVENT]: transferCheckedChangeFn,
  [RIGHT_CHECK_CHANGE_EVENT]: transferCheckedChangeFn,
};
export type TransferEmits = typeof transferEmits;

export type TransferInstance = InstanceType<typeof Transfer>;
