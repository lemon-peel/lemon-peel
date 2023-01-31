import { withInstall, withNoopInstall } from '@lemon-peel/utils';

import Menu from './src/menu';
import MenuItem from './src/MenuItem.vue';
import MenuItemGroup from './src/MenuItemGroup.vue';
import SubMenu from './src/SubMenu';

export const LpMenu = withInstall(Menu, {
  MenuItem,
  MenuItemGroup,
  SubMenu,
});
export default LpMenu;
export const LpMenuItem = withNoopInstall(MenuItem);
export const LpMenuItemGroup = withNoopInstall(MenuItemGroup);
export const LpSubMenu = withNoopInstall(SubMenu);

export * from './src/menu';
export * from './src/menuItem';
export * from './src/menuItemGroup';
export * from './src/SubMenu';
export * from './src/types';
