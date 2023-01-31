export const unique = <T>(array: T[]) => [...new Set(array)];

type Many<T> = T | ReadonlyArray<T>;
// TODO: rename to `ensureArray`
/** like `_.castArray`, except falsy value returns empty array. */
export const castArray = <T>(array: Many<T>): T[] => {
  if (!array && (array as any) !== 0) return [];
  return Array.isArray(array) ? array : [array];
};

// TODO: remove import alias
// avoid naming conflicts
export { castArray as ensureArray } from 'lodash-unified';
