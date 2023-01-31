import { withInstall, withNoopInstall } from '@lemon-peel/utils';

import Skeleton from './src/Skeleton.vue';
import SkeletonItem from './src/SkeletonItem.vue';

export const LpSkeleton = withInstall(Skeleton, {
  SkeletonItem,
});
export const LpSkeletonItem = withNoopInstall(SkeletonItem);
export default LpSkeleton;

export * from './src/skeleton';
export * from './src/skeletonItem';
