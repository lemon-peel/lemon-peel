import { addUnit, isArray, isFunction } from '@lemon-peel/utils';

import type { CSSProperties } from 'vue';

const sumReducer = (sum: number, number_: number) => sum + number_;

export const sum = (listLike: number | number[]) => {
  return isArray(listLike) ? listLike.reduce(sumReducer, 0) : listLike;
};

export const tryCall = <T>(
  fLike: T,
  params: T extends (...arguments_: infer K) => unknown ? K : any,
  defaultReturnValue = {},
) => {
  return isFunction(fLike) ? fLike(params) : fLike ?? defaultReturnValue;
};

export const enforceUnit = (style: CSSProperties) => {
  for (const key of (['width', 'maxWidth', 'minWidth', 'height'] as const)) {
    style[key] = addUnit(style[key]);
  }

  return style;
};

