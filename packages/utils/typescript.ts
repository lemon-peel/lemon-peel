export const mutable = <T extends readonly any[] | Record<string, unknown>>(
  value: T,
) => value as Mutable<typeof value>;
export type Mutable<T> = { -readonly [P in keyof T]: T[P] };

export type HTMLElementCustomized<T> = HTMLElement & T;

/**
 * @deprecated stop to use null
 * @see {@link https://github.com/sindresorhus/meta/discussions/7}
 */
export type Nullable<T> = T | null;

export type NotUndefined<T> = T extends undefined ? never : T;

export type Arrayable<T> = T | T[];
export type Awaitable<T> = Promise<T> | T;
export type CallAble = {
  (...args: any[]): any;
};

export type OmitByType<T, U extends T[keyof T]> = {
  [Key in keyof T as (T[Key] extends U ? never : Key)]: T[Key]
};

export type OnlyMethod<T = Record<string, any>> = {
  [Key in keyof T as (T[Key] extends CallAble ? Key : never)]: CallAble
};
