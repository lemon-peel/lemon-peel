import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import Space from '../src/space';

const AXIOM = 'Rem is the best girl';

describe('Space.vue', () => {
  it('render test', async () => {
    const wrapper = mount(Space, { slots: { default: () => AXIOM } });

    expect(wrapper.text()).toEqual(AXIOM);

    await wrapper.setProps({
      direction: 'vertical',
      wrap: true,
    });

    expect(wrapper.find('.lp-space--vertical').exists()).toBe(true);
    expect(wrapper.find('.lp-space').attributes('style')).toContain(
      'flex-wrap: wrap',
    );
  });

  it('sizes', async () => {
    const warnHandler = vi.fn();
    const wrapper = mount(
      Space,
      {
        data: () => ({ size: 'large' }),
        slots: {
          default: () => Array.from({ length: 2 }).map((_, idx) => {
            return `test${idx}`;
          }),
        },
        global: {
          config: {
            warnHandler,
          },
        },
      },
    );

    await nextTick();
    expect(wrapper.find('.lp-space__item').attributes('style')).toContain(
      'margin-right: 16px',
    );

    await wrapper.setProps({
      size: 30,
    });

    await nextTick();
    expect(wrapper.find('.lp-space__item').attributes('style')).toContain(
      'margin-right: 30px',
    );

    await wrapper.setProps({
      size: [10, 20],
    });

    expect(wrapper.find('.lp-space__item').attributes('style')).toContain(
      'margin-right: 10px',
    );
    expect(wrapper.find('.lp-space__item').attributes('style')).toContain(
      'padding-bottom: 20px',
    );
    await wrapper.setProps({
      size: 'unknown',
    });

    expect(warnHandler).toHaveBeenCalled();

    expect(wrapper.find('.lp-space__item').attributes('style')).toContain(
      'margin-right: 8px',
    );
  });

  it('should render with spacer', async () => {
    const stringSpacer = '|';
    const wrapper = mount(
      Space,
      {
        data: () => ({ size: 'large', spacer: stringSpacer }),
        slots: {
          default: () => Array.from({ length: 2 }).map((_, idx) => {
            return `test${idx}`;
          }),
        },
      },
    );

    await nextTick();
    expect(wrapper.element.children).toHaveLength(3);

    expect(wrapper.text()).toContain(stringSpacer);

    // 2 elements expecting only 1 spacer
    expect(wrapper.text().split(stringSpacer)).toHaveLength(2);
    const testSpacerCls = 'test-spacer-cls';

    // vnode type spacer
    await wrapper.setProps({
      spacer: <div class={testSpacerCls} />,
    });

    expect(wrapper.findAll(`.${testSpacerCls}`)).toHaveLength(1);
    expect(wrapper.element.children).toHaveLength(3);
  });

  it('fill', async () => {
    const wrapper = mount(
      Space,
      {
        data: () => ({ fill: true }),
        slots: {
          default: () => (Array.from({ length: 2 }).map((_, idx) => {
            return `test${idx}`;
          })),
        },
      },
    );

    await nextTick();
    expect(wrapper.find('.lp-space').attributes('style')).toContain(
      'flex-wrap: wrap',
    );
    expect(wrapper.find('.lp-space__item').attributes('style')).toContain(
      'flex-grow: 1',
    );
    expect(wrapper.find('.lp-space__item').attributes('style')).toContain(
      'min-width: 100%',
    );

    // custom fill ratio
    await wrapper.setProps({
      fillRatio: 50,
    });

    await nextTick();
    expect(wrapper.find('.lp-space__item').attributes('style')).toContain(
      'min-width: 50%',
    );
  });
});
