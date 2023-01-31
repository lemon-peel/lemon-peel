import { withInstall, withNoopInstall } from '@lemon-peel/utils';
import Tabs from './src/Tabs';
import TabPane from './src/TabPane.vue';

export const LpTabs = withInstall(Tabs, {
  TabPane,
});
export const LpTabPane = withNoopInstall(TabPane);
export default LpTabs;

export * from './src/Tabs';
export * from './src/tabBar';
export * from './src/TabNav';
export * from './src/tabPane';
