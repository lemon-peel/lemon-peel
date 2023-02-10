import { reactive } from 'vue';
import { hasOwn } from '@lemon-peel/utils';
import { NODE_KEY, markNodeData } from './util';
import type TreeStore from './treeStore';

import type { Nullable } from '@lemon-peel/utils';
import type { FakeNode, LoadFunction, TreeKey, TreeNodeChildState, TreeNodeData, TreeNodeLoadedDefaultProps, TreeNodeOptions, TreeOptionProps } from '../tree';

export const getChildState = (node: Node[]): TreeNodeChildState => {
  let all = true;
  let none = true;
  let allWithoutDisable = true;
  for (let i = 0, j = node.length; i < j; i++) {
    const n = node[i];
    if (n.checked !== true || n.indeterminate) {
      all = false;
      if (!n.disabled) {
        allWithoutDisable = false;
      }
    }
    if (n.checked !== false || n.indeterminate) {
      none = false;
    }
  }

  return { all, none, allWithoutDisable, half: !all && !none };
};

const reInitChecked = function (node: Node): void {
  if (node.childNodes.length === 0 || node.loading) return;

  const { all, none, half } = getChildState(node.childNodes);
  if (all) {
    node.checked = true;
    node.indeterminate = false;
  } else if (half) {
    node.checked = false;
    node.indeterminate = true;
  } else if (none) {
    node.checked = false;
    node.indeterminate = false;
  }

  const parent = node.parent;
  if (!parent || parent.level === 0) return;

  if (!node.store.checkStrictly) {
    reInitChecked(parent);
  }
};

function getPropertyFromData(node: Node, prop: keyof TreeOptionProps): any {
  const props = node.store.props;
  const data = node.data || {};
  const config = props[prop];

  if (typeof config === 'function') {
    return config(data, node);
  } else if (typeof config === 'string') {
    return data[config];
  } else if (config === undefined) {
    const dataProp = data[prop];
    return dataProp === undefined ? '' : dataProp;
  }
}

let nodeIdSeed = 0;

class Node {
  id: number;

  text: string;

  checked: boolean;

  indeterminate: boolean;

  data: TreeNodeData;

  expanded: boolean;

  parent: Node | null;

  visible: boolean;

  isCurrent: boolean;

  store!: TreeStore;

  isLeafByUser!: boolean;

  isLeaf!: boolean;

  canFocus: boolean;

  level: number;

  loaded: boolean;

  childNodes: Node[];

  loading: boolean;

  constructor(options: TreeNodeOptions) {
    this.id = nodeIdSeed++;
    this.text = '';
    this.checked = false;
    this.indeterminate = false;
    this.data = {};
    this.expanded = false;
    this.parent = null;
    this.visible = true;
    this.isCurrent = false;
    this.canFocus = false;

    for (const name in options) {
      if (hasOwn(options, name)) {
        this[name] = options[name];
      }
    }

    // internal
    this.level = 0;
    this.loaded = false;
    this.childNodes = [];
    this.loading = false;

    if (this.parent) {
      this.level = (this.parent as Node).level + 1;
    }

    this.initialize();
  }

  initialize() {
    const store = this.store;
    if (!store) {
      throw new Error('[Node]store is required!');
    }
    store.registerNode(this);

    const props = store.props;
    if (props && props.isLeaf !== undefined) {
      const isLeaf = getPropertyFromData(this, 'isLeaf');
      if (typeof isLeaf === 'boolean') {
        this.isLeafByUser = isLeaf;
      }
    }

    if (store.lazy !== true && this.data) {
      this.setData(this.data);

      if (store.defaultExpandAll) {
        this.expanded = true;
        this.canFocus = true;
      }
    } else if (this.level > 0 && store.lazy && store.defaultExpandAll) {
      this.expand();
    }
    if (!Array.isArray(this.data)) {
      markNodeData(this, this.data);
    }
    if (!this.data) return;

    const defaultExpandedKeys = store.defaultExpandedKeys;
    const key = store.key;

    if (key && defaultExpandedKeys && defaultExpandedKeys.includes(this.key as any)) {
      this.expand(null, store.autoExpandParent);
    }

    if (
      key &&
      store.currentNodeKey !== undefined &&
      this.key === store.currentNodeKey
    ) {
      store.currentNode = this;
      store.currentNode.isCurrent = true;
    }

    if (store.lazy) {
      store._initDefaultCheckedNode(this);
    }

    this.updateLeafState();
    if (this.parent && (this.level === 1 || this.parent.expanded === true))
      this.canFocus = true;
  }

