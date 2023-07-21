import { nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { POPPER_CONTAINER_SELECTOR, useZIndex } from '@lemon-peel/hooks';
import { rAF } from '@lemon-peel/test-utils/tick';
import { LpPopperTrigger } from '@lemon-peel/components/popper';
import Popover from '../src/Popover.vue';
import type { VueWrapper } from '@vue/test-utils';
import type { PopoverProps } from '../src/popover';

const AXIOM = 'Rem is the best girl';

const doMount = (props?: Partial<PopoverProps>) =>
  mount(
    {
      setup() {
        const slots = {
          default: () => AXIOM,
          reference: () => <button>click me</button>,
        };
        return () => <Popover {...props} v-slots={slots} />;
      },
    },
    { attachTo: document.body },
  );

describe('Popover.vue', () => {
  let wrapper: VueWrapper<any>;
  const findContentComp = () =>
    wrapper.findComponent({
      name: 'LpPopperContent',
    });

  afterEach(() => {
    wrapper?.unmount();
    document.body.innerHTML = '';
  });

  test('render test', () => {
    wrapper = doMount();

    expect(findContentComp().text()).toEqual(AXIOM);
  });

  test('should render with title', () => {
    const title = 'test title';
    wrapper = doMount({ title });

    expect(findContentComp().text()).toContain(title);
  });

  test(`should modify popover's style with width`, async () => {
    wrapper = doMount({ width: 200 });

    const popperContent = findContentComp();
    expect(getComputedStyle(popperContent.element).width).toBe('200px');

    await wrapper.setProps({ width: '100vw' });

    expect(getComputedStyle(popperContent.element).width).toBe('100vw');
  });

  test('the content should be overrode by slots', () => {
    const content = 'test content';
    wrapper = doMount({ content });

    expect(findContentComp().text()).toContain(AXIOM);
  });

  test('should render content when no slots were passed', () => {
    const content = 'test content';
    const virtualRef = document.createElement('button');
    wrapper = mount(() => (
      <Popover
        content={content}
        teleported={false}
        virtualRef={virtualRef}
        virtualTriggering
      />
    ));

    expect(findContentComp().text()).toBe(content);
  });

  test('popper z-index should be dynamical', () => {
    wrapper = doMount();

    const { currentZIndex } = useZIndex();
    expect(
      Number.parseInt(window.getComputedStyle(findContentComp().element).zIndex),
    ).toBeLessThanOrEqual(currentZIndex.value);
  });

  test('defind hide method', async () => {
    wrapper = doMount();
    const vm = wrapper.findComponent(Popover).vm;

    expect(vm.hide).toBeDefined();
  });

  test('should be able to emit after-enter and after-leave', async () => {
    const wrapper = doMount({ trigger: 'click' });

    await nextTick();
    const trigger$ = wrapper.findComponent(LpPopperTrigger);
    const triggerEl = trigger$.find('.lp-tooltip__trigger');
    vi.useFakeTimers();
    await triggerEl.trigger('click');
    vi.runAllTimers();
    vi.useRealTimers();
    await rAF();
    expect(wrapper.findComponent(Popover).emitted()).toHaveProperty(
      'after-enter',
    );

    vi.useFakeTimers();
    await triggerEl.trigger('click');
    vi.runAllTimers();
    vi.useRealTimers();
    await rAF();
    expect(wrapper.findComponent(Popover).emitted()).toHaveProperty(
      'after-leave',
    );
  });

  test('test visible controlled mode trigger invalid', async () => {
    const wrapper = doMount({ visible: false, trigger: 'click' });
    await nextTick();
    const trigger$ = wrapper.findComponent(LpPopperTrigger);
    const triggerEl = trigger$.find('.lp-tooltip__trigger');
    const popoverDom: HTMLElement = document.querySelector('.lp-popper')!;

    vi.useFakeTimers();
    await triggerEl.trigger('click');
    vi.runAllTimers();
    vi.useRealTimers();
    await rAF();
    expect(popoverDom.style.display).toBe('none');

    vi.useFakeTimers();
    await wrapper.setProps({ visible: true });
    vi.runAllTimers();
    vi.useRealTimers();
    await rAF();
    expect(popoverDom.style.display).not.toBe('none');

    vi.useFakeTimers();
    await wrapper.setProps({ visible: false });
    vi.runAllTimers();
    vi.useRealTimers();
    await rAF();
    expect(popoverDom.style.display).toBe('none');
  });

  test('test v-model:visible', async () => {
    const visible = ref(false);
    const onVisibleChange = (v: boolean) => {
      (visible.value = v);
    };

    const wrapper = mount(
      () => (<Popover visible={visible.value} onUpdate:visible={onVisibleChange} trigger="click" v-slots={{
        default: () => AXIOM,
        reference: () => <button>click me</button>,
      }} />),
      { attachTo: document.body },
    );

    await nextTick();
    const trigger$ = wrapper.findComponent(LpPopperTrigger);
    const triggerEl = trigger$.find('.lp-tooltip__trigger');
    const popoverDom: HTMLElement = document.querySelector('.lp-popper')!;

    vi.useFakeTimers();
    await triggerEl.trigger('click');
    vi.runAllTimers();
    vi.useRealTimers();
    await rAF();
    expect(popoverDom.style.display).not.toBe('none');

    vi.useFakeTimers();
    await triggerEl.trigger('click');
    vi.runAllTimers();
    vi.useRealTimers();
    await rAF();
    expect(popoverDom.style.display).toBe('none');
  });

  describe('teleported API', () => {
    test('should mount on popper container', async () => {
      expect(document.body.innerHTML).toBe('');
      doMount();

      await nextTick();
      expect(
        document.body.querySelector(POPPER_CONTAINER_SELECTOR)?.innerHTML,
      ).not.toBe('');
    });

    test('should not mount on the popper container', async () => {
      expect(document.body.innerHTML).toBe('');
      doMount({ teleported: false });

      await nextTick();
      expect(
        document.body.querySelector(POPPER_CONTAINER_SELECTOR)?.innerHTML,
      ).toBe('');
    });
  });
});
