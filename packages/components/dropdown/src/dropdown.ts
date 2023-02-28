import { buildProps, iconPropType } from '@lemon-peel/utils';
import { EVENT_CODE } from '@lemon-peel/constants';
import { createCollectionWithScope } from '@lemon-peel/components/collection';
import { useTooltipContentProps, useTooltipTriggerProps } from '@lemon-peel/components/tooltip';

import type { Options } from '@popperjs/core';
import type { ButtonProps, ButtonType } from '@lemon-peel/components/button';
import type { Placement } from '@lemon-peel/components/popper';
import { roleTypes } from '@lemon-peel/components/popper';
import type { ComponentInternalInstance, ComputedRef, PropType } from 'vue';
import type { Nullable } from '@lemon-peel/utils';

export interface LpDropdownInstance {
  instance?: ComponentInternalInstance;
  dropdownSize?: ComputedRef<string>;
  handleClick?: () => void;
  commandHandler?: (...arg: any[]) => void;
  show?: () => void;
  hide?: () => void;
  trigger?: ComputedRef<string>;
  hideOnClick?: ComputedRef<boolean>;
  triggerElm?: ComputedRef<Nullable<HTMLButtonElement>>;
}

export const dropdownProps = buildProps({
  trigger: useTooltipTriggerProps.trigger,
  effect: {
    ...useTooltipContentProps.effect,
    default: 'light',
  },
  type: { type: String as PropType<ButtonType> },
  placement: { type: String as PropType<Placement>, default: 'bottom' },
  popperOptions: { type: Object as PropType<Partial<Options>>, default: () => ({}) },
  id: String,
  size: { type: String, default: '' },
  splitButton: Boolean,
  hideOnClick: { type: Boolean, default: true },
  loop: { type: Boolean, default: true },
  showTimeout: { type: Number, default: 150 },
  hideTimeout: { type: Number, default: 150 },
  tabindex: { type: [Number, String] as PropType<number | string>, default: 0 },
  maxHeight: { type: [Number, String] as PropType<number | string>, default: '' },
  popperClass: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  role: { type: String, values: roleTypes, default: 'menu' },
  buttonProps: { type: Object as PropType<ButtonProps> },
  teleported: useTooltipContentProps.teleported,
});

export const dropdownItemProps = buildProps({
  command: {
    type: [Object, String, Number],
    default: () => ({}),
  },
  disabled: Boolean,
  divided: Boolean,
  textValue: String,
  icon: {
    type: iconPropType,
  },
} as const);

export const dropdownMenuProps = buildProps({
  onKeydown: { type: Function as PropType<(e: KeyboardEvent) => void> },
});

export const FIRST_KEYS = [
  EVENT_CODE.down,
  EVENT_CODE.pageDown,
  EVENT_CODE.home,
];

export const LAST_KEYS = [EVENT_CODE.up, EVENT_CODE.pageUp, EVENT_CODE.end];

export const FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS];

const {
  LpCollection,
  LpCollectionItem,
  COLLECTION_INJECTION_KEY,
  COLLECTION_ITEM_INJECTION_KEY,
} = createCollectionWithScope('Dropdown');

export {
  LpCollection,
  LpCollectionItem,
  COLLECTION_INJECTION_KEY as DROPDOWN_COLLECTION_INJECTION_KEY,
  COLLECTION_ITEM_INJECTION_KEY as DROPDOWN_COLLECTION_ITEM_INJECTION_KEY,
};
