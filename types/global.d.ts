import { defineComponent } from '@vue/runtime-core';

declare global {
  const defineOpts: typeof defineComponent;
}
