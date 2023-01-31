import { isClient } from '@vueuse/core';
import { isNumber, isObject, isString, isStringNumber } from '../types';
import { camelize } from '../strings';
import { entriesOf, keysOf } from '../objects';
import { debugWarn } from '../error';
import type { CSSProperties } from 'vue';

const SCOPE = 'utils/dom/style';

export const classNameToArray = (cls = '') =>
  cls.split(' ').filter(item => !!item.trim());

export const hasClass = (element: Element, cls: string): boolean => {
  if (!element || !cls) return false;
  if (cls.includes(' ')) throw new Error('className should not contain space.');
  return element.classList.contains(cls);
};

export const addClass = (element: Element, cls: string) => {
  if (!element || !cls.trim()) return;
  element.classList.add(...classNameToArray(cls));
};

export const removeClass = (element: Element, cls: string) => {
  if (!element || !cls.trim()) return;
  element.classList.remove(...classNameToArray(cls));
};

export const getStyle = (
  element: HTMLElement,
  styleName: keyof CSSProperties,
): string => {
  if (!isClient || !element || !styleName) return '';

  let key = camelize(styleName);
  if (key === 'float') key = 'cssFloat';
  try {
    const style = (element.style as any)[key];
    if (style) return style;
    const computed: any = document.defaultView?.getComputedStyle(element, '');
    return computed ? computed[key] : '';
  } catch {
    return (element.style as any)[key];
  }
};

export const setStyle = (
  element: HTMLElement,
  styleName: CSSProperties | keyof CSSProperties,
  value?: string | number,
) => {
  if (!element || !styleName) return;

  if (isObject(styleName)) {
    for (const [property, value_] of entriesOf(styleName)) setStyle(element, property, value_)
    ;
  } else {
    const key: any = camelize(styleName);
    element.style[key] = value as any;
  }
};

export const removeStyle = (
  element: HTMLElement,
  style: CSSProperties | keyof CSSProperties,
) => {
  if (!element || !style) return;

  if (isObject(style)) {
    for (const property of keysOf(style)) removeStyle(element, property);
  } else {
    setStyle(element, style, '');
  }
};

export function addUnit(value?: string | number, defaultUnit = 'px') {
  if (!value) return '';
  if (isNumber(value) || isStringNumber(value)) {
    return `${value}${defaultUnit}`;
  } else if (isString(value)) {
    return value;
  }
  debugWarn(SCOPE, 'binding value must be a string or number');
}
