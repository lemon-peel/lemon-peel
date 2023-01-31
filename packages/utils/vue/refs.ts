import { isFunction } from '../types';

import type { ComponentPublicInstance, Ref } from 'vue';

export type RefSetter = (
  element: Element | ComponentPublicInstance | undefined
) => void;

export const composeRefs = (
  ...references: (Ref<HTMLElement | undefined> | RefSetter)[]
) => {
  return (element: Element | ComponentPublicInstance | null) => {
    for (const reference of references) {
      if (isFunction(reference)) {
        reference(element as Element | ComponentPublicInstance);
      } else {
        reference.value = element as HTMLElement | undefined;
      }
    }
  };
};
