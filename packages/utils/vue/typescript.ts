import type { AppContext, Plugin, ObjectEmitsOptions } from 'vue';
import type { UnionToIntersection } from '@vue/shared';

export type SFCWithInstall<T> = T & Plugin;

export type TupleToUnion<T extends any[]> = T[number];

export type SFCInstallWithContext<T> = SFCWithInstall<T> & {
  _context: AppContext | null;
};

// @todo remove when vue-core project export EmitFn
// eslint-disable-next-line @typescript-eslint/ban-types
export declare type EmitFn<Options = ObjectEmitsOptions, Event extends keyof Options = keyof Options> = Options extends Array<infer V> ? (event: V, ...arguments_: any[]) => void : {} extends Options ? (event: string, ...arguments_: any[]) => void : UnionToIntersection<{
  [key in Event]: Options[key] extends (...arguments_: infer Arguments) => any ? (event: key, ...arguments_: Arguments) => void : (event: key, ...arguments_: any[]) => void;
}[Event]>;
