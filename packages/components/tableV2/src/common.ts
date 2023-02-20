import { mutable } from '@lemon-peel/utils';

import type { CSSProperties } from 'vue';
import type { Column, KeyType } from './types';

export type AnyColumn = Column<any>;

/**
 * @Note even though we can use `string[] | string` as the type but for
 * convenience here we only use `string` as the acceptable value here.
 */
export const classType = String;

export const columns = {
  type: Array as PropType<AnyColumn[]>,
  required: true,
} as const;

export const column = {
  type: Object as PropType<AnyColumn>,
} as const;

export const fixedDataType = {
  type: Array as PropType<any[]>,
} as const;

export const dataType = {
  ...fixedDataType,
  required: true,
} as const;

export const expandColumnKey = String;

export const expandKeys = {
  type: Array as PropType<KeyType[]>,
  default: () => mutable([]),
} as const;

export const requiredNumber = {
  type: Number,
  required: true,
} as const;

export const rowKey = {
  type: [String, Number, Symbol] as PropType<KeyType>,
  default: 'id',
} as const;

/**
 * @note even though we can use `StyleValue` but that would be difficult for us to mapping them,
 * so we only use `CSSProperties` as the acceptable value here.
 */
export const styleType = {
  type: Object as PropType<CSSProperties>,
};
