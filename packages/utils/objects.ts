import { get, set } from 'lodash-unified';
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

