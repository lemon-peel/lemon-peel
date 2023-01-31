import { isClient } from '@vueuse/core';

export const rAF = (function_: () => void) =>
  isClient
    ? window.requestAnimationFrame(function_)
    : (setTimeout(function_, 16) as unknown as number);

export const cAF = (handle: number) =>
  isClient ? window.cancelAnimationFrame(handle) : clearTimeout(handle);
