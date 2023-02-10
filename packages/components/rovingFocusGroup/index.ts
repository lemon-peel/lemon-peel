// This component is ported from https://github.com/radix-ui/primitives/tree/main/packages/react/roving-focus
// with some modification for Vue

export * from './src/tokens';
export * from './src/utils';

export {
  ROVING_FOCUS_COLLECTION_INJECTION_KEY,
  ROVING_FOCUS_ITEM_COLLECTION_INJECTION_KEY,
} from './src/rovingFocusGroup';

export { default as LpRovingFocusItem } from './src/RovingFocusItem.vue';
export { default as LpRovingFocusGroup, default } from './src/RovingFocusGroup.vue';
