import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import Divider from '../src/Divider.vue';

const AXIOM = 'Rem is the best girl';

describe('Divider.vue', () => {
  test('render test', () => {
    const wrapper = mount(() => (
      <Divider
        v-slots={{
          default: () => AXIOM,
        }}
      />
    ));
    expect(wrapper.text()).toBe(AXIOM);
  });

  test('direction', () => {
    const wrapper = mount(() => <Divider direction="vertical" />);
    expect(wrapper.classes()).toContain('lp-divider--vertical');
  });

  test('contentPosition', () => {
    const wrapper = mount(() => (
      <Divider
        v-slots={{
          default: () => AXIOM,
        }}
        contentPosition="right"
      />
    ));
    expect(wrapper.find('.lp-divider__text').classes()).toContain('is-right');
  });

  test('customClass', () => {
    const wrapper = mount(() => <Divider class="customClass" />);
    expect(wrapper.classes()).toContain('customClass');
  });

  test('line-dashed', () => {
    const wrapper = mount(() => <Divider borderStyle="dashed" />);
    expect(
      getComputedStyle(wrapper.element, null).getPropertyValue(
        '--lp-border-style',
      ),
    ).toBe('dashed');
  });

  test('line-solid', () => {
    const wrapper = mount(() => <Divider direction="vertical" />);
    expect(
      getComputedStyle(wrapper.element, null).getPropertyValue(
        '--lp-border-style',
      ),
    ).toBe('solid');
  });
});
