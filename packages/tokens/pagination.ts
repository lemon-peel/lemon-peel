import type { ComputedRef, InjectionKey, WritableComputedRef } from 'vue';

export interface ElementPaginationContext {
  currentPage?: WritableComputedRef<number>;
  pageCount?: ComputedRef<number>;
  disabled?: ComputedRef<boolean>;
  changeEvent?: (value: number) => void;
  handleSizeChange?: (value: number) => void;
}

export const elPaginationKey: InjectionKey<ElementPaginationContext> =
  Symbol('elPaginationKey');
