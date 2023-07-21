import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useTimeout } from '../src/useTimeout';

const doMount = (cb: () => void) => {
  return mount({
    setup() {
      const { cancelTimeout, registerTimeout } = useTimeout();
      registerTimeout(cb, 0);

      return { cancelTimeout };
    },
    render: () => {},
  });
};

describe('use-timeout', () => {
  let wrapper: ReturnType<typeof doMount>;
  const cb = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    wrapper = doMount(cb);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should register timeout correctly', async () => {
    expect(cb).not.toHaveBeenCalled();
    vi.runOnlyPendingTimers();
    expect(cb).toHaveBeenCalled();
    wrapper.unmount();
  });

  it('should cancel the timeout correctly', async () => {
    (wrapper.vm as unknown as { cancelTimeout: ReturnType<typeof useTimeout>['cancelTimeout'] }).cancelTimeout();

    vi.runOnlyPendingTimers();

    expect(cb).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  it('should cancel timeout before unmount', () => {
    expect(cb).not.toHaveBeenCalled();

    wrapper.unmount();
    vi.runOnlyPendingTimers();

    expect(cb).not.toHaveBeenCalled();
  });
});
