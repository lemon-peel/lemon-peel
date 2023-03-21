import { buildProps, iconPropType } from '@lemon-peel/utils';

import type { ComponentInternalInstance, ExtractPropTypes, PropType, VNode, h } from 'vue';
import type TreeStore from './model/treeStore';
import type Node from './model/node';

export const treeEmits = [
  'check-change',
  'current-change',
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

export type TreeNodeContentRender = (render: typeof h, options: { _self?: ComponentInternalInstance, node: Node, data: TreeNodeData, store: TreeStore }) => VNode;

export const treeProps = buildProps({
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
  defaultCheckedKeys: { type: Array as PropType<TreeKey[]>, default: () => [] },
  defaultExpandedKeys: { type:  Array as PropType<TreeKey[]>, default: () => [] },
  currentNodeKey: { type: [String, Number] as PropType<string | number>, default: () => '' },
  renderContent: { type: Function as PropType<TreeNodeContentRender>, default: void 0 },
  showCheckbox: { type: Boolean, default: false },
  draggable: { type: Boolean, default: false },
  allowDrag: { type: Function, default: void 0 },
  allowDrop: { type: Function, default: void 0 },
  lazy: { type: Boolean, default: false },
  highlightCurrent: Boolean,
  load: { type: Function as PropType<LoadFunction>, default: void 0 },
  filterNodeMethod: { type: Function as PropType<FilterNodeMethodFunction>, default: void 0 },
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

export const treeNodeContentProps = buildProps({
  node: { type: Object as PropType<Node>, required: true },
  renderContent: { type: Function as PropType<TreeNodeContentRender>, default: undefined },
});

export type TreeProps = Readonly<ExtractPropTypes<typeof treeProps>>;

export declare type HType = typeof h;
export declare type TreeData = TreeNodeData[];
export declare type TreeKey = string | number;
export declare interface FakeNode {
  data: TreeNodeData;
}

export type TreeNodeData = Record<string, any>;

export declare interface TreeNodeLoadedDefaultProps {
  checked?: boolean;
}

export declare interface TreeNodeChildState {
  all: boolean;
  none: boolean;
  allWithoutDisable: boolean;
  half: boolean;
}
export declare interface TreeNodeOptions {
  data: TreeNodeData;
  store: TreeStore;
  parent?: Node;
}
export declare interface TreeStoreNodesMap {
  [key: TreeKey]: Node;
}
export declare interface TreeStoreOptions {
  key: TreeKey;
  data: TreeData;
  lazy: boolean;
  props: TreeOptionProps;
  load: LoadFunction;
  currentNodeKey: TreeKey;
  checkStrictly: boolean;
  checkDescendants: boolean;
  defaultCheckedKeys: TreeKey[];
  defaultExpandedKeys: TreeKey[];
  autoExpandParent: boolean;
  defaultExpandAll: boolean;
  filterNodeMethod: FilterNodeMethodFunction;
}

export interface TreeOptionProps {
  children?: string;
  label?: string | ((data: TreeNodeData, node: Node) => string);
  disabled?: string | ((data: TreeNodeData, node: Node) => string);
  isLeaf?: string | ((data: TreeNodeData, node: Node) => boolean);
  class?: string
  | { [key: string]: boolean }
  | ((data: TreeNodeData, node: Node) => string);
}

export declare type RenderContentFunction = (
  h: HType,
  context: RenderContentContext
) => VNode | VNode[];

export declare interface RenderContentContext {
  _self: ComponentInternalInstance;
  node: Node;
  data: TreeNodeData;
  store: TreeStore;
}

export declare type AllowDragFunction = (node: Node) => boolean;

export declare type AllowDropType = 'inner' | 'prev' | 'next';

export declare type AllowDropFunction = (
  draggingNode: Node,
  dropNode: Node,
  type: AllowDropType
) => boolean;

export type LoadFunction = (rootNode: Node, loadedCallback: (data: TreeData) => void) => void;

export declare type FilterValue = any;

export declare type FilterNodeMethodFunction = (
  value: FilterValue,
  data: TreeNodeData,
  child: Node
) => boolean;

export declare type NodeDropType = 'before' | 'after' | 'inner' | 'none';
