import { markRaw, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, test } from 'vitest';
import { Edit } from '@element-plus/icons-vue';
import Steps from '../src/Steps.vue';
import Step from '../src/Item.vue';
import type { VNode } from 'vue';

const doMount = (render: () => VNode) =>
  mount({
    setup() {
      return render;
    },
    attachTo: document.body,
    global: {
      provide: {
        LpSteps: {},
      },
    },
  });

describe('Steps.vue', () => {
  test('render', () => {
    const wrapper = doMount(() => (
      <Steps>
        <Step />
        <Step />
        <Step />
      </Steps>
    ));
    expect(wrapper.findAll('.lp-step').length).toBe(3);
    expect(wrapper.classes()).toContain('lp-steps--horizontal');
    expect(wrapper.find('.lp-step').classes()).toContain('is-horizontal');
  });

  test('space', () => {
    const wrapper = doMount(() => (
      <Steps space={100}>
        <Step />
      </Steps>
    ));
    expect(wrapper.find('.lp-step').attributes('style')).toMatch(
      'flex-basis: 100px;',
    );
  });

  test('alignCenter', () => {
    const wrapper = doMount(() => (
      <Steps alignCenter>
        <Step />
      </Steps>
    ));
    expect(wrapper.find('.lp-step').classes()).toContain('is-center');
  });

  test('direction', () => {
    const wrapper = doMount(() => (
      <Steps direction="vertical">
        <Step />
      </Steps>
    ));
    expect(wrapper.classes()).toContain('lp-steps--vertical');
    expect(wrapper.find('.lp-step').classes()).toContain('is-vertical');
  });

  test('simple', () => {
    const wrapper = doMount(() => (
      <Steps simple direction="vertical" space={100} alignCenter>
        <Step />
      </Steps>
    ));
    expect(wrapper.classes()).toContain('lp-steps--simple');
    expect(wrapper.find('is-center').exists()).toBe(false);
    expect(wrapper.find('is-vertical').exists()).toBe(false);
  });

  test('active', async () => {
    const wrapper = doMount(() => (
      <Steps active={0}>
        <Step />
        <Step />
        <Step />
      </Steps>
    ));
    await nextTick();
    expect(
      wrapper.findAll('.lp-step')[0].find('.lp-step__head').classes(),
    ).toContain('is-process');
    expect(
      wrapper.findAll('.lp-step')[1].find('.lp-step__head').classes(),
    ).toContain('is-wait');
    expect(
      wrapper.findAll('.lp-step')[2].find('.lp-step__head').classes(),
    ).toContain('is-wait');
    await wrapper.setProps({ active: 1 });
    expect(
      wrapper.findAll('.lp-step')[0].find('.lp-step__head').classes(),
    ).toContain('is-finish');
    expect(
      wrapper.findAll('.lp-step')[1].find('.lp-step__head').classes(),
    ).toContain('is-process');
    expect(
      wrapper.findAll('.lp-step')[2].find('.lp-step__head').classes(),
    ).toContain('is-wait');
    await wrapper.setProps({ active: 2 });
    expect(
      wrapper.findAll('.lp-step')[0].find('.lp-step__head').classes(),
    ).toContain('is-finish');
    expect(
      wrapper.findAll('.lp-step')[1].find('.lp-step__head').classes(),
    ).toContain('is-finish');
    expect(
      wrapper.findAll('.lp-step')[2].find('.lp-step__head').classes(),
    ).toContain('is-process');
    await wrapper.setProps({ active: 3 });
    expect(
      wrapper.findAll('.lp-step')[2].find('.lp-step__head').classes(),
    ).toContain('is-finish');
  });

  test('process-status', async () => {
    const wrapper = doMount(() => (
      <Steps active={2} process-status="success">
        <Step />
        <Step />
        <Step />
      </Steps>
    ));
    await nextTick();
    expect(
      wrapper.findAll('.lp-step')[2].find('.lp-step__head').classes(),
    ).toContain('is-success');
    await wrapper.setProps({ processStatus: 'error' });
    expect(
      wrapper.findAll('.lp-step')[2].find('.lp-step__head').classes(),
    ).toContain('is-error');
  });

  test('finish-status', async () => {
    const wrapper = doMount(() => (
      <Steps active={2} finish-status="error">
        <Step />
        <Step />
        <Step />
      </Steps>
    ));
    await nextTick();
    expect(
      wrapper.findAll('.lp-step')[0].find('.lp-step__head').classes(),
    ).toContain('is-error');
    await wrapper.setProps({ finishStatus: 'success' });
    expect(
      wrapper.findAll('.lp-step')[0].find('.lp-step__head').classes(),
    ).toContain('is-success');
  });

  test('step attribute', () => {
    const wrapper = mount({
      setup() {
        const iconEdit = markRaw(Edit);
        return () => (
          <Steps active={0}>
            <Step
              icon={iconEdit}
              title="title"
              description="description"
              status="wait"
            />
          </Steps>
        );
      },
    });
    expect(wrapper.find('.lp-step__head').classes()).toContain('is-wait');
    expect(wrapper.find('.lp-step__title').text()).toBe('title');
    expect(wrapper.find('.lp-step__description').text()).toBe('description');
    expect(wrapper.findComponent(Edit).exists()).toBe(true);
  });

  test('step slot', () => {
    const wrapper = doMount(() => (
      <Steps active={0}>
        <Step
          v-slots={{
            title: () => 'A',
            description: () => 'B',
          }}
        />
      </Steps>
    ));
    expect(wrapper.find('.lp-step__title').text()).toBe('A');
    expect(wrapper.find('.lp-step__description').text()).toBe('B');
  });
});
