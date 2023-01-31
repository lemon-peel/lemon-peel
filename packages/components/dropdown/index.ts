import { withInstall, withNoopInstall } from '@lemon-peel/utils';

import Dropdown from './src/Dropdown.vue';
import DropdownItem from './src/DropdownItem.vue';
import DropdownMenu from './src/DropdownMenu.vue';

export const LpDropdown = withInstall(Dropdown, {
  DropdownItem,
  DropdownMenu,
});
export default LpDropdown;
export const LpDropdownItem = withNoopInstall(DropdownItem);
export const LpDropdownMenu = withNoopInstall(DropdownMenu);

export * from './src/dropdown';
export * from './src/tokens';
