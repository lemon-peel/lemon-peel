import { isString } from './types';

class LemonPeelError extends Error {
  constructor(m: string) {
    super(m);
    this.name = 'LemonPeelError';
  }
}

export function throwError(scope: string, m: string): never {
  throw new LemonPeelError(`[${scope}] ${m}`);
}

export function debugWarn(error: Error): void;
export function debugWarn(scope: string, message: string): void;
export function debugWarn(scope: string | Error, message?: string): void {
  if (process.env.NODE_ENV !== 'production') {
    const error: Error = isString(scope)
      ? new LemonPeelError(`[${scope}] ${message}`)
      : scope;
    // eslint-disable-next-line no-console
    console.warn(error);
  }
}
