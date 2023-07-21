import { callAsAsync, isObject } from '@lemon-peel/utils';
import { getNodeKey } from './util';
import Node from './node';

import type { FilterValue, TreeData, TreeEmit, TreeKey, TreeNodeData, TreeProps } from '../tree';


export default class TreeStore {

  currentNode: Node | null = null;

  nodesMap = new Map<TreeKey, Node>();

  root: Node;

  treeProps: TreeProps;

  treeEmit: TreeEmit;

  defaultCheckedKeys: any[] = [];

  defaultExpandedKeys: any[] = [];

  constructor(treeProps: TreeProps, treeEmit: TreeEmit) {
    this.treeProps = treeProps;
    this.treeEmit = treeEmit;
    this.currentNode = null;

    this.defaultCheckedKeys = treeProps.defaultCheckedKeys || [];

    this.root = new Node({
      data: treeProps.data,
      store: this,
    });

    if (treeProps.lazy && treeProps.load) {
      callAsAsync(treeProps.load, this.root)
        .then(data => {
          this.root.doCreateChildren(data);
          this.initDefaultCheckedNodes();
        });
    } else {
      this.initDefaultCheckedNodes();
    }
  }

  filter(value: FilterValue) {
    const { filterNodeMethod, lazy } = this.treeProps;
    const traverse = function (node: Node) {
      const childNodes = node.childNodes;

      for (const child of childNodes) {
        child.visible = filterNodeMethod!.call(child, value, child.data, child);

        traverse(child);
      }

      if (!(node as Node).visible && childNodes.length > 0) {
        let allHidden = true;
        allHidden = !childNodes.some(child => child.visible);

        (node as Node).visible = allHidden === false;
      }

      if (!value) return;

      if ((node as Node).visible && !(node as Node).isLeaf && !lazy)
        (node as Node).expand();
    };

    traverse(this.root);
  }

  onDataChange(newVal: TreeData) {
    const instanceChanged = newVal !== this.root.data;
    if (instanceChanged) {
      this.root.setData(newVal);
      this.initDefaultCheckedNodes();
    } else {
      this.root.updateChildren();
    }
  }

  getNode(data: TreeKey | TreeNodeData): Node | undefined {
    if (data instanceof Node) return data;
    let key: any = isObject(data) ? getNodeKey(this.treeProps.nodeKey, data) : data;
    if (typeof this.nodesMap.keys().next().value === 'number') {
      key = Number.parseInt(key, 10);
    }
    return this.nodesMap.get(key);
  }

  insertBefore(data: TreeNodeData, refData: TreeKey | TreeNodeData) {
    const refNode = this.getNode(refData);
    refNode?.parent?.insertBefore({ data }, refNode);
  }

  insertAfter(data: TreeNodeData, refData: TreeKey | TreeNodeData) {
    const refNode = this.getNode(refData);
    refNode?.parent?.insertAfter({ data }, refNode);
  }

  remove(data: TreeKey | TreeNodeData) {
    const node = this.getNode(data);

    if (node && node.parent) {
      if (node === this.currentNode) {
        this.currentNode = null;
      }
      node.remove();
    }
  }

  append(data: TreeNodeData, parentData: TreeNodeData | TreeKey | Node) {
    const parentNode = parentData ? this.getNode(parentData) : this.root;

    if (parentNode) {
      parentNode.insertChild({ data });
    }
  }

  initDefaultCheckedNodes() {
    const { nodesMap, treeProps: { defaultCheckedKeys, checkStrictly } } = this;

    for (const checkedKey of defaultCheckedKeys) {
      nodesMap.get(checkedKey)?.setChecked(true, !checkStrictly);
    }
  }

  initDefaultCheckedNode(node: Node) {
    const { defaultCheckedKeys, checkStrictly } = this.treeProps;

    if (defaultCheckedKeys.includes(node.key)) {
      node.setChecked(true, !checkStrictly);
    }
  }

  setDefaultCheckedKeys(keys: TreeKey[]) {
    if (keys !== this.treeProps.defaultCheckedKeys) {
      this.defaultCheckedKeys = keys;
      this.initDefaultCheckedNodes();
    }
  }

  registerNode(node: Node) {
    const key = this.treeProps.nodeKey;
    if (!node || !node.data) return;

    if (key) {
      const nodeKey = node.key;
      if (nodeKey !== undefined) this.nodesMap.set(node.key, node);
    } else {
      this.nodesMap.set(node.id, node);
    }
  }

  deregisterNode(node: Node) {
    const key = this.treeProps.nodeKey;
    if (!key || !node || !node.data) return;

    for (const child of node.childNodes) {
      this.deregisterNode(child);
    }

    this.nodesMap.delete(node.key);
  }

  getCheckedNodes(
    leafOnly = false,
    includeHalfChecked = false,
  ): TreeNodeData[] {
    const checkedNodes: TreeNodeData[] = [];

    const traverse = function (node: Node) {
      const childNodes = node.childNodes;

      for (const child of childNodes) {
        if (
          (child.checked || (includeHalfChecked && child.indeterminate))
          && (!leafOnly || (leafOnly && child.isLeaf))
        ) {
          checkedNodes.push(child.data);
        }

        traverse(child);
      }
    };

    traverse(this.root);

    return checkedNodes;
  }

