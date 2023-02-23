import { isArray, isObject, isString } from '@vue/shared';

import { isNil } from 'lodash-es';

export { isArray, isFunction, isObject, isString, isDate, isPromise, isSymbol } from '@vue/shared';
export { isBoolean, isNumber } from '@vueuse/core';
export { isVNode } from 'vue';

export const isUndefined = (value: any): value is undefined => value === undefined;

export const isEmpty = (value: unknown) =>
  (!value && value !== 0) ||
  (isArray(value) && value.length === 0) ||
  (isObject(value) && Object.keys(value).length === 0);

export const isElement = (e: unknown): e is Element => {
  if (typeof Element === 'undefined') return false;
  return e instanceof Element;
};

export const isPropAbsent = (property: unknown): property is null | undefined => {
  return isNil(property);
};

export const isStringNumber = (value: string): boolean => {
  if (!isString(value)) {
    return false;
  }
  return !Number.isNaN(Number(value));
};
