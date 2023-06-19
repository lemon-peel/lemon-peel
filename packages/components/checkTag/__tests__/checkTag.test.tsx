import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import CheckTag from '../src/CheckTag.vue';

const AXIOM = 'Rem is the best girl';

describe('CheckTag.vue', () => {
  test('render test', async () => {
    const wrapper = mount(() => <CheckTag>{AXIOM}</CheckTag>);
    expect(wrapper.text()).toEqual(AXIOM);

    expect(wrapper.classes()).toContain('lp-check-tag');
  });

  test('functionality', async () => {
    const wrapper = mount({
      data: () => ({ checked: false }),
      render() {
        return (
          <CheckTag
            onChange={() => (this.checked = !this.checked)}
            checked={this.checked}
          >
            {AXIOM}
          </CheckTag>
        );
      },
    });
    expect(wrapper.text()).toEqual(AXIOM);

    await wrapper.find('.lp-check-tag').trigger('click');

    expect(wrapper.vm.checked).toBe(true);

    await wrapper.find('.lp-check-tag').trigger('click');

    expect(wrapper.vm.checked).toBe(false);
  });
});
