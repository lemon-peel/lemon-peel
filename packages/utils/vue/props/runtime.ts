import { warn } from 'vue';
import { fromPairs } from 'lodash-unified';

import { hasOwn } from '../../objects';
import { isObject } from '../../types';

import type { PropType } from 'vue';
import type { LpProp, LpPropConvert, LpPropFinalized, LpPropInput, LpPropMergeType, IfLpProp, IfNativePropType, NativePropType } from './types';

export const lpPropKey = '__lpPropKey';

export const definePropType = <T>(value: any): PropType<T> => value;

export const isLpProp = (value: unknown): value is LpProp<any, any, any> =>
  isObject(value) && !!(value as any)[lpPropKey];

/**
 * @description Build prop. It can better optimize prop types
 * @description 生成 prop，能更好地优化类型
 * @example
  // limited options
  // the type will be PropType<'light' | 'dark'>
  buildProp({
    type: String,
    values: ['light', 'dark'],
  } as const)
  * @example
  // limited options and other types
  // the type will be PropType<'small' | 'large' | number>
  buildProp({
    type: [String, Number],
    values: ['small', 'large'],
    validator: (val: unknown): val is number => typeof val === 'number',
  } as const)
  @link see more: https://github.com/element-plus/element-plus/pull/3341
 */
export const buildProp = <
  Type = never,
  Value = never,
  Validator = never,
  Default extends LpPropMergeType<Type, Value, Validator> = never,
  Required extends boolean = false,
>(
    property: LpPropInput<Type, Value, Validator, Default, Required>,
    key?: string,
  ): LpPropFinalized<Type, Value, Validator, Default, Required> => {
  // filter native prop type and nested prop, e.g `null`, `undefined` (from `buildProps`)
  if (!isObject(property) || isLpProp(property)) return property as any;

  const { values, required, default: defaultValue, type, validator } = property;

  const validate =
    values || validator
      ? (value: unknown) => {
        let valid = false;
        let allowedValues: unknown[] = [];

        if (values) {
          allowedValues = [...values];
          if (hasOwn(property, 'default')) {
            allowedValues.push(defaultValue);
          }
          valid ||= allowedValues.includes(value);
        }
        if (validator) valid ||= validator(value);

        if (!valid && allowedValues.length > 0) {
          const allowValuesText = [...new Set(allowedValues)]
            .map(value => JSON.stringify(value))
            .join(', ');
          warn(
            `Invalid prop: validation failed${
              key ? ` for prop "${key}"` : ''
            }. Expected one of [${allowValuesText}], got value ${JSON.stringify(
              value,
            )}.`,
          );
        }
        return valid;
      }
      : undefined;

  const epProperty: any = {
    type,
    required: !!required,
    validator: validate,
    [lpPropKey]: true,
  };
  if (hasOwn(property, 'default')) epProperty.default = defaultValue;
  return epProperty;
};

export const buildProps = <
  Properties extends Record<
  string,
  | { [lpPropKey]: true }
  | NativePropType
  | LpPropInput<any, any, any, any, any>
  >,
>(
    properties: Properties,
  ): {
    [K in keyof Properties]: IfLpProp<
    Properties[K],
    Properties[K],
    IfNativePropType<Properties[K], Properties[K], LpPropConvert<Properties[K]>>
    >
  } =>
    fromPairs(
      Object.entries(properties).map(([key, option]) => [
        key,
        buildProp(option as any, key),
      ]),
    ) as any;
