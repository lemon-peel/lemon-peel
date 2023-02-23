
export const INSTALLED_KEY = Symbol('INSTALLED_KEY');

declare module 'vue' {
  interface App {
    [INSTALLED_KEY]: boolean;
  }
}

