import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, test } from 'vitest';
import { usePopperContainer } from '@lemon-peel/hooks';
import { TOOLTIP_INJECTION_KEY } from '@lemon-peel/tokens';
import { genTooltipProvides } from '../test-helper/provides';
import LpTooltipContent from '../src/Content.vue';

import type { VueWrapper } from '@vue/test-utils';

const AXIOM = 'rem is the best girl';

describe('LpTooltipContent', () => {
  const {
    controlled,
    id,
    open,
    trigger,
    onOpen,
    onClose,
    onToggle,
    onShow,
    onHide,
    onBeforeShow,
    onBeforeHide,
  } = genTooltipProvides();

  const defaultProvide = {
    [TOOLTIP_INJECTION_KEY as symbol]: {
      controlled,
      id,
      open,
      trigger,
      onOpen,
      onClose,
      onToggle,
      onShow,
      onHide,
      onBeforeShow,
      onBeforeHide,
    },
  };

  let unmount: () => void;
  const createComponent = (props = {}, provides = {}) => {
    const wrapper = mount(
      {
        setup() {
          usePopperContainer();

          return () => <LpTooltipContent {...props}>{AXIOM}</LpTooltipContent>;
        },
      },
      {
        global: {
          provide: {
            ...defaultProvide,
            ...provides,
          },
          stubs: ['LpPopperContent'],
        },
        attachTo: document.body,
      },
    );

    unmount = () => wrapper.unmount();
    return wrapper.findComponent(LpTooltipContent);
  };

  let wrapper: VueWrapper<any>;
  const OLD_ENV = process.env.NODE_ENV;
  beforeAll(() => {
    process.env.NODE_ENV = 'test';
  });

  afterAll(() => {
    process.env.NODE_ENV = OLD_ENV;
  });

  afterEach(() => {
    open.value = false;
    controlled.value = false;
    trigger.value = 'hover';
    unmount?.();
    document.body.innerHTML = '';
  });

  describe('rendering', () => {
    test('should render nothing initially when not controlled', async () => {
      wrapper = createComponent();
      await nextTick();

      expect(wrapper.text()).toBe('');
    });

    describe('persistent content', () => {
      test('should be able to inherit style', async () => {
        const customStyle = {
          position: 'absolute',
        };

        wrapper = createComponent({
          style: customStyle,
        });
        await nextTick();

        expect(wrapper.vm.contentStyle).toEqual(customStyle);
      });
    });

    describe('content rendering', () => {
      test('should not show the content when disabled', async () => {
        wrapper = createComponent({
          disabled: true,
        });

        await nextTick();

        expect(wrapper.vm.shouldShow).toBe(false);
      });
    });

    describe('events', () => {
      beforeEach(async () => {
        wrapper = createComponent();
        await nextTick();
        open.value = true;
        await nextTick();
        await nextTick();
      });

      test('should be able to enter trigger', async () => {
        const { vm } = wrapper;
        expect(onOpen).not.toHaveBeenCalled();
        const enterEvent = new MouseEvent('mouseenter');
        vm.onContentEnter(enterEvent);
        expect(onOpen).toHaveBeenCalled();
        const leaveEvent = new MouseEvent('mouseleave');
        expect(onClose).not.toHaveBeenCalled();
        vm.onContentLeave(leaveEvent);
        expect(onClose).toHaveBeenCalled();
      });

      test('should not trigger close event when the trigger is not hover', async () => {
        const { vm } = wrapper;

        trigger.value = 'click';
        await nextTick();
        const leaveEvent = new MouseEvent('mouseleave');
        expect(onClose).not.toHaveBeenCalled();
        vm.onContentLeave(leaveEvent);
        expect(onClose).not.toHaveBeenCalled();
      });

      test('should be able to stop triggering when controlled', async () => {
        controlled.value = true;
        await nextTick();
        const { vm } = wrapper;

        expect(onOpen).not.toHaveBeenCalled();
        const enterEvent = new MouseEvent('mouseenter');
        vm.onContentEnter(enterEvent);
        expect(onOpen).not.toHaveBeenCalled();
        const leaveEvent = new MouseEvent('mouseleave');
        expect(onClose).not.toHaveBeenCalled();
        vm.onContentLeave(leaveEvent);
        expect(onClose).not.toHaveBeenCalled();
      });

      describe('onCloseOutside', () => {
        beforeEach(() => {
          // Have to mock this ref because we are not going to render the content in this component
          wrapper.vm.contentRef = {
            popperContentRef: document.createElement('div'),
          };
        });

        test('should not close the content after click outside when trigger is hover', async () => {
          document.body.click();
          await nextTick();
          expect(onClose).not.toHaveBeenCalled();
        });

        test('should not close the content after click outside when controlled', async () => {
          controlled.value = true;
          trigger.value = 'click';
          await nextTick();

          document.body.click();
          await nextTick();
          expect(onClose).not.toHaveBeenCalled();
        });

        test('should close component after click outside', async () => {
          trigger.value = 'click';
          wrapper.vm.onAfterShow();
          await nextTick();

          document.body.click();

          await nextTick();

          expect(onClose).toHaveBeenCalled();
        });
      });
    });

    test('should append to', async () => {
      const el = document.createElement('div');
      const id = 'test_id';
      el.id = id;
      document.body.append(el);

      wrapper = createComponent({
        appendTo: `#${id}`,
      });

      await nextTick();

      expect(el.children).toHaveLength(1);
      expect(el.querySelector('[aria-hidden="true"]')).not.toBeNull();
    });
  });
});
