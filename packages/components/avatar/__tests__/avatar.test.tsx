import { markRaw, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import { User } from '@element-plus/icons-vue';
import { IMAGE_FAIL, IMAGE_SUCCESS, mockImageEvent } from '@lemon-peel/test-utils/mock';

import Avatar from '../src/Avatar.vue';

describe('Avatar.vue', () => {
  mockImageEvent();

  test('render test', () => {
    const wrapper = mount(() => <Avatar />);
    expect(wrapper.find('.lp-avatar').exists()).toBe(true);
  });

  test('size is number', () => {
    const wrapper = mount(() => <Avatar size={50} />);
    expect(wrapper.attributes('style')).toContain('--lp-avatar-size: 50px;');
  });

  test('size is string', () => {
    const wrapper = mount(() => <Avatar size="small" />);
    expect(wrapper.classes()).toContain('lp-avatar--small');
  });

  test('shape', () => {
    const wrapper = mount(() => <Avatar size="small" shape="square" />);
    expect(wrapper.classes()).toContain('lp-avatar--square');
  });

  test('icon avatar', () => {
    const wrapper = mount(() => <Avatar icon={markRaw(User)} />);
    expect(wrapper.classes()).toContain('lp-avatar--icon');
    expect(wrapper.findComponent(User).exists()).toBe(true);
  });

  test('image avatar', () => {
    const wrapper = mount(() => <Avatar src={IMAGE_SUCCESS} />);
    expect(wrapper.find('img').exists()).toBe(true);
  });

  test('image fallback', async () => {
    const wrapper = mount(() => <Avatar src={IMAGE_FAIL} alt={''}>fallback</Avatar>);
    await nextTick();
    const wrap = wrapper.findComponent(Avatar);
    expect(wrap.emitted('error')).toBeDefined();
    await nextTick();
    expect(wrap.text()).toBe('fallback');
    expect(wrap.find('img').exists()).toBe(false);
  });

  test('image fit', () => {
    const fits = ['fill', 'contain', 'cover', 'none', 'scale-down'] as const;
    for (const fit of fits) {
      const wrapper = mount(() => <Avatar src={IMAGE_SUCCESS} fit={fit}></Avatar>);
      expect(wrapper.find('img').attributes('style')).toContain(`object-fit: ${fit};`);
    }
  });

  test('src changed', async () => {
    const src = ref('');
    const wrapper = mount(
      () => <Avatar src={src.value}>fallback</Avatar>,
      { attachTo: 'body' },
    );

    const wrap = wrapper.findComponent(Avatar);
    expect(wrap.vm.hasLoadError).toBe(false);
    src.value = IMAGE_FAIL;
    // wait error event trigger
    await nextTick();
    await nextTick();
    expect(wrap.vm.hasLoadError).toBe(true);
    src.value = IMAGE_SUCCESS;
    await nextTick();
    expect(wrap.vm.hasLoadError).toBe(false);
    expect(wrap.find('img').exists()).toBe(true);
  });
});
