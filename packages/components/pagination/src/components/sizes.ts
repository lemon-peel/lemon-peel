import { buildProps, mutable } from '@lemon-peel/utils';
import { componentSizes } from '@lemon-peel/constants';
import type { ExtractPropTypes, PropType } from 'vue';
import type Sizes from './Sizes.vue';

export const paginationSizesProps = buildProps({
  pageSize: { type: Number, required: true },
  pageSizes: {
    type: Array as PropType<number[]>,
    default: () => mutable([10, 20, 30, 40, 50, 100] as const),
  },
  popperClass: { type: String },
  disabled: Boolean,
  size: { type: String, values: componentSizes },
} as const);

export type PaginationSizesProps = ExtractPropTypes<typeof paginationSizesProps>;

export type SizesInstance = InstanceType<typeof Sizes>;
