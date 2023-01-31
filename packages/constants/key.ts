
export const INSTALLED_KEY = Symbol('INSTALLED_KEY');

declare module '@vue/runtime-core' {
  interface App {
    [INSTALLED_KEY]: boolean;
  }
}

