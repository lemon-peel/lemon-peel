import { normalizeStyle } from 'vue';
import type { CSSProperties, StyleValue } from 'vue';

export type Writable<T> = { -readonly [P in keyof T]: T[P] };
export type WritableArray<T> = T extends readonly any[] ? Writable<T> : T;

export type IfNever<T, Y = true, N = false> = [T] extends [never] ? Y : N;

export type IfUnknown<T, Y, N> = [unknown] extends [T] ? Y : N;

export type UnknownToNever<T> = IfUnknown<T, never, T>;


const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:([^]+)/;
const styleCommentRE = /\/\*.*?\*\//gs;

export function parseStringStyle(cssText: string): CSSProperties {
  const ret: Record<string, any> = {};
  cssText
    .replace(styleCommentRE, '')
    .split(listDelimiterRE)
    .forEach(item => {
      if (item) {
        const tmp = item.split(propertyDelimiterRE);
        tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
      }
    });
  return ret;
}

export function parseStyle(value: StyleValue): CSSProperties {
  const ns = normalizeStyle(value);
  return ns
    ? typeof ns === 'string'
      ? parseStringStyle(ns)
      : ns
    : ({});
}
