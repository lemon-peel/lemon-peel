import { componentSizes, datePickTypes } from '@lemon-peel/constants';
import type { ComponentSize, DatePickType } from '@lemon-peel/constants';

export const isValidComponentSize = (value: string): value is ComponentSize | '' =>
  ['', ...componentSizes].includes(value);

export const isValidDatePickType = (value: string): value is DatePickType =>
  ([...datePickTypes] as string[]).includes(value);
