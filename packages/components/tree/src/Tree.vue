<template>
  <div
    ref="elRef"
    :class="[
      ns.b(),
      ns.is('dragging', !!dragState.draggingNode),
      ns.is('drop-not-allow', !dragState.allowDrop),
      ns.is('drop-inner', dragState.dropType === 'inner'),
      { [ns.m('highlight-current')]: highlightCurrent },
    ]"
    role="tree"
  >
    <lp-tree-node
      v-for="child in childNodes" :key="getNodeKey(child)"
      :node="child" :props="props.props" :accordion="accordion" :render-after-expand="renderAfterExpand"
      :show-checkbox="showCheckbox" :render-content="renderContent"
      @node-expand="onNodeExpand"
    />
    <div v-if="isEmpty" :class="ns.e('empty-block')">
      <span :class="ns.e('empty-text')">{{ emptyText ?? t('lp.tree.emptyText') }}</span>
    </div>
    <div v-show="dragState.showDropIndicator" ref="dropIndicatorRef" :class="ns.e('drop-indicator')" />
  </div>
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance, provide, ref, shallowRef, watch, useSlots } from 'vue';
import { useLocale, useNamespace } from '@lemon-peel/hooks';
import { formItemContextKey } from '@lemon-peel/tokens';
import { getNodeKey as getNodeKeyUtil, handleCurrentChange } from './model/util';
import { useNodeExpandEventBroadcast } from './model/useNodeExpandEventBroadcast';
import { useDragNodeHandler } from './model/useDragNode';
import { useKeydown } from './model/useKeydown';
import { treeEmits, treeProps } from './tree';
import { rootTreeKey } from './tokens';
import TreeStore from './model/treeStore';
import LpTreeNode from './TreeNode.vue';

import type Node from './model/node';
import type { ComponentInternalInstance, PropType, SetupContext } from 'vue';
import type { TreeData, TreeKey, TreeNodeData } from './tree';

defineOptions({ name: 'LpTree' });

const props = defineProps(treeProps);
const emit = defineEmits(treeEmits);

const slots = useSlots();

const { t } = useLocale();
const ns = useNamespace('tree');

const store = ref<TreeStore>(new TreeStore(props, emit));

const root = ref(store.value.root);
const childNodes = store.value.root.childNodes;
const currentNode = ref<Node>();
const elRef = shallowRef<HTMLElement>(null as any);
const dropIndicatorRef = shallowRef<HTMLElement>(null as any);

const { broadcastExpanded } = useNodeExpandEventBroadcast(props);

const { dragState } = useDragNodeHandler({
  props,
  emit,
  elRef,
  dropIndicatorRef,
  store,
});

useKeydown({ elRef }, store);

const isEmpty = computed(() => {
  const childNodes = root.value.childNodes;
  return (
    !childNodes ||
        childNodes.every(({ visible }) => !visible)
  );
});

watch(
  () => props.currentNodeKey,
  newValue => {
    store.value.setCurrentNodeKey(newValue);
  },
);

watch(
  () => props.checkedKeys,
  newValue => {
    store.value.setDefaultCheckedKeys(newValue!);
  },
);

watch(
  () => props.defaultExpandedKeys,
  newValue => {
    store.value.setDefaultExpandedKeys(newValue!);
  },
);

watch(
  () => props.data,
  newVal => {
    store.value.onDataChange(newVal);
  },
  { deep: true },
);

const filter = (val: any) => {
  if (!props.filterNodeMethod)
    throw new Error('[Tree] filterNodeMethod is required when filter');
  store.value.filter(val);
};

const getNodeKey = (node: Node) => {
  return getNodeKeyUtil(props.nodeKey!, node.data);
};

const getNodePath = (data: TreeKey | TreeNodeData) => {
  if (!props.nodeKey)
    throw new Error('[Tree] nodeKey is required in getNodePath');
  const node = store.value.getNode(data);
  if (!node) return [];
  const path = [node.data];
  let parent = node.parent;
  while (parent && parent !== root.value) {
    path.push(parent.data);
    parent = parent.parent;
  }
  return path.reverse();
};

