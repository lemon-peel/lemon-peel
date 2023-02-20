import { buildProps, isString } from '@lemon-peel/utils';

import type { ExtractPropTypes } from 'vue';
import type { RouteLocationRaw } from 'vue-router';
import type { MenuItemRegistered } from './types';

export const menuItemProps = buildProps({
  index: {
    type: [String, null] as PropType<string | null>,
    default: null,
  },
  route: {
    type: [String, Object] as PropType<RouteLocationRaw>,
  },
  disabled: Boolean,
} as const);
export type MenuItemProps = ExtractPropTypes<typeof menuItemProps>;

export const menuItemEmits = {
  click: (item: MenuItemRegistered) =>
    isString(item.index) && Array.isArray(item.indexPath),
};
export type MenuItemEmits = typeof menuItemEmits;
