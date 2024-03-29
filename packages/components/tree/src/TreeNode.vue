<template>
  <div
    v-show="node.visible"
    ref="node$"
    :class="[
      ns.b('node'),
      ns.is('expanded', expanded),
      ns.is('current', node.isCurrent),
      ns.is('hidden', !node.visible),
      ns.is('focusable', !node.disabled),
      ns.is('checked', !node.disabled && node.checked),
      getNodeClass(node),
    ]"
    role="treeitem"
    tabindex="-1"
    :aria-expanded="expanded"
    :aria-disabled="node.disabled"
    :aria-checked="node.checked"
    :draggable="tree.props.draggable"
    :data-key="getNodeKey(node)"
    @click.stop="handleClick"
    @contextmenu="handleContextMenu"
    @dragstart.stop="handleDragStart"
    @dragover.stop="handleDragOver"
    @dragend.stop="handleDragEnd"
    @drop.stop="handleDrop"
  >
    <div
      :class="ns.be('node', 'content')"
      :style="{ paddingLeft: (node.level - 1) * tree.props.indent + 'px' }"
    >
      <lp-icon
        v-if="tree.props.icon || CaretRight"
        :class="[
          ns.be('node', 'expand-icon'),
          ns.is('leaf', node.isLeaf),
          { expanded: !node.isLeaf && expanded },
        ]"
        @click.stop="handleExpandIconClick"
      >
        <component :is="tree.props.icon || CaretRight" />
      </lp-icon>
      <lp-checkbox
        v-if="showCheckbox"
        :checked="node.checked"
        :indeterminate="node.indeterminate"
        :disabled="!!node.disabled"
        @click.stop
        @change="handleCheckChange as any"
      />
      <lp-icon
        v-if="node.loading"
        :class="[ns.be('node', 'loading-icon'), ns.is('loading')]"
      >
        <loading />
      </lp-icon>
      <node-content :node="node" :render-content="renderContent" />
    </div>
    <lp-collapse-transition>
      <div
        v-if="!renderAfterExpand || childNodeRendered"
        v-show="expanded"
        :class="ns.be('node', 'children')"
        role="group"
        :aria-expanded="expanded"
      >
        <lp-tree-node
          v-for="child in node.childNodes"
          :key="getNodeKey(child)"
          :render-content="renderContent"
          :render-after-expand="renderAfterExpand"
          :show-checkbox="showCheckbox"
          :node="child"
          :accordion="accordion"
          :props="props.props"
          @node-expand="handleChildNodeExpand"
        />
      </div>
    </lp-collapse-transition>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, inject, nextTick, provide, ref, watch } from 'vue';
import { isFunction, isString } from '@vue/shared';
import LpCollapseTransition from '@lemon-peel/components/collapseTransition';
import { LpIcon } from '@lemon-peel/components/icon';
import { CaretRight, Loading } from '@element-plus/icons-vue';
import { debugWarn } from '@lemon-peel/utils';
import { useNamespace } from '@lemon-peel/hooks';
import LpCheckbox from '@lemon-peel/components/checkbox';

import { getNodeKey as getNodeKeyUtil, handleCurrentChange } from './model/util';
import { useNodeExpandEventBroadcast } from './model/useNodeExpandEventBroadcast';
import { dragEventsKey } from './model/useDragNode';
import { rootTreeKey } from './tokens';
import NodeContent from './TreeNodeContent.vue';
import Node from './model/node';

import type { ComponentInternalInstance, PropType } from 'vue';
import type { Nullable } from '@lemon-peel/utils';
import type { TreeNodeContentRender, TreeNodeData, TreeOptionProps } from './tree';

defineOptions({
  name: 'LpTreeNode',
});

const props  = defineProps({
  node: { type: Node, default: () => ({}) },
  props: { type: Object as PropType<TreeOptionProps>, default: () => ({}) },
  accordion: Boolean,
  renderContent: { type: Function as PropType<TreeNodeContentRender>, default: undefined },
  renderAfterExpand: Boolean,
  showCheckbox: { type: Boolean, default: false },
});

const emit = defineEmits(['node-expand']);

const ns = useNamespace('tree');
const { broadcastExpanded } = useNodeExpandEventBroadcast(props);
const tree = inject(rootTreeKey)!;
const expanded = ref(false);
const childNodeRendered = ref(false);
const oldChecked = ref<boolean>(false);
const oldIndeterminate = ref<boolean>(false);
const node$ = ref<HTMLElement>();
const dragEvents = inject(dragEventsKey)!;
const instance = getCurrentInstance()!;

