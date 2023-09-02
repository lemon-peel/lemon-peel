import { nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import Collapse from '../src/Collapse.vue';
import CollapseItem from '../src/CollapseItem.vue';

describe('Collapse.vue', () => {
  test('create', async () => {
    const activeNames = ref(['1']);
    const wrapper = mount(
      () => (<Collapse v-model:value={activeNames.value}>
        <CollapseItem title="title1" name="1">
          <div class="content">111</div>
        </CollapseItem>
        <CollapseItem title="title2" name="2">
          <div class="content">222</div>
        </CollapseItem>
        <CollapseItem title="title3" name="3">
          <div class="content">333</div>
        </CollapseItem>
        <CollapseItem title="title4" name="4">
          <div class="content">444</div>
        </CollapseItem>
      </Collapse>),
      { attachTo: document.body },
    );

    const collapseWrapper = wrapper.findComponent(Collapse);
    const collapseItemWrappers = collapseWrapper.findAllComponents(CollapseItem);
    const collapseItemHeaderEls = wrapper.findAll('.lp-collapse-item__header');
    expect(collapseItemWrappers[0].vm.isActive).toBe(true);

    collapseItemHeaderEls[2].trigger('click');
    await nextTick();
    expect(collapseItemWrappers[0].vm.isActive).toBe(true);
    expect(collapseItemWrappers[2].vm.isActive).toBe(true);
    collapseItemHeaderEls[0].trigger('click');
    await nextTick();
    expect(collapseItemWrappers[0].vm.isActive).toBe(false);
  });

  test('accordion', async () => {
    const activeNames = ref(['1']);
    const wrapper = mount(
      () => (
        <Collapse accordion v-model:value={activeNames.value}>
          <CollapseItem title="title1" name="1">
            <div class="content">111</div>
          </CollapseItem>
          <CollapseItem title="title2" name="2">
            <div class="content">222</div>
          </CollapseItem>
          <CollapseItem title="title3" name="3">
            <div class="content">333</div>
          </CollapseItem>
          <CollapseItem title="title4" name="4">
            <div class="content">444</div>
          </CollapseItem>
        </Collapse>
      ),
      { attachTo: document.body },
    );

    const collapseWrapper = wrapper.findComponent(Collapse);
    const collapseItemWrappers = collapseWrapper.findAllComponents(CollapseItem);

    const collapseItemHeaderEls = wrapper.findAll('.lp-collapse-item__header');
    expect(collapseItemWrappers[0].vm.isActive).toBe(true);

    collapseItemHeaderEls[2].trigger('click');
    await nextTick();
    expect(collapseItemWrappers[0].vm.isActive).toBe(false);
    expect(collapseItemWrappers[2].vm.isActive).toBe(true);

    collapseItemHeaderEls[0].trigger('click');
    await nextTick();
    expect(collapseItemWrappers[0].vm.isActive).toBe(true);
    expect(collapseItemWrappers[2].vm.isActive).toBe(false);
  });

  test('event:change', async () => {
    const onChange = vi.fn();
    const activeNames = ref(['1']);
    const wrapper = mount(
      () => (<Collapse v-model:value={activeNames.value} onChange={onChange}>
        <CollapseItem title="title1" name="1">
          <div class="content">111</div>
        </CollapseItem>
        <CollapseItem title="title2" name="2">
          <div class="content">222</div>
        </CollapseItem>
        <CollapseItem title="title3" name="3">
          <div class="content">333</div>
        </CollapseItem>
        <CollapseItem title="title4" name="4">
          <div class="content">444</div>
        </CollapseItem>
      </Collapse>),
      { attachTo: document.body },
    );

    const collapseWrapper = wrapper.findComponent(Collapse);
    const collapseItemWrappers = collapseWrapper.findAllComponents(CollapseItem);
    const collapseItemHeaderEls = wrapper.findAll('.lp-collapse-item__header');

    expect(collapseItemWrappers[0].vm.isActive).toBe(true);
    expect(activeNames.value).toEqual(['1']);
    expect(onChange).not.toHaveBeenCalled();

    collapseItemHeaderEls[2].trigger('click');
    await nextTick();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(collapseItemWrappers[0].vm.isActive).toBe(true);
    expect(collapseItemWrappers[2].vm.isActive).toBe(true);
    expect(activeNames.value).toEqual(['1', '3']);

    collapseItemHeaderEls[0].trigger('click');
    await nextTick();
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(collapseItemWrappers[0].vm.isActive).toBe(false);
    expect(activeNames.value).toEqual(['3']);
  });

  test('deep watch vModel:value', async () => {
    const activeNames = ref(['1', '2']);
    const wrapper = mount(
      () => (<Collapse v-model:value={activeNames.value}>
        <CollapseItem title="title1" name="1">
          <div class="content">111</div>
        </CollapseItem>
        <CollapseItem title="title2" name="2">
          <div class="content">222</div>
        </CollapseItem>
        <CollapseItem title="title3" name="3">
          <div class="content">333</div>
        </CollapseItem>
        <CollapseItem title="title4" name="4">
          <div class="content">444</div>
        </CollapseItem>
      </Collapse>),
      { attachTo: document.body },
    );

    await nextTick();
    const collapseWrapper = wrapper.findComponent(Collapse);
    const collapseItemWrappers = collapseWrapper.findAllComponents(CollapseItem);

    expect(collapseItemWrappers[0].vm.isActive).toBe(true);
    expect(collapseItemWrappers[1].vm.isActive).toBe(true);
  });
});
