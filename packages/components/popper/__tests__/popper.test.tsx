// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { defineComponent, inject, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { POPPER_INJECTION_KEY } from '@lemon-peel/tokens';
import LpPopper from '../src/Popper.vue';

const AXIOM = 'rem is the best girl';

const TestChild = defineComponent({
  setup() {
    const { contentRef } = inject(POPPER_INJECTION_KEY)!;
    return () => <div ref={contentRef}>{AXIOM}</div>;
  },
});

describe('<LpPopper />', () => {
  it('should be able to provide instance to its children', async () => {
    const wrapper = mount(
      <LpPopper>
        <TestChild />
      </LpPopper>,
    );

    await nextTick();

    expect(wrapper.vm.contentRef).not.toBe(null);
    expect(wrapper.vm.contentRef!.innerHTML).toBe(AXIOM);
  });
});
