import type { ExtractPropTypes, PropType } from 'vue';
import type { IfNever, UnknownToNever, WritableArray } from './util';
import type { lpPropKey } from './runtime';

type Value<T> = T[keyof T];

/**
 * Extract the type of a single prop
 *
 * 提取单个 prop 的参数类型
 *
 * @example
 * ExtractPropType<{ type: StringConstructor }> => string | undefined
 * ExtractPropType<{ type: StringConstructor, required: true }> => string
 * ExtractPropType<{ type: BooleanConstructor }> => boolean
 */
export type ExtractPropType<T extends object> = Value<
ExtractPropTypes<{
  key: T;
}>
>;

/**
 * Extracts types via `ExtractPropTypes`, accepting `PropType<T>`, `XXXConstructor`, `never`...
 *
 * 通过 `ExtractPropTypes` 提取类型，接受 `PropType<T>`、`XXXConstructor`、`never`...
 *
 * @example
 * ResolvePropType<BooleanConstructor> => boolean
 * ResolvePropType<PropType<T>> => T
 **/
export type ResolvePropType<T> = IfNever<
T,
never,
ExtractPropType<{
  type: WritableArray<T>;
  required: true;
}>
>;

/**
 * Merge Type, Value, Validator types
 * 合并 Type、Value、Validator 的类型
 *
 * @example
 * EpPropMergeType<StringConstructor, '1', 1> =>  1 | "1" // ignores StringConstructor
 * EpPropMergeType<StringConstructor, never, number> =>  string | number
 */
export type LpPropMergeType<Type, Val, Validator> =
  | IfNever<UnknownToNever<Val>, ResolvePropType<Type>, never>
  | UnknownToNever<Val>
  | UnknownToNever<Validator>;

/**
 * Handling default values for input (constraints)
 *
 * 处理输入参数的默认值（约束）
 */
export type EpPropInputDefault<
  Required extends boolean,
  Default,
> = Required extends true
  ? never
  : Default extends Record<string, unknown> | Array<any>
    ? () => Default
    : (() => Default) | Default;

/**
 * Native prop types, e.g: `BooleanConstructor`, `StringConstructor`, `null`, `undefined`, etc.
 *
 * 原生 prop `类型，BooleanConstructor`、`StringConstructor`、`null`、`undefined` 等
 */
export type NativePropType =
  | ((...arguments_: any) => any)
  | { new (...arguments_: any): any }
  | undefined
  | null;
export type IfNativePropType<T, Y, N> = [T] extends [NativePropType] ? Y : N;

/**
 * input prop `buildProp` or `buildProps` (constraints)
 *
 * prop 输入参数（约束）
 *
 * @example
 * EpPropInput<StringConstructor, 'a', never, never, true>
 * ⬇️
 * {
    type?: StringConstructor | undefined;
    required?: true | undefined;
    values?: readonly "a"[] | undefined;
    validator?: ((val: any) => boolean) | ((val: any) => val is never) | undefined;
    default?: undefined;
  }
 */
export type LpPropInput<
  Type,
  Val,
  Validator,
  Default extends LpPropMergeType<Type, Val, Validator>,
  Required extends boolean,
> = {
  type?: Type;
  required?: Required;
  values?: readonly Val[];
  validator?: ((value: any) => value is Validator) | ((value: any) => boolean);
  default?: EpPropInputDefault<Required, Default>;
};

/**
 * output prop `buildProp` or `buildProps`.
 *
 * prop 输出参数。
 *
 * @example
 * EpProp<'a', 'b', true>
 * ⬇️
 * {
    readonly type: PropType<"a">;
    readonly required: true;
    readonly validator: ((val: unknown) => boolean) | undefined;
    readonly default: "b";
    __epPropKey: true;
  }
 */
export type LpProp<Type, Default, Required> = {
  readonly type: PropType<Type>;
  readonly required: [Required] extends [true] ? true : false;
  readonly validator: ((value: unknown) => boolean) | undefined;
  [lpPropKey]: true;
} & IfNever<Default, unknown, { readonly default: Default }>;

/**
 * Determine if it is `EpProp`
 */
export type IfLpProp<T, Y, N> = T extends { [lpPropKey]: true } ? Y : N;

/**
 * Converting input to output.
 *
 * 将输入转换为输出
 */
export type LpPropConvert<Input> = Input extends LpPropInput<
infer Type,
infer PValue,
infer Validator,
any,
infer Required
>
  ? LpPropFinalized<Type, PValue, Validator, Input['default'], Required>
  : never;

/**
 * Finalized conversion output
 *
 * 最终转换 EpProp
 */
export type LpPropFinalized<Type, PValue, Validator, Default, Required> = LpProp<
LpPropMergeType<Type, PValue, Validator>,
UnknownToNever<Default>,
Required
>;

export {};
