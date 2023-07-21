import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import CheckTag from '../src/CheckTag.vue';
import { ref } from 'vue';

const AXIOM = 'Rem is the best girl';

describe('CheckTag.vue', () => {
  test('render test', async () => {
    const wrapper = mount(() => <CheckTag>{AXIOM}</CheckTag>);
    expect(wrapper.text()).toEqual(AXIOM);

    expect(wrapper.classes()).toContain('lp-check-tag');
  });

  test('functionality', async () => {
    const checked = ref(false);
    const onChange = () => (checked.value = !checked.value);
    const wrapper = mount(
      () => (<CheckTag onChange={onChange} checked={checked.value}>{AXIOM}</CheckTag>),
      { attachTo: document.body },
    );

    expect(wrapper.text()).toEqual(AXIOM);

    await wrapper.find('.lp-check-tag').trigger('click');
    expect(checked.value).toBe(true);

    await wrapper.find('.lp-check-tag').trigger('click');
    expect(checked.value).toBe(false);
  });
});
