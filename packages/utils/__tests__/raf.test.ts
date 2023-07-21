import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cAF, rAF } from '../index';

// eslint-disable-next-line no-var
var isClientMocked = false;

vi.mock('@vueuse/core', () => ({
  get isClient() {
    return isClientMocked;
  },
}));


describe('raf', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  test('CSR should work', () => {
    isClientMocked = true;

    const fn = vi.fn();
    rAF(() => fn('first'));
    vi.runAllTimers();
    expect(fn.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "first",
        ],
      ]
    `);

    rAF(() => fn('second'));
    vi.runAllTimers();
    expect(fn.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "first",
        ],
        [
          "second",
        ],
      ]
    `);

    const handle = rAF(() => fn('cancel'));
    cAF(handle);
    vi.runAllTimers();
    expect(fn.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "first",
        ],
        [
          "second",
        ],
      ]
    `);
  });

  test('SSR should work', () => {
    isClientMocked = false;

    const fn = vi.fn();
    rAF(() => fn('first'));
    vi.runAllTimers();
    expect(fn.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "first",
        ],
      ]
    `);

    rAF(() => fn('second'));
    vi.runAllTimers();
    expect(fn.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "first",
        ],
        [
          "second",
        ],
      ]
    `);

    const handle = rAF(() => fn('cancel'));
    cAF(handle);
    vi.runAllTimers();
    expect(fn.mock.calls).toMatchInlineSnapshot(`
      [
        [
          "first",
        ],
        [
          "second",
        ],
      ]
    `);
  });
});
