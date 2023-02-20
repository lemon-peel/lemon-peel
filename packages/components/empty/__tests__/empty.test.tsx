import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import Empty from '../src/Empty.vue';

const AXIOM = 'Rem is the best girl';

describe('Empty.vue', () => {
  test('render test', () => {
    const wrapper = mount(() => <Empty>{AXIOM}</Empty>);
    expect(wrapper.find('.lp-empty__image').exists()).toBe(true);
    expect(wrapper.find('.lp-empty__description').exists()).toBe(true);
    expect(wrapper.find('.lp-empty__bottom').exists()).toBe(true);
  });

  test('should render image props', () => {
    const wrapper = mount(() => <Empty image={AXIOM} />);
    expect(wrapper.find('.lp-empty__image img').exists()).toBe(true);
  });

  test('should render imageSize props', async () => {
    const wrapper = mount(() => <Empty imageSize={500} />);
    expect(wrapper.find('.lp-empty__image').attributes('style')).toContain(
      'width: 500px',
    );
  });

  test('should render description props', () => {
    const wrapper = mount(() => <Empty description={AXIOM} />);
    expect(wrapper.find('.lp-empty__description').text()).toEqual(AXIOM);
  });

  test('should render image slots', () => {
    const wrapper = mount(() => (
      <Empty
        v-slots={{
          image: () => AXIOM,
        }}
      />
    ));
    expect(wrapper.find('.lp-empty__image').text()).toEqual(AXIOM);
  });

  test('should render description slots', () => {
    const wrapper = mount(() => (
      <Empty
        v-slots={{
          description: () => AXIOM,
        }}
      />
    ));
    expect(wrapper.find('.lp-empty__description').text()).toEqual(AXIOM);
  });

  test('should render default slots', async () => {
    const wrapper = mount(() => (
      <Empty
        v-slots={{
          default: () => AXIOM,
        }}
      />
    ));
    expect(wrapper.find('.lp-empty__bottom').text()).toEqual(AXIOM);
  });
});