const getCheckedNodes = (
  leafOnly?: boolean,
  includeHalfChecked?: boolean,
): TreeNodeData[] => {
  return store.value.getCheckedNodes(leafOnly, includeHalfChecked);
};

const getCheckedKeys = (leafOnly?: boolean): TreeKey[] => {
  return store.value.getCheckedKeys(leafOnly);
};

const getCurrentNode = (): TreeNodeData | null => {
  const node = store.value.getCurrentNode();
  return node ? node.data : null;
};

const getCurrentKey = (): any => {
  if (!props.nodeKey)
    throw new Error('[Tree] nodeKey is required in getCurrentKey');
  const node = getCurrentNode();
  return node ? node[props.nodeKey] : null;
};

const setCheckedNodes = (nodes: Node[], leafOnly = false) => {
  if (!props.nodeKey)
    throw new Error('[Tree] nodeKey is required when call setCheckedNodes');

  store.value.setCheckedNodes(nodes, leafOnly);
};

const setCheckedKeys = (keys: TreeKey[], leafOnly = false) => {
  if (!props.nodeKey)
    throw new Error('[Tree] nodeKey is required when call setCheckedKeys');

  store.value.setCheckedKeys(keys, leafOnly);
};

const setChecked = (
  data: TreeKey | TreeNodeData,
  checked: boolean,
  deep: boolean,
) => {
  store.value.setChecked(data, checked, deep);
};

const getHalfCheckedNodes = (): TreeNodeData[] => {
  return store.value.getHalfCheckedNodes();
};

const getHalfCheckedKeys = (): TreeKey[] => {
  return store.value.getHalfCheckedKeys();
};

const setCurrentNode = (node: Node, shouldAutoExpandParent = true) => {
  if (!props.nodeKey)
    throw new Error('[Tree] nodeKey is required when call setCurrentNode');

  handleCurrentChange(
    store,
    emit as SetupContext['emit'],
    () => store.value.setUserCurrentNode(node, shouldAutoExpandParent),
  );
};

const setCurrentKey = (key?: TreeKey, shouldAutoExpandParent = true) => {
  if (!props.nodeKey)
    throw new Error('[Tree] nodeKey is required when call setCurrentKey');

  handleCurrentChange(store, emit as SetupContext['emit'], () =>
    store.value.setCurrentNodeKey(key, shouldAutoExpandParent),
  );
};

const getNode = (data: TreeKey | TreeNodeData) => {
  return store.value.getNode(data);
};

const remove = (data: TreeKey | TreeNodeData) => {
  store.value.remove(data);
};

const append = (
  data: TreeNodeData,
  parentNode: TreeNodeData | TreeKey | Node,
) => {
  store.value.append(data, parentNode);
};

const insertBefore = (
  data: TreeNodeData,
  referenceNode: TreeKey | TreeNodeData,
) => {
  store.value.insertBefore(data, referenceNode);
};

const insertAfter = (
  data: TreeNodeData,
  referenceNode: TreeKey | TreeNodeData,
) => {
  store.value.insertAfter(data, referenceNode);
};

const onNodeExpand = (
  nodeData: TreeNodeData,
  node: Node,
  instance: ComponentInternalInstance,
) => {
  broadcastExpanded(node);
  emit('node-expand', nodeData, node, instance);
};

const updateKeyChildren = (key: TreeKey, data: TreeData) => {
  if (!props.nodeKey)
    throw new Error('[Tree] nodeKey is required when call updateKeyChild');
  store.value.updateChildren(key, data);
};


provide(rootTreeKey, {
  ctx: { emit, slots },
  props,
  store,
  root,
  currentNode,
  instance: getCurrentInstance()!,
});

// eslint-disable-next-line unicorn/no-useless-undefined
// 阻止 injection 暴露到内部使用的组件
provide(formItemContextKey, undefined as any);

defineExpose({
  store,
  filter,
  updateKeyChildren,
  getCheckedNodes,
  setCheckedNodes,
  getCheckedKeys,
  setCheckedKeys,
  setChecked,
  getHalfCheckedNodes,
  getHalfCheckedKeys,
  getCurrentKey,
  getCurrentNode,
  setCurrentKey,
  setCurrentNode,
  getNodePath,
  getNode,
  remove,
  append,
  insertBefore,
  insertAfter,
});
</script>
