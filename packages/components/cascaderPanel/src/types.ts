import type { InjectionKey, VNode } from 'vue';
import type { Nullable } from '@lemon-peel/utils';
import type { default as CascaderNode, CascaderOption, CascaderProps } from './node';


export type CascaderNodeValue = string | number;
export type CascaderNodePathValue = CascaderNodeValue[];
export type CascaderValue =
  | CascaderNodeValue
  | CascaderNodePathValue
  | (CascaderNodeValue | CascaderNodePathValue)[];
export type CascaderConfig = Required<CascaderProps>;
export type IsDisabled = (data: CascaderOption, node: CascaderNode) => boolean;
export type IsLeaf = (data: CascaderOption, node: CascaderNode) => boolean;
export type Resolve = (dataList?: CascaderOption[]) => void;
export type LazyLoad = (node: CascaderNode, resolve: Resolve) => void;
export type RenderLabel = (argument: {
  node: CascaderNode;
  data: CascaderOption;
}) => VNode | VNode[];

export interface Tag {
  node?: CascaderNode;
  key: number;
  text: string;
  hitState?: boolean;
  closable: boolean;
  isCollapseTag: boolean;
}

export interface LpCascaderPanelContext {
  config: CascaderConfig;
  expandingNode: Nullable<CascaderNode>;
  checkedNodes: CascaderNode[];
  isHoverMenu: boolean;
  initialLoaded: boolean;
  renderLabelFn: RenderLabel;
  lazyLoad: (
    node?: CascaderNode,
    callback?: (dataList: CascaderOption[]) => void
  ) => void;
  expandNode: (node: CascaderNode, silent?: boolean) => void;
  handleCheckChange: (
    node: CascaderNode,
    checked: boolean,
    emitClose?: boolean
  ) => void;
}

export const CASCADER_PANEL_INJECTION_KEY: InjectionKey<LpCascaderPanelContext> =
  Symbol();

export { type ExpandTrigger, type default as CascaderNode, type CascaderOption, type CascaderProps } from './node';