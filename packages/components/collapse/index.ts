import { withInstall, withNoopInstall } from '@lemon-peel/utils';

import Collapse from './src/Collapse.vue';
import CollapseItem from './src/CollapseItem.vue';

export const LpCollapse = withInstall(Collapse, {
  CollapseItem,
});
export default LpCollapse;
export const LpCollapseItem = withNoopInstall(CollapseItem);

export type { CollapseInstance, CollapseItemInstance } from './src/instance';

export * from './src/collapse';
export * from './src/collapseItem';