  setData(data: TreeNodeData): void {
    if (!Array.isArray(data)) markNodeData(this, data);

    this.data = data;
    this.childNodes = [];

    const children = this.level === 0 && Array.isArray(this.data)
      ? this.data
      : getPropertyFromData(this, 'children') || [];

    for (let i = 0, j = children.length; i < j; i++) {
      this.insertChild({ data: children[i] });
    }
  }

  get label(): string {
    return getPropertyFromData(this, 'label');
  }

  get key(): TreeKey {
    const nodeKey = this.store.key;
    return this.data[nodeKey];
  }

  get disabled(): boolean {
    return getPropertyFromData(this, 'disabled');
  }

  get nextSibling(): Nullable<Node> {
    const parent = this.parent;
    if (parent) {
      const index = parent.childNodes.indexOf(this);
      if (index > -1) {
        return parent.childNodes[index + 1];
      }
    }
    return null;
  }

  get previousSibling(): Nullable<Node> {
    const parent = this.parent;
    if (parent) {
      const index = parent.childNodes.indexOf(this);
      if (index > -1) {
        return index > 0 ? parent.childNodes[index - 1] : null;
      }
    }
    return null;
  }

  contains(target: Node, deep = true): boolean {
    return (this.childNodes || []).some(
      child => child === target || (deep && child.contains(target)),
    );
  }

  remove(): void {
    const parent = this.parent;
    if (parent) {
      this.remove();
    }
  }

  insertChild(child?: FakeNode | Node, index?: number, batch?: boolean): void {
    if (!child) throw new Error('InsertChild error: child is required.');

    if (!(child instanceof Node)) {
      if (!batch) {
        const children = this.getChildren(true)!;
        if (!children.includes(child.data)) {
          if (index === undefined || index < 0) {
            children.push(child.data);
          } else {
            children.splice(index, 0, child.data);
          }
        }
      }
      Object.assign(child, {
        parent: this,
        store: this.store,
      });
      child = reactive(new Node(child as TreeNodeOptions));
      if (child instanceof Node) {
        child.initialize();
      }
    }

    (child as Node).level = this.level + 1;

    if (index === undefined || index < 0) {
      this.childNodes.push(child as Node);
    } else {
      this.childNodes.splice(index, 0, child as Node);
    }

    this.updateLeafState();
  }

  insertBefore(child: FakeNode | Node, ref: Node): void {
    let index;
    if (ref) {
      index = this.childNodes.indexOf(ref);
    }
    this.insertChild(child, index);
  }

  insertAfter(child: FakeNode | Node, ref: Node): void {
    let index;
    if (ref) {
      index = this.childNodes.indexOf(ref);
      if (index !== -1) index += 1;
    }
    this.insertChild(child, index);
  }

  removeChild(child: Node): void {
    const children = this.getChildren() || [];
    const dataIndex = children.indexOf(child.data);
    if (dataIndex > -1) {
      children.splice(dataIndex, 1);
    }

    const index = this.childNodes.indexOf(child);

    if (index > -1) {
      this.store && this.store.deregisterNode(child);
      child.parent = null;
      this.childNodes.splice(index, 1);
    }

    this.updateLeafState();
  }

  removeChildByData(data: TreeNodeData): void {
    let targetNode: Node | null = null;

    for (let i = 0; i < this.childNodes.length; i++) {
      if (this.childNodes[i].data === data) {
        targetNode = this.childNodes[i];
        break;
      }
    }

    if (targetNode) {
      targetNode.remove();
    }
  }

  expand(callback?: (() => void) | null, expandParent?: boolean): void {
    const done = (): void => {
      if (expandParent) {
        let parent = this.parent;
        while (parent && parent.level > 0) {
          parent.expanded = true;
          parent = parent.parent;
        }
      }
      this.expanded = true;
      if (callback) callback();
      for (const item of this.childNodes) {
        item.canFocus = true;
      }
    };

    if (this.shouldLoadData()) {
      this.loadData(data => {
        if (Array.isArray(data)) {
          if (this.checked) {
            this.setChecked(true, true);
          } else if (!this.store.checkStrictly) {
            reInitChecked(this);
          }
          done();
        }
      });
    } else {
      done();
    }
  }

