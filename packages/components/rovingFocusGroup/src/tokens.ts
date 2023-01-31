import type { InjectionKey, Ref, StyleValue } from 'vue';
import type { LpRovingFocusGroupProps } from './rovingFocusGroup';

type EventHandler<T = Event> = (e: T) => void;

export type RovingGroupInjectionContext = {
  currentTabbedId: Ref<string | null>;
  dir: Ref<LpRovingFocusGroupProps['dir']>;
  loop: Ref<LpRovingFocusGroupProps['loop']>;
  orientation: Ref<LpRovingFocusGroupProps['orientation']>;
  tabIndex: Ref<number>;
  rovingFocusGroupRef: Ref<HTMLElement | null>;
  rovingFocusGroupRootStyle: Ref<StyleValue>;
  onBlur: EventHandler;
  onFocus: EventHandler<FocusEvent>;
  onMousedown: EventHandler;
  onItemFocus: (id: string) => void;
  onItemShiftTab: () => void;
};

export type RovingFocusGroupItemInjectionContext = {
  rovingFocusGroupItemRef: Ref<HTMLElement | null>;
  tabIndex: Ref<number>;
  handleMousedown: EventHandler;
  handleFocus: EventHandler;
  handleKeydown: EventHandler;
};

export const ROVING_FOCUS_GROUP_INJECTION_KEY: InjectionKey<RovingGroupInjectionContext> =
  Symbol('elRovingFocusGroup');

export const ROVING_FOCUS_GROUP_ITEM_INJECTION_KEY: InjectionKey<RovingFocusGroupItemInjectionContext> =
  Symbol('elRovingFocusGroupItem');