provide('NodeInstance', instance);
if (!tree) {
  debugWarn('Tree', "Can not find node's tree.");
}

if (props.node.expanded) {
  expanded.value = true;
  childNodeRendered.value = true;
}

const childrenKey = 'children';
watch(
  () => {
    const children = props.node.data[childrenKey];
    return children && [...children];
  },
  () => {
    props.node.updateChildren();
  },
);

const handleSelectChange = (checked: boolean, indeterminate: boolean) => {
  if (
    oldChecked.value !== checked ||
        oldIndeterminate.value !== indeterminate
  ) {
    tree.ctx.emit('check-change', props.node.data, checked, indeterminate);
  }
  oldChecked.value = checked;
  oldIndeterminate.value = indeterminate;
};

watch(
  () => props.node.indeterminate,
  val => {
    handleSelectChange(props.node.checked, val);
  },
);

watch(
  () => props.node.checked,
  val => {
    handleSelectChange(val, props.node.indeterminate);
  },
);

watch(
  () => props.node.expanded,
  val => {
    nextTick(() => (expanded.value = val));
    if (val) {
      childNodeRendered.value = true;
    }
  },
);

const getNodeKey = (node: Node): any => {
  return getNodeKeyUtil(tree.props.nodeKey, node.data);
};

const getNodeClass = (node: Node) => {
  const nodeClassFunc = props.props.class;

  if (!nodeClassFunc)  return {};

  let className;
  if (isFunction(nodeClassFunc)) {
    const { data } = node;
    className = nodeClassFunc(data, node);
  } else {
    className = nodeClassFunc;
  }

  return isString(className) ? { [className]: true } : className;
};

const handleExpandIconClick = () => {
  if (props.node.isLeaf) return;
  if (expanded.value) {
    tree.ctx.emit('node-collapse', props.node.data, props.node, instance);
    props.node.collapse();
  } else {
    props.node.expand();
    emit('node-expand', props.node.data, props.node, instance);
  }
};

const handleCheckChange = (checked: any) => {
  props.node.setChecked(checked, !tree.props.checkStrictly);
  nextTick(() => {
    const store = tree.store.value;
    tree.ctx.emit('check', props.node.data, {
      checkedNodes: store.getCheckedNodes(),
      checkedKeys: store.getCheckedKeys(),
      halfCheckedNodes: store.getHalfCheckedNodes(),
      halfCheckedKeys: store.getHalfCheckedKeys(),
    });
  });
};

const handleContextMenu = (event: Event) => {
  if (tree.instance.vnode.props?.onNodeContextmenu) {
    event.stopPropagation();
    event.preventDefault();
  }
  tree.ctx.emit(
    'node-contextmenu',
    event,
    props.node.data,
    props.node,
    instance,
  );
};

const handleChildNodeExpand = (nodeData: TreeNodeData, node: Node, vm: ComponentInternalInstance) => {
  broadcastExpanded(node);
  tree.ctx.emit('node-expand', nodeData, node, vm);
};

const handleDragStart = (event: DragEvent) => {
  if (!tree.props.draggable) return;
  dragEvents.treeNodeDragStart({ event, treeNode: props });
};

const handleDragOver = (event: DragEvent) => {
  event.preventDefault();
  if (!tree.props.draggable) return;
  dragEvents.treeNodeDragOver({
    event,
    treeNode: { $el: node$.value, node: props.node },
  });
};

const handleDrop = (event: DragEvent) => {
  event.preventDefault();
};

const handleDragEnd = (event: DragEvent) => {
  if (!tree.props.draggable) return;
  dragEvents.treeNodeDragEnd(event);
};

const exposeProps = {
  handleExpandIconClick,
};

Object.assign(instance, exposeProps);

defineExpose(exposeProps);

const handleClick = (e: MouseEvent) => {
  handleCurrentChange(tree.store, tree.ctx.emit, () =>
    tree.store.value.setCurrentNode(props.node),
  );
  tree.currentNode.value = props.node;

  if (tree.props.expandOnClickNode) {
    handleExpandIconClick();
  }

  if (tree.props.checkOnClickNode && !props.node.disabled) {
    handleCheckChange(!props.node.checked);
  }

  tree.ctx.emit('node-click', props.node.data, props.node, instance, e);
};
</script>
