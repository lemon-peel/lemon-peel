import type { AppContext, Plugin } from 'vue';

export type SFCWithInstall<T> = T & Plugin;

export type TupleToUnion<T extends any[]> = T[number];

export type SFCInstallWithContext<T> = SFCWithInstall<T> & {
  _context: AppContext | null;
};