  getCheckedKeys(leafOnly = false): TreeKey[] {
    return this.getCheckedNodes(leafOnly).map(data => (data || {})[this.treeProps.nodeKey]);
  }

  getHalfCheckedNodes(): TreeNodeData[] {
    const nodes: TreeNodeData[] = [];
    const traverse = function (node: TreeStore | Node) {
      const childNodes = (node as TreeStore).root
        ? (node as TreeStore).root.childNodes
        : (node as Node).childNodes;

      for (const child of childNodes) {
        if (child.indeterminate) {
          nodes.push(child.data);
        }

        traverse(child);
      }
    };

    traverse(this);

    return nodes;
  }

  getHalfCheckedKeys(): TreeKey[] {
    return this.getHalfCheckedNodes().map(data => (data || {})[this.treeProps.nodeKey]);
  }

  _getAllNodes(): Node[] {
    return this.nodesMap ? Array.from(this.nodesMap.values()) : [];
  }

  updateChildren(key: TreeKey, data: TreeData) {
    const node = this.nodesMap.get(key);
    if (!node) return;
    const childNodes = node.childNodes;
    for (let i = childNodes.length - 1; i >= 0; i--) {
      const child = childNodes[i];
      this.remove(child.data);
    }
    for (let i = 0, j = data.length; i < j; i++) {
      const child = data[i];
      this.append(child, node.data);
    }
  }

  _setCheckedKeys(
    key: TreeKey,
    leafOnly: boolean,
    checkedKeys: { [key: string]: boolean },
  ) {
    const allNodes = this._getAllNodes().sort((a, b) => b.level - a.level);
    const cache = Object.create(null);
    const keys = Object.keys(checkedKeys);

    for (const node of allNodes)
      node.setChecked(false, false);

    for (let i = 0, j = allNodes.length; i < j; i++) {
      const node = allNodes[i];
      const nodeKey = node.data[key].toString();
      const checked = keys.includes(nodeKey);

      if (!checked) {
        if (node.checked && !cache[nodeKey]) {
          node.setChecked(false, false);
        }
        continue;
      }

      let parent = node.parent;
      while (parent && parent.level > 0) {
        cache[parent.data[key]] = true;
        parent = parent.parent;
      }

      if (node.isLeaf || this.treeProps.checkStrictly) {
        node.setChecked(true, false);
        continue;
      }

      node.setChecked(true, true);

      if (leafOnly) {
        node.setChecked(false, false);
        const traverse = function (node: Node) {
          const childNodes = node.childNodes;
          for (const child of childNodes) {
            if (!child.isLeaf) {
              child.setChecked(false, false);
            }
            traverse(child);
          }
        };
        traverse(node);
      }
    }
  }

  setCheckedNodes(nodes: TreeNodeData[], leafOnly = false) {
    const key = this.treeProps.nodeKey;
    const checkedKeys: Record<string, boolean> = {};
    for (const item of nodes) {
      checkedKeys[(item || {})[key]] = true;
    }

    this._setCheckedKeys(key, leafOnly, checkedKeys);
  }

  setCheckedKeys(keys: TreeKey[], leafOnly = false) {
    this.defaultCheckedKeys = keys;
    const key = this.treeProps.nodeKey;
    const checkedKeys: Record<string, boolean> = {};
    for (const key of keys) {
      checkedKeys[key] = true;
    }

    this._setCheckedKeys(key, leafOnly, checkedKeys);
  }

  setDefaultExpandedKeys(keys: TreeKey[]) {
    keys = keys || [];
    this.defaultExpandedKeys = keys;
    for (const key of keys) {
      const node = this.getNode(key);
      if (node) node.expand(null, this.treeProps.autoExpandParent);
    }
  }

  setChecked(
    data: TreeKey | TreeNodeData,
    checked: boolean,
    deep: boolean,
  ) {
    const node = this.getNode(data);

    if (node) {
      node.setChecked(!!checked, deep);
    }
  }

  getCurrentNode(): Node {
    return this.currentNode!;
  }

  setCurrentNode(currentNode: Node) {
    const prevCurrentNode = this.currentNode;
    if (prevCurrentNode) {
      prevCurrentNode.isCurrent = false;
    }
    this.currentNode = currentNode;
    this.currentNode.isCurrent = true;
  }

  setUserCurrentNode(data: TreeNodeData, shouldAutoExpandParent = true) {
    const key = data[this.treeProps.nodeKey];
    const currNode = this.nodesMap.get(key)!;
    this.setCurrentNode(currNode);
    if (shouldAutoExpandParent && this.currentNode!.level > 1) {
      this.currentNode!.parent?.expand(null, true);
    }
  }

  setCurrentNodeKey(key?: TreeKey, shouldAutoExpandParent = true) {
    if (key === null || key === undefined) {
      this.currentNode && (this.currentNode.isCurrent = false);
      this.currentNode = null;
      return;
    }

    const node = this.getNode(key);
    if (node) {
      this.setCurrentNode(node);
      if (shouldAutoExpandParent && this.currentNode!.level > 1) {
        this.currentNode!.parent?.expand(null, true);
      }
    }
  }
}
