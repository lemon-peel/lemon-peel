import { isRef, unref } from 'vue';
import { isFunction } from '../types';

import type { ComponentPublicInstance, Ref, UnwrapRef } from 'vue';

export type RefSetter = (
  element: Element | ComponentPublicInstance | undefined
) => void;


export type Unrefs<T> = { [Key in keyof T]: UnwrapRef<T[Key]> };
export function unrefs<T extends object>(origin: T) : Unrefs<T> {
  const noRefs: { [Key in keyof T]?: any } = {};

  const entries  = Object.entries(origin);

  for (const pic of entries) {
    if (isRef(pic[1])) {
      noRefs[pic[0] as keyof T] = unref(pic[1]);
    }
  }

  return noRefs as any;
}

export function composeRefs(
  ...references: (Ref<HTMLElement | undefined> | RefSetter)[]
) {
  return (element: Element | ComponentPublicInstance | null) => {
    for (const reference of references) {
      if (isFunction(reference)) {
        reference(element as Element | ComponentPublicInstance);
      } else {
        reference.value = element as HTMLElement | undefined;
      }
    }
  };
}
