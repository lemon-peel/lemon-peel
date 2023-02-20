import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import { TypeComponentsMap } from '@lemon-peel/utils';
import Alert from '../src/Alert.vue';

const AXIOM = 'Rem is the best girl';

describe('Alert.vue', () => {
  test('render test & class', () => {
    const wrapper = mount(() => <Alert title={AXIOM} showIcon={true} />);
    expect(wrapper.find('.lp-alert__title').text()).toEqual(AXIOM);
    expect(wrapper.find('.lp-alert').classes()).toContain('lp-alert--info');
  });

  test('type', () => {
    const wrapper = mount(() => (
      <Alert title={'test'} showIcon={true} type={'success'} />
    ));
    expect(wrapper.find('.lp-alert').classes()).toContain('lp-alert--success');
    expect(wrapper.find('.lp-alert__icon').classes()).toContain('lp-icon');
    expect(wrapper.findComponent(TypeComponentsMap.success).exists()).toBe(true);
  });

  test('description', () => {
    const wrapper = mount(() => (
      <Alert title={'Dorne'} showIcon={true} description={AXIOM} />
    ));
    expect(wrapper.find('.lp-alert__description').text()).toEqual(AXIOM);
  });

  test('theme', () => {
    const wrapper = mount(() => <Alert title={'test'} effect={'dark'} />);
    expect(wrapper.find('.lp-alert').classes()).toContain('is-dark');
  });

  test('title slot', () => {
    const wrapper = mount(() => <Alert title={AXIOM} />);
    expect(wrapper.find('.lp-alert__title').text()).toEqual(AXIOM);
  });

  test('close', async () => {
    const wrapper = mount(() => <Alert closeText={'close'} />);
    const closeBtn = wrapper.find('.lp-alert__close-btn');
    expect(closeBtn.exists()).toBe(true);

    await closeBtn.trigger('click');
    expect(wrapper.emitted()).toBeDefined();
  });
});
