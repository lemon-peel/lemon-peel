import { buildProps, iconPropType } from '@lemon-peel/utils';

import type { ComponentInternalInstance, ExtractPropTypes, PropType, VNode, h } from 'vue';
import type TreeStore from './model/treeStore';
import type Node from './model/node';
import type { SetupContext } from 'vue';

export type TreeNodeContentRender = (render: typeof h, options: { _self?: ComponentInternalInstance, node: Node, data: TreeNodeData, store: TreeStore }) => VNode;

export type TreeNodeOptions = {
  data: TreeNodeData;
  store: TreeStore;
  parent?: Node;
};

export type TreeNodeData = Record<string, any>;
export type TreeKey = string | number;

export interface TreeOptionProps {
  children?: string;
  label?: string | ((data: TreeNodeData, node: Node) => string);
  disabled?: string | ((data: TreeNodeData, node: Node) => string);
  isLeaf?: string | ((data: TreeNodeData, node: Node) => boolean);
  class?: string
  | { [key: string]: boolean }
  | ((data: TreeNodeData, node: Node) => string | null);
}

export type FilterNodeFunc = (
  value: FilterValue,
  data: TreeNodeData,
  child: Node
) => boolean;

export type TreeDataLoader = (currentNode: Node) => Promise<TreeData>;

export const treeNodeContentProps = buildProps({
  node: { type: Object as PropType<Node>, required: true },
  renderContent: { type: Function as PropType<TreeNodeContentRender>, default: undefined },
});

export type TreeData = TreeNodeData[];

export interface FakeNode {
  data: TreeNodeData;
}

export interface TreeNodeLoadedDefaultProps {
  checked?: boolean;
}

export interface TreeNodeChildState {
  all: boolean;
  none: boolean;
  allWithoutDisable: boolean;
  half: boolean;
}

export interface TreeStoreOptions {
  key: TreeKey;
  data: TreeData;
  lazy: boolean;
  props: TreeOptionProps;
  load: TreeDataLoader;
  currentNodeKey: TreeKey;
  checkStrictly: boolean;
  checkDescendants: boolean;
  defaultCheckedKeys: TreeKey[];
  defaultExpandedKeys: TreeKey[];
  autoExpandParent: boolean;
  defaultExpandAll: boolean;
  filterNodeMethod: FilterNodeFunc;
}

export interface RenderContentCtx {
  _self: ComponentInternalInstance;
  node: Node;
  data: TreeNodeData;
  store: TreeStore;
}

export type AllowDragFunc = (node: Node) => boolean;

export type AllowDropType = 'inner' | 'prev' | 'next';

export type AllowDropFunc = (
  draggingNode: Node,
  dropNode: Node,
  type: AllowDropType
) => boolean;

export type FilterValue = any;

export type NodeDropType = 'before' | 'after' | 'inner' | 'none';


export const treeProps = buildProps({
  defaultCheckedKeys: { type: Array as PropType<TreeKey[]>, default: () => [] },
  checkedKeys: { type: Array as PropType<TreeKey[]>, default: () => [] },
  defaultExpandedKeys: { type:  Array as PropType<TreeKey[]>, default: () => [] },

  data: { type: Array as PropType<TreeNodeData[]>, default: () => [] },
  emptyText: { type: String, default: undefined },
  renderAfterExpand: { type: Boolean, default: true },
  nodeKey: { type: String, default: '' },
  checkStrictly: Boolean,
  defaultExpandAll: Boolean,
  expandOnClickNode: { type: Boolean, default: true },
  checkOnClickNode: Boolean,
  checkDescendants: { type: Boolean, default: false },
  autoExpandParent: { type: Boolean, default: true },
  currentNodeKey: { type: [String, Number] as PropType<TreeKey>, default: () => '' },
  renderContent: { type: Function as PropType<TreeNodeContentRender>, default: void 0 },
  showCheckbox: { type: Boolean, default: false },
  draggable: { type: Boolean, default: false },
  allowDrag: { type: Function, default: void 0 },
  allowDrop: { type: Function, default: void 0 },
  lazy: { type: Boolean, default: false },
  highlightCurrent: Boolean,
  load: { type: Function as PropType<TreeDataLoader>, default: void 0 },
  filterNodeMethod: { type: Function as PropType<FilterNodeFunc>, default: void 0 },
  accordion: Boolean,
  indent: { type: Number, default: 18 },
  icon: { type: iconPropType, default: void 0 },
  props: {
    type: Object as PropType<TreeOptionProps>,
    default: () => ({
      children: 'children',
      label: 'label',
      disabled: 'disabled',
    }),
  },
});

export type TreeProps = Readonly<ExtractPropTypes<typeof treeProps>>;

export const treeEmits = [
  'check',
  'select',
  'current-change',
  'check-change',
  'load',

  'node-click',
  'node-contextmenu',
  'node-collapse',
  'node-expand',
  'check',
  'node-drag-start',
  'node-drag-end',
  'node-drop',
  'node-drag-leave',
  'node-drag-enter',
  'node-drag-over',
];

export type TreeEmit = SetupContext<typeof treeEmits>['emit'];
