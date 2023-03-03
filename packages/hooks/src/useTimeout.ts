import { tryOnScopeDispose } from '@vueuse/core';

export function useTimeout() {
  let timeoutHandle: number;

  const cancelTimeout = () => window.clearTimeout(timeoutHandle);

  const registerTimeout = (function_: (...arguments_: any[]) => any, delay: number) => {
    cancelTimeout();
    timeoutHandle = window.setTimeout(function_, delay);
  };

  tryOnScopeDispose(() => cancelTimeout());

  return {
    registerTimeout,
    cancelTimeout,
  };
}
