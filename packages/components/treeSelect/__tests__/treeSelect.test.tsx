import { nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import TreeSelect from '../src/TreeSelect.vue';

import type { RenderFunction } from 'vue';
import type { VueWrapper } from '@vue/test-utils';
import type LpSelect from '@lemon-peel/components/select';
import type LpTree from '@lemon-peel/components/tree';

const createComponent = ({
  slots = {},
  props = {},
}: {
  slots?: Record<string, any>;
  props?: typeof TreeSelect['props'];
} = {}) => {
  const wrapperRef = ref<InstanceType<typeof TreeSelect>>();
  const value = props.value || ref('');
  const data = ref([
    {
      value: 1,
      label: '一级 1',
      children: [
        {
          value: 11,
          label: '二级 1-1',
          children: [
            {
              value: 111,
              label: '三级 1-1',
            },
          ],
        },
      ],
    },
  ]);

  const wrapper = mount({
    render() {
      return (
        <TreeSelect
          data={data.value}
          renderAfterExpand={false}
          {...props}
          value={value.value}
          onUpdate:value={(val: string) => (value.value = val)}
          ref={(val: InstanceType<typeof TreeSelect>) =>
            (wrapperRef.value = val)
          }
          v-slots={slots}
        />
      );
    },
  });

  return {
    wrapper,
    getWrapperRef: () =>
      new Promise<InstanceType<typeof TreeSelect>>(resolve =>
        nextTick(() => resolve(wrapperRef.value!)),
      ),
    select: wrapper.findComponent({ name: 'LpSelect' }) as VueWrapper<InstanceType<typeof LpSelect>>,
    tree: wrapper.findComponent({ name: 'LpTree' }) as VueWrapper<InstanceType<typeof LpTree>>,
  };
};

describe('TreeSelect.vue', () => {
  test('render test', async () => {
    const { wrapper, tree } = createComponent({
      props: {
        defaultExpandAll: true,
      },
    });

    expect(wrapper.find('.lp-tree')).toBeTruthy();
    expect(wrapper.find('.lp-select')).toBeTruthy();

    expect(tree.findAll('.lp-tree > .lp-tree-node').length).toBe(1);
    expect(tree.findAll('.lp-tree .lp-tree-node').length).toBe(3);
    expect(tree.findAll('.lp-tree .lp-select-dropdown__item').length).toBe(3);

    wrapper.findComponent(TreeSelect).vm.data[0].children = [];

    await nextTick();

    expect(tree.findAll('.lp-tree .lp-tree-node').length).toBe(1);
  });

  test('vModel:value', async () => {
    const value = ref(1);
    const { getWrapperRef, select, tree } = createComponent({
      props: {
        value,
        checkStrictly: true,
        showCheckbox: true,
        checkOnClickNode: true,
      },
    });

    const wrapperRef = await getWrapperRef();

    await nextTick();
    wrapperRef.
      expect(select.vm.value).toBe(1);
    expect(wrapperRef.getCheckedKeys()).toEqual([1]);

    value.value = 11;
    await nextTick(nextTick);
    expect(select.vm.value).toBe(11);
    expect(wrapperRef.getCheckedKeys()).toEqual([11]);

    await tree
      .findAll('.lp-select-dropdown__item')
      .slice(-1)[0]
      .trigger('click');
    await nextTick();
    expect(select.vm.value).toBe(111);
    expect(wrapperRef.getCheckedKeys()).toEqual([111]);

    await tree.find('.lp-tree-node__content').trigger('click');
    await nextTick();
    expect(select.vm.value).toBe(1);
    expect(wrapperRef.getCheckedKeys()).toEqual([1]);

    await tree.findAll('.lp-checkbox__original')[1].trigger('click');
    await nextTick();
    expect(select.vm.value).toBe(11);
    expect(wrapperRef.getCheckedKeys()).toEqual([11]);
  });

  test('disabled', async () => {
    const { wrapper, tree } = createComponent({
      props: {
        data: [
          {
            value: '1',
            label: '1',
            children: [
              {
                value: '2',
                label: '2',
                disabled: true,
              },
            ],
          },
        ],
        showCheckbox: true,
        checkStrictly: true,
        defaultExpandAll: true,
        checkOnClickNode: true,
      },
    });

    await nextTick();
    await tree.find('.lp-tree-node').trigger('click');
    await tree.find('.lp-tree-node .lp-checkbox.is-disabled').trigger('click');
    await tree
      .find('.lp-tree-node .lp-select-dropdown__item.is-disabled')
      .trigger('click');
    await nextTick();
    expect(wrapper.findComponent(TreeSelect).vm.value).toBe('1');
  });

  test('multiple', async () => {
    const value = ref([1]);
    const { getWrapperRef, select, tree } = createComponent({
      props: {
        value,
        checkStrictly: true,
        showCheckbox: true,
        multiple: true,
        checkOnClickNode: true,
      },
    });

    const wrapperRef = await getWrapperRef();

    await nextTick();
    expect(select.vm.value).toEqual([1]);
    expect(wrapperRef.getCheckedKeys()).toEqual([1]);

    value.value = [11];
    await nextTick(nextTick);
    expect(select.vm.value).toEqual([11]);
    expect(wrapperRef.getCheckedKeys()).toEqual([11]);

    await tree
      .findAll('.lp-select-dropdown__item')
      .slice(-1)[0]
      .trigger('click');
    await nextTick();
    expect(select.vm.value).toEqual([11, 111]);
    expect(wrapperRef.getCheckedKeys()).toEqual([11, 111]);

    await tree.find('.lp-tree-node__content').trigger('click');
    await nextTick();
    expect(select.vm.value).toEqual([1, 11, 111]);
    expect(wrapperRef.getCheckedKeys()).toEqual([1, 11, 111]);

    await tree.findAll('.lp-checkbox')[1].trigger('click');
    await nextTick();
    expect(select.vm.value).toEqual([1, 111]);
    expect(wrapperRef.getCheckedKeys()).toEqual([1, 111]);
  });

  test('filter', async () => {
    const { tree } = createComponent({
      props: {
        filterable: true,
      },
    });

    tree.vm.filter('一级 1');
    await nextTick();
    expect(tree.findAll('.lp-tree-node:not(.is-hidden)').length).toBe(1);
  });

  test('props', async () => {
    const { wrapper, select, tree } = createComponent({
      props: {
        data: [
          {
            id: '1',
            name: '1',
            childrens: [{ id: '2', name: '2' }],
          },
        ],
        props: { label: 'name', children: 'childrens' },
        valueKey: 'id',
      },
    });

    await nextTick();
    expect(tree.find('.lp-select-dropdown__item').text()).toBe('1');
    await wrapper.setProps({ value: '2' });
    expect(select.vm.selectedLabel).toBe('2');
  });

  test('slots', async () => {
    const { select, tree } = createComponent({
      slots: {
        default: ({ data }: { data: { label: string } }) => `123${data.label}`,
        prefix: () => 'prefix',
      },
    });

    await nextTick();
    expect(tree.find('.lp-select-dropdown__item').text()).toBe('123一级 1');
    expect(select.find('.lp-input__prefix-inner').text()).toBe('prefix');
  });

  test('renderContent', async () => {
    const { tree } = createComponent({
      props: {
        renderContent: (
          h: RenderFunction,
          { data }: { data: { label: string } },
        ) => {
          return `123${data.label}`;
        },
      },
    });

    await nextTick();
    expect(tree.find('.lp-select-dropdown__item').text()).toBe('123一级 1');
  });

  test('lazy', async () => {
    const { tree } = createComponent({
      props: {
        data: [
          {
            value: 1,
            label: 1,
          },
        ],
        lazy: true,
        load: (node: object, resolve: (p: any) => any[]) => {
          resolve([{ value: 2, label: 2, isLeaf: true }]);
        },
      },
    });

    await nextTick();
    await tree.find('.lp-tree-node').trigger('click');
    await nextTick();
    expect(tree.find('.lp-tree-node .lp-tree-node').text()).toBe('2');
  });

  test('events', async () => {
    const onNodeClick = vi.fn();
    const { tree } = createComponent({
      props: {
        onNodeClick,
      },
    });
    await nextTick();
    await tree.find('.lp-tree-node').trigger('click');
    await nextTick();
    expect(onNodeClick).toBeCalled();
  });

  test('check-strictly showCheckbox click node', async () => {
    const { getWrapperRef, select, tree } = createComponent({
      props: {
        checkStrictly: true,
        showCheckbox: true,
        multiple: true,
      },
    });

    const wrapperRef = await getWrapperRef();
    await tree.findAll('.lp-tree-node__content')[0].trigger('click');
    await nextTick();
    expect(select.vm.value).toEqual([]);
    expect(wrapperRef.getCheckedKeys()).toEqual([]);

    await tree
      .findAll('.lp-tree-node__content .lp-checkbox')[0]
      .trigger('click');
    await nextTick();
    expect(select.vm.value).toEqual([1]);
    expect(wrapperRef.getCheckedKeys()).toEqual([1]);
  });

  test('check-strictly showCheckbox checkOnClickNode click node', async () => {
    const { getWrapperRef, select, tree } = createComponent({
      props: {
        checkStrictly: true,
        showCheckbox: true,
        multiple: true,
        checkOnClickNode: true,
      },
    });

    const wrapperRef = await getWrapperRef();
    await tree.findAll('.lp-tree-node__content')[0].trigger('click');
    await nextTick();
    expect(select.vm.value).toEqual([1]);
    expect(wrapperRef.getCheckedKeys()).toEqual([1]);

    await tree
      .findAll('.lp-tree-node__content .lp-checkbox')[0]
      .trigger('click');
    await nextTick();
    expect(select.vm.value).toEqual([]);
    expect(wrapperRef.getCheckedKeys()).toEqual([]);
  });

  test('only show checkbox', async () => {
    const { select, tree } = createComponent({
      props: {
        showCheckbox: true,
      },
    });

    // check child node when folder node checked,
    // value.value will be 111
    await tree
      .find('.lp-tree-node__content .lp-checkbox__original')
      .trigger('click');
    await nextTick();
    expect(select.vm.value).equal(111);

    // unselect when has child checked
    await tree
      .find('.lp-tree-node__content .lp-checkbox__original')
      .trigger('click');
    await nextTick();
    expect(select.vm.value).toBe(undefined);
  });

  test('show checkbox and check on click node', async () => {
    const { select, tree } = createComponent({
      props: {
        showCheckbox: true,
        checkOnClickNode: true,
      },
    });

    // check child node when folder node checked,
    // value.value will be 111
    await tree.findAll('.lp-tree-node__content').slice(-1)[0].trigger('click');
    await nextTick();
    expect(select.vm.value).equal(111);

    // unselect when has child checked
    await tree.findAll('.lp-tree-node__content').slice(-1)[0].trigger('click');
    await nextTick();
    expect(select.vm.value).toBe(undefined);
  });

  test('expand selected node`s parent in first time', async () => {
    const value = ref(111);
    const { tree } = createComponent({
      props: { value },
    });

    expect(tree.findAll('.is-expanded[data-key="1"]').length).toBe(1);
    expect(tree.findAll('.is-expanded[data-key="11"]').length).toBe(1);
  });

  test('expand-on-click-node', async () => {
    const { wrapper, tree } = createComponent({
      props: {
        expandOnClickNode: false,
        checkOnClickNode: true,
      },
    });

    await tree.findAll('.lp-tree-node__content')[0].trigger('click');
    expect(
      tree.findAll('.lp-tree-node__children')[0].attributes('style'),
    ).toContain('display: none;');

    await wrapper.setProps({ expandOnClickNode: true });
    await tree.findAll('.lp-tree-node__content')[0].trigger('click');
    expect(
      tree.findAll('.lp-tree-node__children')[0].attributes('style'),
    ).not.toContain('display: none;');
  });
});
