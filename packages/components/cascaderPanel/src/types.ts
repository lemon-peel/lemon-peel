import type { InjectionKey } from 'vue';
import type { Nullable } from '@lemon-peel/utils';
import type { default as CascaderNode, CascaderOption, CascaderProps, RenderLabel } from './node';


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
  lazyLoad: (node: CascaderNode | null, callback?: (dataList: CascaderOption[]) => void) => void;
  expandNode: (node: CascaderNode, silent?: boolean) => void;
  handleCheckChange: (
    node: CascaderNode,
    checked: boolean,
    emitClose?: boolean
  ) => void;
}

export const CASCADER_PANEL_INJECTION_KEY: InjectionKey<LpCascaderPanelContext> =
  Symbol('cascader-panel');

export { type ExpandTrigger, type default as CascaderNode, type CascaderOption, type CascaderProps } from './node';