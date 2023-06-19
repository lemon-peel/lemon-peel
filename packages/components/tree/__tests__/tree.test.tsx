import { nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { cloneDeep } from 'lodash-es';
import { rAF } from '@lemon-peel/test-utils/tick';
import defineGetter from '@lemon-peel/test-utils/defineGetter';

import Tree from '../src/Tree.vue';

import type { ComponentPublicInstance } from 'vue';
import type { VueWrapper } from '@vue/test-utils';
import type { ComponentMountingOptions } from '@lemon-peel/test-utils/makeMount';
import type { FilterNodeFunc } from '../src/tree';
import type { TreeDataLoader, TreeNodeContentRender, TreeKey, TreeNodeData } from '../src/tree';
import type Node from '../src/model/node';

const delay = (duration: number) => new Promise(resolve => setTimeout(resolve, duration));

const ALL_NODE_COUNT = 9;

const defaultData = [
  {
    id: 1,
    label: '[1]',
    children: [
      {
        id: 11,
        label: '[1-1]',
        children: [{ id: 111, label: '[1-1-1]' }],
      },
    ],
  },
  {
    id: 2,
    label: '[2]',
    children: [
      { id: 21, label: '[2-1]' },
      { id: 22, label: '[2-2]' },
    ],
  },
  {
    id: 3,
    label: '[3]',
    children: [
      { id: 31, label: '[3-1]' },
      { id: 32, label: '[3-2]' },
    ],
  },
];

const defaultExpandedKeys = [] as TreeKey[];
const defaultCheckedKeys = [] as TreeKey[];

type MountingOptionsTree = ComponentMountingOptions<typeof Tree>;

const getTreeWrap = (props: MountingOptionsTree['props'] = {}, options: MountingOptionsTree = {}) => {
  return mount(
    () => <Tree {...{ data: cloneDeep(defaultData), ...(props as any) } } vSlots={props!.vSlots} />,
    { attachTo: 'body', ...options },
  );
};

const getDisableTreeVm = (props = '', options = {}) => {
  const wrapper = mount(
    Object.assign({
      components: { 'lp-tree': Tree },
      template: `<lp-tree ref="tree" :data="data" ${props}></lp-tree>`,
      data() {
        return {
          defaultExpandedKeys: [],
          defaultCheckedKeys: [],
          clickedNode: null,
          count: 1,
          data: [
            {
              id: 1,
              label: '一级 1',
              children: [
                {
                  id: 11,
                  label: '二级 1-1',
                  children: [
                    { id: 111, label: '三级 1-1', disabled: true },
                  ],
                },
              ],
            },
            {
              id: 2,
              label: '一级 2',
              children: [
                { id: 21, label: '二级 2-1' },
                { id: 22, label: '二级 2-2' },
              ],
            },
            {
              id: 3,
              label: '一级 3',
              children: [
                { id: 31, label: '二级 3-1' },
                { id: 32, label: '二级 3-2' },
              ],
            },
          ],
          defaultProps: { children: 'children', label: 'label', disabled: 'disabled' },
        };
      },
    }, options),
  );
  return wrapper;
};

let wrapper: VueWrapper<ComponentPublicInstance>;

describe('Tree.vue', () => {
  afterEach(() => {
    wrapper?.unmount();
    document.body.innerHTML;
  });

  test('create', async () => {
    const data = ref(cloneDeep(defaultData));
    wrapper = getTreeWrap({
      data: data.value,
      nodeKey: 'id',
      defaultExpandAll: true,
    });

    expect(wrapper.find('.lp-tree').exists()).toBeTruthy();
    expect(wrapper.findAll('.lp-tree > .lp-tree-node').length).toEqual(3);
    expect(wrapper.findAll('.lp-tree .lp-tree-node').length)
      .toEqual(ALL_NODE_COUNT);
    data.value[1].children = [{ id: 21, label: '[2-1 n]' }] as any;
    await nextTick();
    expect(wrapper.findAll('.lp-tree .lp-tree-node').length)
      .toEqual(ALL_NODE_COUNT - 1);
  });

  test('click node', async () => {
    const clickedNode = ref<TreeNodeData | null>(null);
    const onNodeClick = (data: TreeNodeData) => {
      clickedNode.value = data;
    };

    wrapper = getTreeWrap({ onNodeClick });

    const firstNodeContentWrapper = wrapper.find('.lp-tree-node__content');
    const firstNodeWrapper = wrapper.find('.lp-tree-node');

    await firstNodeContentWrapper.trigger('click');
    await nextTick(); // because node click method to expaned is async

    expect(clickedNode.value?.label).toEqual('[1]');
    expect(firstNodeWrapper.classes('is-expanded')).toBe(true);
    expect(firstNodeWrapper.classes('is-current')).toBe(true);

    await firstNodeContentWrapper.trigger('click');
    await nextTick(); // because node click method to expaned is async

    expect(firstNodeWrapper.classes('is-expanded')).toBe(false);
    expect(firstNodeWrapper.classes('is-current')).toBe(true);
  });

  test('emptyText', async () => {
    wrapper = getTreeWrap({ data: [] });
    await nextTick();
    expect(wrapper.find('.lp-tree__empty-block').exists()).toBe(true);
  });

  test('expandOnNodeClick', async () => {
    wrapper = getTreeWrap({ expandOnClickNode: false });

    const firstNodeContentWrapper = wrapper.find('.lp-tree-node__content');
    const firstNodeWrapper = wrapper.find('.lp-tree-node');

    await firstNodeContentWrapper.trigger('click');
    await nextTick(); // because node click method to expaned is async

    expect(firstNodeWrapper.classes('is-expanded')).toBe(false);
  });

  test('checkOnNodeClick', async () => {
    wrapper = getTreeWrap({
      nodeKey: 'id',
      showCheckbox: true,
      checkOnClickNode: true,
    });

    const treeWrapper = wrapper.findComponent(Tree);
    const firstNodeContentWrapper = wrapper.find('.lp-tree-node__content');

    await firstNodeContentWrapper.trigger('click');
    expect(
      (treeWrapper.vm as InstanceType<typeof Tree>).getCheckedKeys(),
    ).toEqual([1, 11, 111]);
  });

  test('current-node-key', async () => {
    wrapper = getTreeWrap({
      defaultExpandAll: true,
      highlightCurrent: true,
      nodeKey:'id',
      currentNodeKey:11,
    });

    const currentNodeLabelWrapper = wrapper.find(
      '.is-current .lp-tree-node__label',
    );

    expect(currentNodeLabelWrapper.text()).toEqual('[1-1]');
    expect(wrapper.find('.lp-tree--highlight-current').exists()).toBe(true);
  });

  test('defaultExpandAll', async () => {
    wrapper = getTreeWrap({
      data: cloneDeep(defaultData),
      defaultExpandAll: true,
    });

    const expanedNodeWrappers = wrapper.findAll('.lp-tree-node.is-expanded');
    expect(expanedNodeWrappers.length).toEqual(ALL_NODE_COUNT);
  });

  test('defaultExpandedKeys', async () => {
    wrapper = getTreeWrap({
      expandedKeys: [1, 3],
      nodeKey: 'id',
    });
    const expanedNodeWrappers = wrapper.findAll('.lp-tree-node.is-expanded');
    expect(expanedNodeWrappers.length).toEqual(2);
  });

  test('defaultExpandedKeys set', async () => {
    const data = ref(cloneDeep(defaultData));
    const expandedKeys = ref([1, 3]);

    wrapper = mount(
      () => <Tree data={data.value} expandedKeys={expandedKeys.value} nodeKey={'id'} />,
      { attachTo: document.body },
    );

    await nextTick();
    const tree = wrapper.findComponent(Tree).vm;
    let expanedNodeWrappers = wrapper.findAll('.lp-tree-node.is-expanded');
    expect(expanedNodeWrappers.length).toEqual(2);
    expandedKeys.value = [2];
    await nextTick();
    await nextTick();
    data.value = [{
      id: 4,
      label: 'L1 4',
      children: [],
    },
    ...JSON.parse(JSON.stringify(tree.data)),
    ];
    await nextTick();
    await nextTick();
    await nextTick();
    expanedNodeWrappers = wrapper.findAll('.lp-tree-node.is-expanded');
    expect(expanedNodeWrappers.length).toEqual(1);
  });

  test('filter-node-method', async () => {
    wrapper = getTreeWrap({
      filterNodeMethod: ((value, data) => {
        if (!value) return true;
        return data.label.includes(value);
      }) as FilterNodeFunc,
    });

    const treeWrapper = wrapper.findComponent(Tree)
    ;(treeWrapper.vm as InstanceType<typeof Tree>).filter('2-1');

    await nextTick();
    expect(treeWrapper.findAll('.lp-tree-node.is-hidden').length).toEqual(3);
  });

  test('autoExpandParent = true', async () => {
    const expandedKeys = ref([111]);
    wrapper = getTreeWrap({
      expandedKeys: expandedKeys.value,
      nodeKey: 'id',
    });

    expect(wrapper.findAll('.lp-tree-node.is-expanded').length).toEqual(3);
  });

  test('autoExpandParent = false', async () => {
    const expandedKeys = ref([111]);
    wrapper = getTreeWrap({
      expandedKeys: expandedKeys.value,
      nodeKey: 'id',
      autoExpandParent: false,
    });

    expect(wrapper.findAll('.lp-tree-node.is-expanded').length).toEqual(0);

    const firstNodeContentWrapper = wrapper.find('.lp-tree-node');
    await firstNodeContentWrapper.trigger('click');
    await nextTick();
    await rAF();

    expect(wrapper.findAll('.lp-tree-node.is-expanded').length).toEqual(1);
  });

  test('defaultCheckedKeys & check-strictly = false', async () => {
    wrapper = getTreeWrap({
      defaultExpandAll: true,
      showCheckbox: true,
      checkedKeys: [1],
      nodeKey: 'id',
    });
    expect(wrapper.findAll('.lp-checkbox .is-checked').length).toEqual(3);
  });

  test('defaultCheckedKeys & check-strictly', async () => {
    wrapper = getTreeWrap({
      defaultExpandAll: true,
      showCheckbox: true,
      checkedKeys: [1],
      nodeKey: 'id',
      checkStrictly: true,
    });
    expect(wrapper.findAll('.lp-checkbox .is-checked').length).toEqual(1);
  });

  test('show checkbox', async () => {
    wrapper = getTreeWrap({
      showCheckbox: true,
    });

    const treeWrapper = wrapper.findComponent(Tree);
    const treeVm = treeWrapper.vm as InstanceType<typeof Tree>;
    const secondNodeContentWrapper = treeWrapper.findAll(
      '.lp-tree-node__content',
    )[1];
    const secondNodeCheckboxWrapper =
      secondNodeContentWrapper.find('.lp-checkbox');
    const secondNodeExpandIconWrapper = secondNodeContentWrapper
      .find('.lp-tree-node__expand-icon');

    expect(secondNodeCheckboxWrapper.exists()).toBe(true);
    await secondNodeCheckboxWrapper.trigger('click');

    expect(treeVm.getCheckedNodes().length).toEqual(3);
    expect(treeVm.getCheckedNodes(true).length).toEqual(2);

    await secondNodeExpandIconWrapper.trigger('click');
    await nextTick();

    const secondTreeNodeWrapper = treeWrapper.findAll('.lp-tree-node')[1];
    const secondNodefirstLeafCheckboxWrapper = secondTreeNodeWrapper.find(
      '.lp-tree-node__children .lp-tree-node__content .lp-checkbox',
    );

    await secondNodefirstLeafCheckboxWrapper.trigger('click');
    expect(treeVm.getCheckedNodes().length).toEqual(1);
  });

  test('check', async () => {
    const onCheckMockFunc = vi.fn();
    wrapper = getTreeWrap({
      showCheckbox: true,
      onCheck: onCheckMockFunc,
    });

    const secondNodeContentWrapper = wrapper.findAll(
      '.lp-tree-node__content',
    )[1];
    const secondNodeCheckboxWrapper =
      secondNodeContentWrapper.find('.lp-checkbox');
    expect(secondNodeCheckboxWrapper.exists()).toBe(true);

    await secondNodeCheckboxWrapper.trigger('click');
    await nextTick();

    expect(onCheckMockFunc.mock.calls.length).toBe(1);
    const [data, args] = onCheckMockFunc.mock.calls[0];
    expect(data.id).toEqual(2);
    expect(args.checkedNodes.length).toEqual(3);
  });

  test.skip('setCheckedNodes', async () => {
    wrapper = getTreeWrap({
      showCheckbox: true,
      nodeKey: 'id',
    });

    const treeWrapper = wrapper.findComponent(Tree);
    const treeVm = treeWrapper.vm as InstanceType<typeof Tree>;
    const secondNodeContentWrapper = wrapper.findAll(
      '.lp-tree-node__content',
    )[1];
    const secondNodeCheckWrapper = secondNodeContentWrapper.find('.lp-checkbox');
    await secondNodeCheckWrapper.trigger('click');

    expect(treeVm.getCheckedNodes().length).toEqual(3);
    expect(treeVm.getCheckedNodes(true).length).toEqual(2);

    treeVm.setCheckedNodes([]);
    expect(treeVm.getCheckedNodes().length).toEqual(0);
  });

  test.skip('setCheckedKeys', async () => {
    wrapper = getTreeWrap({
      showCheckbox: true,
      nodeKey: 'id',
    });
    const treeWrapper = wrapper.findComponent(Tree);
    const tree = treeWrapper.vm as InstanceType<typeof Tree>;

    tree.setCheckedKeys([111]);
    expect(tree.getCheckedNodes().length).toEqual(3);
    expect(tree.getCheckedKeys().length).toEqual(3);

    tree.setCheckedKeys([1]);
    expect(tree.getCheckedNodes().length).toEqual(3);
    expect(tree.getCheckedKeys().length).toEqual(3);

    tree.setCheckedKeys([2]);
    expect(tree.getCheckedNodes().length).toEqual(3);
    expect(tree.getCheckedKeys().length).toEqual(3);

    tree.setCheckedKeys([21]);
    expect(tree.getCheckedNodes().length).toEqual(1);
    expect(tree.getCheckedKeys().length).toEqual(1);
  });

  test.skip('setCheckedKeys with checkStrictly', async () => {
    wrapper = getTreeWrap({
      checkStrictly: true,
      showCheckbox: true, nodeKey:'id',
    });

    const treeWrapper = wrapper.findComponent(Tree);
    const tree = treeWrapper.vm as InstanceType<typeof Tree>;

    tree.setCheckedKeys([111]);
    expect(tree.getCheckedNodes().length).toEqual(1);
    expect(tree.getCheckedKeys().length).toEqual(1);

    tree.setCheckedKeys([1]);
    expect(tree.getCheckedNodes().length).toEqual(1);
    expect(tree.getCheckedKeys().length).toEqual(1);

    tree.setCheckedKeys([2]);
    expect(tree.getCheckedNodes().length).toEqual(1);
    expect(tree.getCheckedKeys().length).toEqual(1);

    tree.setCheckedKeys([21, 22]);
    expect(tree.getCheckedNodes().length).toEqual(2);
    expect(tree.getCheckedKeys().length).toEqual(2);
  });

  test('method setChecked', async () => {
    wrapper = getTreeWrap({
      showCheckbox: true,
      nodeKey: 'id',
    });
    const treeWrapper = wrapper.findComponent(Tree);
    const tree = treeWrapper.vm as InstanceType<typeof Tree>;

    tree.setChecked(111, true, true);
    expect(tree.getCheckedNodes().length).toEqual(3);
    expect(tree.getCheckedKeys().length).toEqual(3);

    tree.setChecked(tree.data[0], false, true);
    expect(tree.getCheckedNodes().length).toEqual(0);
    expect(tree.getCheckedKeys().length).toEqual(0);
  });


  test.skip('setCheckedKeys with leafOnly=false', async () => {
    wrapper = getTreeWrap({
      showCheckbox: true,
      nodeKey: 'id',
    });

    const treeWrapper = wrapper.findComponent(Tree);
    const tree = treeWrapper.vm as InstanceType<typeof Tree>;

    tree.setCheckedKeys([1, 11, 111, 2], false);
    expect(tree.getCheckedNodes().length).toEqual(6);
    expect(tree.getCheckedKeys().length).toEqual(6);
  });

  test.skip('setCheckedKeys with leafOnly=true', async () => {
    wrapper = getTreeWrap({
      showCheckbox: true,
      nodeKey: 'id',
    });

    const treeWrapper = wrapper.findComponent(Tree);
    const tree = treeWrapper.vm as InstanceType<typeof Tree>;

    tree.setCheckedKeys([2], true);
    expect(tree.getCheckedNodes().length).toEqual(2);
    expect(tree.getCheckedKeys().length).toEqual(2);
  });

  test('setCurrentKey', async () => {
    wrapper = getTreeWrap({
      showCheckbox: true,
      nodeKey: 'id',
    });

    const treeWrapper = wrapper.findComponent(Tree);
    const tree = treeWrapper.vm as InstanceType<typeof Tree>;

    tree.setCurrentKey(111);
    expect(tree.store.currentNode!.data.id).toEqual(111);

    tree.setCurrentKey();
    expect(tree.store.currentNode).toEqual(null);
  });

  test.skip('setCurrentKey should also auto expand parent', async () => {
    wrapper = getTreeWrap({
      showCheckbox: true,
      nodeKey: 'id',
    });

    const treeWrapper = wrapper.findComponent(Tree);
    const tree = treeWrapper.vm as InstanceType<typeof Tree>;

    tree.setCurrentKey(111);
    await nextTick();
    expect(wrapper.find('.is-current').exists()).toBeTruthy();

    tree.setCurrentKey();
    await nextTick();
    expect(wrapper.find('.is-current').exists()).toBeFalsy();
  });

  test('setCurrentKey should not expand self', async () => {
    wrapper = getTreeWrap({
      showCheckbox: true,
      nodeKey: 'id',
    });

    const treeWrapper = wrapper.findComponent(Tree);
    const tree = treeWrapper.vm as InstanceType<typeof Tree>;

    tree.setCurrentKey(1);
    await nextTick();
    await nextTick();
    await nextTick();
    expect(wrapper.text()).toBe('[1][2][3]');
    expect(wrapper.findAll('.is-expanded')).toHaveLength(0);

    tree.setCurrentKey(11);
    await nextTick();
    await nextTick();
    await nextTick();
    expect(wrapper.text()).toBe('[1][1-1][2][3]');
    expect(wrapper.findAll('.is-expanded')).toHaveLength(1);

    tree.setCurrentKey(111);
    await nextTick();
    await nextTick();
    await nextTick();
    expect(wrapper.text()).toBe('[1][1-1][1-1-1][2][3]');
    expect(wrapper.findAll('.is-expanded')).toHaveLength(2);
  });

  test('setCurrentNode', async () => {
    wrapper = getTreeWrap({
      showCheckbox: true,
      nodeKey: 'id',
    });

    const treeWrapper = wrapper.findComponent(Tree);
    const tree = treeWrapper.vm as InstanceType<typeof Tree>;

    tree.setCurrentNode({ id: 111, label: '三级 1-1' } as Node);
    expect(tree.store.currentNode!.data.id).toEqual(111);

    tree.setCurrentKey();
    expect(tree.store.currentNode).toEqual(null);
  });

  test.skip('setCurrentNode should also auto expand parent', async () => {
    wrapper = getTreeWrap({
      showCheckbox: true,
      nodeKey: 'id',
    });

    const treeWrapper = wrapper.findComponent(Tree);
    const tree = treeWrapper.vm as InstanceType<typeof Tree>;

    tree.setCurrentNode({
      id: 111,
      label: '三级 1-1',
    } as Node);
    await nextTick();
    expect(wrapper.find('.is-current').exists()).toBeTruthy();

    tree.setCurrentKey();
    await nextTick();
    expect(wrapper.find('.is-current').exists()).toBeFalsy();
  });

  test('setCurrentNode should not expand self', async () => {
    wrapper = getTreeWrap({
      showCheckbox: true,
      nodeKey: 'id',
    });

    await nextTick();
    const treeWrapper = wrapper.findComponent(Tree);
    const tree = treeWrapper.vm as InstanceType<typeof Tree>;

    tree.setCurrentNode({ id: 1, label: '[1]' } as Node);
    await nextTick();
    await nextTick();
    await nextTick();
    expect(wrapper.text()).toBe('[1][2][3]');
    expect(wrapper.findAll('.is-expanded')).toHaveLength(0);

    tree.setCurrentNode({ id: 11, label: '[1-1]' } as Node);
    await nextTick();
    await nextTick();
    await nextTick();
    expect(wrapper.text()).toBe('[1][1-1][2][3]');
    expect(wrapper.findAll('.is-expanded')).toHaveLength(1);

    tree.setCurrentNode({ id: 111, label: '[1-1-1]' } as Node);
    await nextTick();
    await nextTick();
    await nextTick();
    expect(wrapper.text()).toBe('[1][1-1][1-1-1][2][3]');
    expect(wrapper.findAll('.is-expanded')).toHaveLength(2);
  });

  test('getCurrentKey', async () => {
    wrapper = getTreeWrap({
      showCheckbox: true,
      nodeKey: 'id',
    });

    const treeWrapper = wrapper.findComponent(Tree);
    const tree = treeWrapper.vm as InstanceType<typeof Tree>;

    tree.setCurrentKey(111);
    expect(tree.getCurrentKey()).toEqual(111);

    tree.setCurrentKey();
    expect(tree.getCurrentKey()).toEqual(null);
  });

  test('getCurrentNode', async () => {
    wrapper = getTreeWrap({
      showCheckbox: true,
      nodeKey: 'id',
    });
    const treeWrapper = wrapper.findComponent(Tree);
    const tree = treeWrapper.vm as InstanceType<typeof Tree>;

    tree.setCurrentKey(111);
    expect(tree.getCurrentNode()?.id).toEqual(111);
  });

  test('getNode', async () => {
    wrapper = getTreeWrap({ nodeKey: 'id' });

    const treeWrapper = wrapper.findComponent(Tree);
    const tree = treeWrapper.vm as InstanceType<typeof Tree>;

    const node = tree.getNode(111)!;
    expect(node.data.id).toEqual(111);
  });

  test.skip('remove', async () => {
    wrapper = getTreeWrap({ nodeKey: 'id' });

    const treeWrapper = wrapper.findComponent(Tree);
    const tree = treeWrapper.vm;

    tree.setCurrentKey(1);
    expect(tree.getCurrentNode()?.id).toEqual(1);
    tree.remove(1);

    expect(tree.data[0].id).toEqual(2);
    expect(tree.getNode(1)).toEqual(null);
    expect(tree.getCurrentNode()).toEqual(null);
  });

  test('append', async () => {
    wrapper = getTreeWrap({ nodeKey: 'id' });
    const treeWrapper = wrapper.findComponent(Tree);
    const tree = treeWrapper.vm;

    const nodeData = { id: 88, label: '88' };
    tree.append(nodeData, tree.getNode(1)!);

    expect(tree.data[0].children.length).toEqual(2);
    expect(tree.getNode(88)!.data).toEqual(nodeData);
  });

  test('insertBefore', async () => {
    wrapper = mount(
      () => <Tree nodeKey='id' data={cloneDeep(defaultData)} />,
      { attachTo: document.body },
    );
    const treeWrapper = wrapper.findComponent(Tree);
    const tree = treeWrapper.vm;

    const nodeData = { id: 88, label: '88' };
    tree.insertBefore(nodeData, tree.getNode(11)!.data);
    expect(tree.data[0].children.length).toEqual(2);
    expect(tree.data[0].children[0]).toEqual(nodeData);
    expect(tree.getNode(88)!.data).toEqual(nodeData);
  });

  test('insertAfter', async () => {
    wrapper = getTreeWrap({ nodeKey: 'id' });
    const treeWrapper = wrapper.findComponent(Tree);
    const tree = treeWrapper.vm as InstanceType<typeof Tree>;

    const nodeData = { id: 88, label: '88' };
    tree.insertAfter(nodeData, tree.getNode(11)!);
    expect(tree.data[0].children.length).toEqual(2);
    expect(tree.data[0].children[1]).toEqual(nodeData);
    expect(tree.getNode(88)!.data).toEqual(nodeData);
  });

  test('set disabled checkbox', async () => {
    wrapper = getDisableTreeVm(
      `:props="defaultProps" show-checkbox node-key="id" default-expand-all`,
    );
    const nodeWrapper = wrapper.findAll('.lp-tree-node__content')[2];
    const checkboxWrapper = nodeWrapper.find('.lp-checkbox input');

    expect((checkboxWrapper.element as HTMLInputElement).disabled).toEqual(true);
  });

  test('check strictly', async () => {
    wrapper = getTreeWrap({
      showCheckbox: true,
      checkStrictly: true,
      defaultExpandAll: true,
    });
    const treeWrapper = wrapper.findComponent(Tree);
    const secondNodeContentWrapper = wrapper.findAll(
      '.lp-tree-node__content',
    )[3];
    const secondNodeCheckboxWrapper =
      secondNodeContentWrapper.find('.lp-checkbox');
    await secondNodeCheckboxWrapper.trigger('click');
    expect(
      (treeWrapper.vm as InstanceType<typeof Tree>).getCheckedNodes().length,
    ).toEqual(1);
    expect(
      (treeWrapper.vm as InstanceType<typeof Tree>).getCheckedNodes(true).length,
    ).toEqual(0);

    const secondTreeNodeWrapper = treeWrapper.findAll('.lp-tree-node')[3];
    const secondNodefirstLeafCheckboxWrapper = secondTreeNodeWrapper.find(
      '.lp-tree-node__children .lp-tree-node__content .lp-checkbox',
    );
    await secondNodefirstLeafCheckboxWrapper.trigger('click');
    expect(
      (treeWrapper.vm as InstanceType<typeof Tree>).getCheckedNodes().length,
    ).toEqual(2);
  });

  test('render content', async () => {
    const renderContent: TreeNodeContentRender = (h, opts) => {
      return h('div', { class: 'custom-content' }, [
        h('button', { class: 'lp-button' }, [opts.node.label]),
      ]);
    };

    wrapper = getTreeWrap({
      renderContent,
    });

    const firstNodeWrapper = wrapper.find('.lp-tree-node__content');
    expect(firstNodeWrapper.find('.custom-content').exists()).toBe(true);

    const buttonWrapper = firstNodeWrapper.find('.custom-content button');
    expect(buttonWrapper.exists()).toBe(true);
    expect(buttonWrapper.text()).toEqual('[1]');
  });

  test.skip('custom-node-class', async () => {
    wrapper = getTreeWrap({
      defaultExpandAll: true,
      highlightCurrent: true,
      nodeKey: 'id',
      currentNodeKey: 11,
      props: {
        class: (data: TreeNodeData) => {
          return data.id === 11 ? 'is-test' : null;
        },
      },
    });

    const currentNodeLabelWrapper = wrapper.find('.is-test .lp-tree-node__label');

    expect(currentNodeLabelWrapper.text()).toEqual('[1-1]');
  });

  test('scoped slot', async () => {
    wrapper = getTreeWrap({
      vSlots: {
        default: (scope: { node: Node }) => (
          <div class="custom-tree-template">
            <span>{scope.node.label}</span>
            <button></button>
          </div>
        ),
      },
    }, {});

    const firstNodeWrapper = wrapper.find('.custom-tree-template');
    expect(firstNodeWrapper.exists()).toBe(true);
    const spanWrapper = firstNodeWrapper.find('span');
    const buttonWrapper = firstNodeWrapper.find('button');
    expect(spanWrapper.exists()).toBe(true);
    expect(spanWrapper.text()).toEqual('[1]');
    expect(buttonWrapper.exists()).toBe(true);
  });

  test('load node', async () => {
    let count = 0;
    const loadNode: TreeDataLoader = async node => {
      if (node.level === 0) {
        return [{ label: 'region1' }, { label: 'region2' }];
      }
      if (node.level > 4) return [];

      await delay(50);
      return [
        { label: `zone${++count}` },
        { label: `zone${++count}` },
      ];
    };

    wrapper = getTreeWrap({
      lazy: true,
      showCheckbox: true,
      load: loadNode,
    });

    let nodeWrappers = wrapper.findAll('.lp-tree-node__content');

    expect(nodeWrappers.length).toEqual(2);
    vi.useFakeTimers();
    await nodeWrappers[0].trigger('click');
    vi.runAllTimers();
    vi.useRealTimers();
    await nextTick(); // wait load finish
    nodeWrappers = wrapper.findAll('.lp-tree-node__content');
    expect(nodeWrappers.length).toEqual(4);
  });

  test('lazy defaultChecked', async () => {
    let count = 0;
    const loadNode: TreeDataLoader = async node => {
      if (node.level === 0) {
        return [{ label: 'region1', id: count++ }, { label: 'region2', id: count++ }];
      } else if (node.level > 4) {
        return [];
      } else {
        await delay(50);
        return [
          { label: `zone${count}`, id: count++ },
          { label: `zone${count}`, id: count++ },
        ];
      }
    };

    wrapper = getTreeWrap({
      lazy: true,
      showCheckbox: true,
      nodeKey: 'id',
      load: loadNode,
    });

    const treeWrapper = wrapper.findComponent(Tree);
    const tree = treeWrapper.vm;
    const firstNodeWrapper = treeWrapper.find('.lp-tree-node__content');
    expect(firstNodeWrapper.find('.is-indeterminate').exists()).toEqual(false);

    tree.store.setCheckedKeys([3]);
    vi.useFakeTimers();
    await firstNodeWrapper.find('.lp-tree-node__expand-icon').trigger('click');
    vi.runAllTimers();
    vi.useRealTimers();
    await nextTick();

    expect(firstNodeWrapper.find('.is-indeterminate').exists()).toEqual(true);
    const childWrapper = treeWrapper.findAll('.lp-tree-node__content')[1];
    expect(childWrapper.find('input').element.checked).toEqual(true);
  });

  test.skip('lazy expandOnChecked', async () => {
    let count = 0;
    const loadNode: TreeDataLoader = async node => {
      if (node.level === 0) {
        return [{ label: 'region1', id: count++ }, { label: 'region2', id: count++ }];
      } else if (node.level > 2) {
        return [];
      } else {
        await delay(50);
        return [
          { label: `zone${count}`, id: count++ },
          { label: `zone${count}`, id: count++ },
        ];
      }
    };

    wrapper = getTreeWrap({
      lazy: true,
      showCheckbox: true,
      nodeKey: 'id',
      load: loadNode,
      checkDescendants: true,
    });

    const treeWrapper = wrapper.findComponent(Tree);
    const tree = treeWrapper.vm as InstanceType<typeof Tree>;

    vi.useFakeTimers();
    tree.store.setCheckedKeys([1]);
    vi.runAllTimers();
    vi.useRealTimers();
    await nextTick();
    expect(tree.getCheckedKeys().length).toEqual(7);
  });

  test.skip('lazy without expandOnChecked', async () => {
    let count = 0;
    const loadNode: TreeDataLoader = async node => {
      if (node.level === 0) {
        return [{ label: 'region1', id: count++ }, { label: 'region2', id: count++ }];
      } else if (node.level > 4) {
        return [];
      } else {
        await delay(50);
        return [
          { label: `zone${count}`, id: count++ },
          { label: `zone${count}`, id: count++ },
        ];
      }
    };

    wrapper = getTreeWrap({
      lazy: true,
      showCheckbox: true,
      nodeKey: 'id',
      load: loadNode,
    });

    const treeWrapper = wrapper.findComponent(Tree);
    const tree = treeWrapper.vm as InstanceType<typeof Tree>;

    tree.store.setCheckedKeys([1]);
    await nextTick();

    const nodeWrappers = treeWrapper.findAll('.lp-tree-node__content');
    expect(nodeWrappers[0].find('input').element.checked).toEqual(true);
    expect(nodeWrappers.length).toEqual(2);
  });

  test('accordion', async () => {
    wrapper = getTreeWrap({
      accordion: true,
    });

    const firstNodeContentWrapper = wrapper.find('.lp-tree-node__content');
    const secondNodeContentWrapper = wrapper.find(
      '.lp-tree-node:nth-child(2) .lp-tree-node__content',
    );
    await firstNodeContentWrapper.trigger('click');

    expect(wrapper.find('.lp-tree-node').classes('is-expanded')).toBe(true);
    await secondNodeContentWrapper.trigger('click');
    expect(wrapper.find('.lp-tree-node').classes('is-expanded')).toBe(false);
  });

  test('handleNodeOpen & handleNodeClose', async () => {
    let count = 0;

    const loadNode: TreeDataLoader = async node => {
      if (node.level === 0) {
        return [{ label: 'region1' }, { label: 'region2' }];
      } else if (node.level > 4) {
        return [];
      } else {
        await nextTick();
        return [
          { label: `zone${count}`, id: count++ },
          { label: `zone${count}`, id: count++ },
        ];
      }
    };

    const currentNode = ref<TreeNodeData | null>(null);
    const nodeExpended = ref(false);

    const onNodeExpand = (data: TreeNodeData) => {
      currentNode.value = data;
      nodeExpended.value = true;
    };
    const onNodeCollapse = (data: TreeNodeData) => {
      currentNode.value = data;
      nodeExpended.value = false;
    };

    wrapper = getTreeWrap({
      lazy: true,
      load: loadNode,
      onNodeExpand,
      onNodeCollapse,
    });

    const firstNodeContentWrapper = wrapper.find('.lp-tree-node__content');
    const firstNodeWrapper = wrapper.find('.lp-tree-node');

    expect(firstNodeWrapper.find('.lp-tree-node__children').exists())
      .toBe(false);

    await firstNodeContentWrapper.trigger('click');
    await nextTick(); // first next tick for UI update
    await nextTick(); // second next tick for triggering loadNode
    await nextTick(); // third next tick for updating props.node.expanded


    expect(nodeExpended.value).toEqual(true);
    expect(currentNode.value?.label).toEqual('region1');

    await firstNodeContentWrapper.trigger('click');
    await nextTick();
    await nextTick();
    await nextTick();

    expect(nodeExpended.value).toEqual(false);
    expect(currentNode.value?.label).toEqual('region1');
  });

  test.skip('updateKeyChildren', async () => {
    wrapper = getTreeWrap({
      nodeKey: 'id',
      defaultExpandAll: true,
      showCheckbox: true,
    });

    const treeWrapper = wrapper.findComponent(Tree);
    const tree = treeWrapper.vm as InstanceType<typeof Tree>;

    tree.updateKeyChildren(1, [{
      id: 111,
      label: '三级 1-1',
    }]);

    await nextTick();

    const nodeContentWrapper = wrapper.findAll('.lp-tree-node__content')[1];
    const nodeLabelWrapper = nodeContentWrapper.find('.lp-tree-node__label');

    expect(tree.store.nodesMap.get(11)).toEqual(undefined);
    expect(tree.store.nodesMap.get(1)!.childNodes[0].data.id).toEqual(111);
    expect(nodeLabelWrapper.text()).toEqual('三级 1-1');
  });

  test('update multi tree data', async () => {
    const data = ref(cloneDeep(defaultData));
    wrapper = mount(
      () => (<div>
        <Tree ref="tree1" data={data.value} node-key="id" />
        <Tree ref="tree2" data={data.value} node-key="id" />
      </div>),
      { attachTo: document.body },
    );

    const nodeData = { label: '新增 1', id: 4, children: [] };
    data.value.push(nodeData);

    await nextTick();

    const treeWrappers: any = wrapper.findAllComponents(Tree);
    expect(treeWrappers[0].vm.getNode(4).data).toEqual(nodeData);
    expect(treeWrappers[1].vm.getNode(4).data).toEqual(nodeData);
  });

  test.skip('navigate with defaultExpandAll', () => {
    wrapper = getTreeWrap({
      nodeKey: 'id',
      defaultExpandAll: true,
    });
    const tree = wrapper.findComponent(Tree);
    expect(
      Object.values(
        (tree.vm as InstanceType<typeof Tree>).store.nodesMap,
      ).filter(item => item.canFocus).length,
    ).toBe(9);
  });

  test.skip('navigate up', async () => {
    wrapper = getTreeWrap({
      nodeKey: 'id',
    });
    let flag = false;
    function handleFocus() {
      return () => (flag = true);
    }
    await nextTick();
    const tree = wrapper.findComponent(Tree);
    const targetElement = wrapper.find('div[data-key="3"]').element;
    const fromElement = wrapper.find('div[data-key="1"]').element;
    defineGetter(targetElement, 'focus', handleFocus)
    ;(tree.vm as InstanceType<typeof Tree>).setCurrentKey(1);
    expect(fromElement.classList.contains('is-focusable')).toBeTruthy();
    fromElement.dispatchEvent(
      new KeyboardEvent('keydown', {
        code: 'ArrowUp',
        bubbles: true,
        cancelable: false,
      }),
    );
    expect(flag).toBe(true);
  });

  test.skip('navigate down', async () => {
    wrapper = getTreeWrap({
      nodeKey: 'id',
      defaultExpandAll: true,
    });

    let flag = false;
    function handleFocus() {
      return () => (flag = true);
    }
    await nextTick();
    const tree = wrapper.findComponent(Tree);
    const targetElement = wrapper.find('div[data-key="2"]').element;
    const fromElement = wrapper.find('div[data-key="1"]').element;
    defineGetter(targetElement, 'focus', handleFocus);
    (tree.vm as InstanceType<typeof Tree>).setCurrentKey(1);
    expect(fromElement.classList.contains('is-focusable')).toBeTruthy();
    fromElement.dispatchEvent(
      new KeyboardEvent('keydown', {
        code: 'ArrowDown',
        bubbles: true,
        cancelable: false,
      }),
    );
    expect(flag).toBe(true);
  });

  test.skip('navigate with disabled', async () => {
    const data = ref([{
      id: 1,
      label: '[1]',
      children: [
        {
          id: 11,
          label: '[1-1]',
          children: [
            { id: 111, label: '[1-1-1]', disabled: true },
          ],
        },
      ],
    }, {
      id: 2,
      label: '[2]',
      disabled: true,
      children: [
        { id: 21, label: '[2-1]' },
        { id: 22, label: '[2-2]' },
      ],
    }, {
      id: 3,
      label: '[3]',
      children: [
        { id: 31, label: '[3-1]' },
        { id: 32, label: '[3-2]' },
      ],
    }]);

    wrapper = getTreeWrap({
      data: data.value,
    });

    let flag = false;
    function handleFocus() {
      return () => (flag = true);
    }
    await nextTick();
    const tree = wrapper.findComponent({ name: 'ElTree' });
    const targetElement = wrapper.find('div[data-key="3"]').element;
    const fromElement = wrapper.find('div[data-key="1"]').element;
    defineGetter(targetElement, 'focus', handleFocus)
    ;(tree.vm as InstanceType<typeof Tree>).setCurrentKey(1);
    expect(fromElement.classList.contains('is-focusable')).toBeTruthy();
    fromElement.dispatchEvent(
      new KeyboardEvent('keydown', {
        code: 'ArrowDown',
        bubbles: true,
        cancelable: false,
      }),
    );
    expect(flag).toBe(true);
  });

  test.skip('navigate with lazy and without node-key', async () => {
    const count = ref(0);

    const loadNode: TreeDataLoader = async node => {
      if (node.level === 0) {
        return [{ name: 'region1' }, { name: 'region2' }];
      }

      if (node.level > 3) return [];

      let hasChild: boolean;
      if (node.data.name === 'region1') {
        hasChild = true;
      } else if (node.data.name === 'region2') {
        hasChild = false;
      } else {
        hasChild = false;
      }

      const data: { name: string }[] = hasChild
        ? [{ name: `zone${++count.value}` }, { name: `zone${++count.value}` }]
        : [];
      return data;
    };

    wrapper = getTreeWrap({
      load: loadNode,
      lazy: true,
      showCheckbox: true,
    });

    let flag = false;
    function handleFocus() {
      return () => (flag = !flag);
    }
    await nextTick();
    const tree = wrapper.findComponent({ name: 'ElTree' });
    const originElements = wrapper.findAll('div[data-key]');
    const region1 = originElements[0].element;
    const region2 = originElements[1].element;
    defineGetter(region2, 'focus', handleFocus);
    // expand
    region1.dispatchEvent(new MouseEvent('click'));
    expect(region1.classList.contains('is-focusable')).toBeTruthy();
    await nextTick();
    await nextTick();
    expect(
      Object.values((tree.vm as InstanceType<typeof Tree>).store.nodesMap),
    ).toHaveLength(5); // The root node (void node) + 4 child nodes (region1, region2, zone1, zone2)
    expect(
      Object.values(
        Object.values(
          (tree.vm as InstanceType<typeof Tree>).store.nodesMap,
        ).filter(item => item.canFocus).length === 4,
      ),
    ).toBeTruthy();
    // collapse
    region1.dispatchEvent(new MouseEvent('click'));
    expect(
      Object.values(
        Object.values(
          (tree.vm as InstanceType<typeof Tree>).store.nodesMap,
        ).filter(item => item.canFocus).length === 2,
      ),
    ).toBeTruthy();
    // ArrowDown, region2 focus
    region1.dispatchEvent(
      new KeyboardEvent('keydown', {
        code: 'ArrowDown',
        bubbles: true,
        cancelable: false,
      }),
    );
    expect(flag).toBe(true);
    defineGetter(region1, 'focus', handleFocus);
    // ArrowDown, region1 focus
    region2.dispatchEvent(
      new KeyboardEvent('keydown', {
        code: 'ArrowDown',
        bubbles: true,
        cancelable: false,
      }),
    );
    expect(flag).toBe(false);
  });
});
