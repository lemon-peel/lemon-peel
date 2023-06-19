import { provide } from 'vue';

import type { InjectionKey, ObjectDirective, Ref } from 'vue';

type ForwardReferenceSetter = <T>(element: T) => void;

export type ForwardRefInjectionContext = {
  setForwardRef: ForwardReferenceSetter;
};

export const FORWARD_REF_INJECTION_KEY: InjectionKey<ForwardRefInjectionContext> =
  Symbol('lpForwardRef');

export const useForwardRef = <T>(forwardReference: Ref<T | null>) => {
  const setForwardReference = (element: T) => {
    forwardReference.value = element;
  };

  provide(FORWARD_REF_INJECTION_KEY, {
    setForwardRef: setForwardReference,
  });
};

export const useForwardRefDirective = (
  setForwardReference: ForwardReferenceSetter,
): ObjectDirective => {
  return {
    mounted(element) {
      setForwardReference(element);
    },
    updated(element) {
      setForwardReference(element);
    },
    unmounted() {
      setForwardReference(null);
    },
  };
};