  doCreateChildren(
    array: TreeNodeData[],
    defaultProps: TreeNodeLoadedDefaultProps = {},
  ): void {
    for (const item of array) {
      this.insertChild(
        Object.assign({ data: item }, defaultProps),
        undefined,
        true,
      );
    }
  }

  collapse(): void {
    this.expanded = false;
    for (const item of this.childNodes) {
      item.canFocus = false;
    }
  }

  shouldLoadData(): boolean {
    return this.store.lazy === true && !!(this.store.load) && !this.loaded;
  }

  updateLeafState(): void {
    if (
      this.store.lazy === true &&
      this.loaded !== true &&
      this.isLeafByUser !== undefined
    ) {
      this.isLeaf = this.isLeafByUser;
      return;
    }
    const childNodes = this.childNodes;
    if (
      !this.store.lazy ||
      (this.store.lazy === true && this.loaded === true)
    ) {
      this.isLeaf = !childNodes || childNodes.length === 0;
      return;
    }
    this.isLeaf = false;
  }

  setChecked(
    value?: boolean | string,
    deep?: boolean,
    recursion?: boolean,
    passValue?: boolean,
  ) {
    this.indeterminate = value === 'half';
    this.checked = value === true;

    if (this.store.checkStrictly) return;

    if (!(this.shouldLoadData() && !this.store.checkDescendants)) {
      const { all, allWithoutDisable } = getChildState(this.childNodes);

      if (!this.isLeaf && !all && allWithoutDisable) {
        this.checked = false;
        value = false;
      }

      const handleDescendants = (): void => {
        if (deep) {
          const childNodes = this.childNodes;
          for (let i = 0, j = childNodes.length; i < j; i++) {
            const child = childNodes[i];
            passValue = passValue || value !== false;
            const isCheck = child.disabled ? child.checked : passValue;
            child.setChecked(isCheck, deep, true, passValue);
          }
          const { half, all } = getChildState(childNodes);
          if (!all) {
            this.checked = all;
            this.indeterminate = half;
          }
        }
      };

      if (this.shouldLoadData()) {
        // Only work on lazy load data.
        this.loadData(
          () => {
            handleDescendants();
            reInitChecked(this);
          },
          {
            checked: value !== false,
          },
        );
        return;
      } else {
        handleDescendants();
      }
    }

    const parent = this.parent;
    if (!parent || parent.level === 0) return;

    if (!recursion) {
      reInitChecked(parent);
    }
  }

  getChildren(forceInit = false): (TreeNodeData | TreeNodeData[]) | null {
    // this is data
    if (this.level === 0) return this.data;
    const data = this.data;
    if (!data) return null;

    const props = this.store.props;
    let children = 'children';
    if (props) {
      children = props.children || 'children';
    }

    if (data[children] === undefined) {
      data[children] = null;
    }

    if (forceInit && !data[children]) {
      data[children] = [];
    }

    return data[children];
  }

  updateChildren(): void {
    const newData = (this.getChildren() || []) as TreeNodeData[];
    const oldData = this.childNodes.map(node => node.data);

    const newDataMap: Record<string, any> = {};
    const newNodes = [];

    for (const [index, item] of newData.entries()) {
      const key = item[NODE_KEY];
      const isNodeExists =
        !!key && oldData.findIndex(data => data[NODE_KEY] === key) >= 0;
      if (isNodeExists) {
        newDataMap[key] = { index, data: item };
      } else {
        newNodes.push({ index, data: item });
      }
    }

    if (!this.store.lazy) {
      for (const item of oldData) {
        if (!newDataMap[item[NODE_KEY]]) this.removeChildByData(item);
      }
    }

    for (const { index, data } of newNodes) {
      this.insertChild({ data }, index);
    }

    this.updateLeafState();
  }

  loadData(
    callback: (node?: TreeNodeData) => void,
    defaultProps: TreeNodeLoadedDefaultProps = {},
  ) {
    if (
      this.store.lazy === true &&
      this.store.load &&
      !this.loaded &&
      (!this.loading || Object.keys(defaultProps).length > 0)
    ) {
      this.loading = true;

      const resolve: Parameters<LoadFunction>[1] = children => {
        this.childNodes = [];

        this.doCreateChildren(children, defaultProps);
        this.loaded = true;
        this.loading = false;

        this.updateLeafState();
        if (callback) {
          callback.call(this, children);
        }
      };

      this.store.load(this, resolve);
    } else {
      if (callback) {
        callback.call(this);
      }
    }
  }
}

export default Node;
