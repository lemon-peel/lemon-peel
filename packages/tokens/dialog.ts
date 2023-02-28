import type { CSSProperties, ComputedRef, InjectionKey, Ref } from 'vue';
import type { useNamespace } from '@lemon-peel/hooks';

export type DialogContext = {
  dialogRef: Ref<HTMLElement>;
  headerRef: Ref<HTMLElement>;
  bodyId: Ref<string>;
  ns: ReturnType<typeof useNamespace>;
  rendered: Ref<boolean>;
  style: ComputedRef<CSSProperties>;
};

export const dialogInjectionKey: InjectionKey<DialogContext> =
  Symbol('dialogInjectionKey');
