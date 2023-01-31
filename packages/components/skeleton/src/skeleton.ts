import { buildProps } from '@lemon-peel/utils';
import type Skeleton from './Skeleton.vue';
import type { ExtractPropTypes } from 'vue';

export const skeletonProps = buildProps({
  animated: {
    type: Boolean,
    default: false,
  },
  count: {
    type: Number,
    default: 1,
  },
  rows: {
    type: Number,
    default: 3,
  },
  loading: {
    type: Boolean,
    default: true,
  },
  throttle: {
    type: Number,
  },
} as const);
export type SkeletonProps = ExtractPropTypes<typeof skeletonProps>;

export type SkeletonInstance = InstanceType<typeof Skeleton>;
