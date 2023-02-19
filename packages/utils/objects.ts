import { get, set } from 'lodash-es';
import type { Entries } from 'type-fest';
import type { Arrayable } from './index';

export const keysOf = <T extends Record<string, any>>(object: T) => Object.keys(object) as Array<keyof T>;
export const entriesOf = <T extends Record<string, any>>(array: T) => Object.entries(array) as Entries<T>;
export { hasOwn } from '@vue/shared';

export const getProp = <T = any>(
  object: Record<string, any>,
  path: Arrayable<string>,
  defaultValue?: any,
): { value: T } => {
  return {
    get value() {
      return get(object, path, defaultValue);
    },
    set value(value: any) {
      set(object, path, value);
    },
  };
};

export function lazyProxy<T extends () => any>(getter: T) {
  let ins: ReturnType<T> | null = null;
  const proxy = new Proxy<ReturnType<T>>({} as any, {
    get(_, p: string | symbol) {
      if (!ins) ins = getter();
      return Reflect.get(ins!, p);
    },
  });
  return proxy;
}
