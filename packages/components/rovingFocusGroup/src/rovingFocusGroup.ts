import { buildProps } from '@lemon-peel/utils';
import { createCollectionWithScope } from '@lemon-peel/components/collection';
import type { ExtractPropTypes, HTMLAttributes, PropType, StyleValue } from 'vue';

export const rovingFocusGroupProps = buildProps({
  style: { type: [String, Array, Object] as PropType<StyleValue> },
  currentTabId: { type: String as PropType<string | null> },
  defaultCurrentTabId: String,
  loop: Boolean,
  // left for direction support
  dir: { type: String, values: ['ltr', 'rtl'], default: 'ltr' },
  // left for orientation support
  orientation: { type: String as PropType<HTMLAttributes['aria-orientation']> },
  onBlur: Function,
  onFocus: Function,
  onMousedown: Function,
});

export type LpRovingFocusGroupProps = ExtractPropTypes<
  typeof rovingFocusGroupProps
>;

const {
  LpCollection,
  LpCollectionItem,
  COLLECTION_INJECTION_KEY,
  COLLECTION_ITEM_INJECTION_KEY,
} = createCollectionWithScope('RovingFocusGroup');

export {
  LpCollection,
  LpCollectionItem,
  COLLECTION_INJECTION_KEY as ROVING_FOCUS_COLLECTION_INJECTION_KEY,
  COLLECTION_ITEM_INJECTION_KEY as ROVING_FOCUS_ITEM_COLLECTION_INJECTION_KEY,
};
