import { nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { POPPER_INJECTION_KEY } from '@lemon-peel/tokens';
import LpContent from '../src/Content.vue';

import type { VueWrapper } from '@vue/test-utils';
import type { PopperContentInstance, PopperContentProps } from '../src/content';

const AXIOM = 'rem is the best girl';
const popperInjection = {
  triggerRef: ref(),
  popperInstanceRef: ref(),
  contentRef: ref(),
};

const mountContent = (props: Partial<PopperContentProps> = {}) => {
  return mount(LpContent as any, {
    props,
    slots: { default: () => AXIOM },
    global: { provide: { [POPPER_INJECTION_KEY as symbol]: popperInjection } },
  }) as VueWrapper<PopperContentInstance>;
};

describe('LpPopperContent', () => {
  describe('with triggerRef provided', () => {
    const triggerKls = 'lp-popper__trigger';
    let wrapper: VueWrapper<PopperContentInstance>;

    beforeEach(() => {
      const trigger = document.createElement('div');
      trigger.className = triggerKls;

      popperInjection.triggerRef.value = trigger;
    });

    afterEach(() => {
      popperInjection.triggerRef.value = null;
      wrapper?.unmount();
    });

    test('should mount the component correctly and set popperInstance correctly', async () => {
      wrapper = mountContent();
      await nextTick();

      expect(popperInjection.triggerRef).toBeDefined();
      expect(wrapper.html()).toContain(AXIOM);
      expect(popperInjection.popperInstanceRef.value).toBeDefined();
      expect(wrapper.classes()).toEqual(['lp-popper', 'is-dark']);
      expect(wrapper.vm.contentStyle[0]).toHaveProperty('zIndex');
      expect(wrapper.vm.contentStyle[1]).toBeUndefined();
    });

    test('should be able to be pure and themed', async () => {
      wrapper = mountContent();
      await nextTick();

      await wrapper.setProps({
        pure: true,
        effect: 'custom',
      });

      expect(wrapper.classes()).toEqual(['lp-popper', 'is-pure', 'is-custom']);
    });

    test('should be able to set customized styles', async () => {
      wrapper = mountContent();
      await nextTick();

      const style = {
        position: 'absolute',
      };
      await wrapper.setProps({
        popperStyle: style,
      });

      expect(wrapper.vm.contentStyle[1]).toEqual(style);
    });

    test('should be able to emit events', async () => {
      wrapper = mountContent();
      await nextTick();

      expect(wrapper.emitted()).not.toHaveProperty('mouseenter');
      expect(wrapper.emitted()).not.toHaveProperty('mouseleave');

      await wrapper.trigger('mouseenter');
      expect(wrapper.emitted()).toHaveProperty('mouseenter');

      await wrapper.trigger('mouseleave');
      expect(wrapper.emitted()).toHaveProperty('mouseleave');
    });

    describe('instantiate popper instance', () => {
      test('should be able to update the current instance', async () => {
        wrapper = mountContent();
        await nextTick();

        vi.spyOn(
          popperInjection.triggerRef.value,
          'getBoundingClientRect',
        ).mockImplementation(() => ({
          bottom: 1,
          height: 0,
          left: 0,
          right: 0,
          top: 0,
          width: 0,
        }));

        wrapper.vm.$forceUpdate();
      });

      test('should be able to update the reference node', async () => {
        wrapper = mountContent();
        await nextTick();

        const oldInstance = wrapper.vm.popperInstanceRef;

        const newRef = document.createElement('div');
        newRef.classList.add('new-ref');

        popperInjection.triggerRef.value = newRef;
        await nextTick();

        expect(wrapper.vm.popperInstanceRef).not.toStrictEqual(oldInstance);

        popperInjection.triggerRef.value = undefined;

        await nextTick();

        expect(wrapper.vm.popperInstanceRef).toBeUndefined();
      });
    });
  });
});
