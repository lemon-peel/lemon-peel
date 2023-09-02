import { withInstall, withNoopInstall } from '@lemon-peel/utils';

import Collapse from './src/Collapse.vue';
import CollapseItem from './src/CollapseItem.vue';

export const LpCollapse = withInstall(Collapse, {
  CollapseItem,
});
export default LpCollapse;
export const LpCollapseItem = withNoopInstall(CollapseItem);

export * from './src/collapse';
export * from './src/collapseItem';

export type CollapseInst = InstanceType<typeof Collapse>;
export type CollapseItemInst = InstanceType<typeof CollapseItem>;
