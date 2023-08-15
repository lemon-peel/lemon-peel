import { describe, expect, test } from 'vitest';
import * as vue from 'vue';
import * as vueShared from '@vue/shared';

import { isArray, isBoolean, isDate, isElement, isEmpty, isFunction, isNumber, isObject, isPromise, isPropAbsent, isString, isSymbol, isUndefined, isVNode } from '../index';

describe('types', () => {
  test('re-export from @vue/shared', () => {
    expect(isArray).toBe(vueShared.isArray);
    expect(isDate).toBe(vueShared.isDate);
    expect(isFunction).toBe(vueShared.isFunction);
    expect(isObject).toBe(vueShared.isObject);
    expect(isPromise).toBe(vueShared.isPromise);
    expect(isString).toBe(vueShared.isString);
    expect(isSymbol).toBe(vueShared.isSymbol);
  });

  test('isNumber should work', () => {
    expect(isNumber(0)).toBe(true);
    expect(isNumber(1)).toBe(true);
    expect(isNumber(1.1)).toBe(true);
    expect(isNumber('1')).toBe(false);
    expect(isNumber('1.1')).toBe(false);
    expect(isNumber('0')).toBe(false);
    expect(isNumber('0.0')).toBe(false);
    expect(isNumber(null)).toBe(false);
    expect(isNumber('null')).toBe(false);
  });

  test('isBoolean should work', () => {
    expect(isBoolean(0)).toBe(false);
    expect(isBoolean(null)).toBe(false);
    expect(isBoolean('null')).toBe(false);
    expect(isBoolean(true)).toBe(true);
    expect(isBoolean(false)).toBe(true);
  });

  test('re-export from vue', () => {
    expect(isVNode).toBe(vue.isVNode);
  });

  test('isUndefined should work', () => {
    expect(isUndefined()).toBe(true);
    expect(isUndefined(null)).toBe(false);
    expect(isUndefined('null')).toBe(false);
  });

  test('isEmpty should work', () => {
    expect(isEmpty()).toBe(true);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty({})).toBe(true);
    expect(isEmpty('hello')).toBe(false);
    expect(isEmpty(0)).toBe(false);
    expect(isEmpty(false)).toBe(true);
  });

  test('isElement should work', () => {
    expect(isElement(document.createElement('div'))).toBe(true);
    expect(isElement(document.createElement('span'))).toBe(true);
    expect(isElement(document.createElement('h1'))).toBe(true);
    expect(isElement({})).toBe(false);
    expect(isElement('element')).toBe(false);
  });

  test('isElement should return false when Element is not exists', () => {
    const winEle = window.Element;

    window.Element = undefined as any;
    expect(isElement(document.createElement('div'))).toBe(false);

    window.Element = winEle;
    expect(isElement(document.createElement('div'))).toBe(true);
  });

  test('isPropAbsent should work', () => {
    expect(isPropAbsent(null)).toBe(true);
    expect(isPropAbsent()).toBe(true);
    expect(isPropAbsent(123)).toBe(false);
    expect(isPropAbsent({})).toBe(false);
  });
});
