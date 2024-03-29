import { getCurrentInstance, nextTick, ref, watch } from 'vue';
import { NODE_CHECK, NODE_CHECK_CHANGE, SetOperationEnum } from '../virtualTree';
import type { CheckboxValueType } from '@lemon-peel/components/checkbox';
import type { Ref } from 'vue';
import type { Tree, TreeKey, TreeNode, TreeNodeData, TreeProps } from '../types';

export function useCheck(props: TreeProps, tree: Ref<Tree | undefined>) {
  const checkedKeys = ref<Set<TreeKey>>(new Set());
  const indeterminateKeys = ref<Set<TreeKey>>(new Set());
  const { emit } = getCurrentInstance()!;

  const isChecked = (node: TreeNode) => checkedKeys.value.has(node.key);

  const updateCheckedKeys = () => {
    if (!tree.value || !props.showCheckbox || props.checkStrictly) {
      return;
    }
    const { levelTreeNodeMap, maxLevel } = tree.value;
    const checkedKeySet = checkedKeys.value;
    const indeterminateKeySet = new Set<TreeKey>();
    // It is easier to determine the indeterminate state by
    // traversing from bottom to top
    // leaf nodes not have indeterminate status and can be skipped
    for (let level = maxLevel - 1; level >= 1; --level) {
      const nodes = levelTreeNodeMap.get(level);
      if (!nodes) continue;
      for (const node of nodes) {
        const children = node.children;
        if (children) {
          // Whether all child nodes are selected
          let allChecked = true;
          // Whether a child node is selected
          let hasChecked = false;
          for (const childNode of children) {
            const key = childNode.key;
            if (checkedKeySet.has(key)) {
              hasChecked = true;
            } else if (indeterminateKeySet.has(key)) {
              allChecked = false;
              hasChecked = true;
              break;
            } else {
              allChecked = false;
            }
          }
          if (allChecked) {
            checkedKeySet.add(node.key);
          } else if (hasChecked) {
            indeterminateKeySet.add(node.key);
            checkedKeySet.delete(node.key);
          } else {
            checkedKeySet.delete(node.key);
            indeterminateKeySet.delete(node.key);
          }
        }
      }
    }
    indeterminateKeys.value = indeterminateKeySet;
  };

  function getChecked(leafOnly = false): {
    checkedKeys: TreeKey[];
    checkedNodes: TreeNodeData[];
  } {
    const checkedNodes: TreeNodeData[] = [];
    const keys: TreeKey[] = [];
    if (tree?.value && props.showCheckbox) {
      const { treeNodeMap } = tree.value;
      for (const key of checkedKeys.value) {
        const node = treeNodeMap.get(key);
        if (node && (!leafOnly || (leafOnly && node.isLeaf))) {
          keys.push(key);
          checkedNodes.push(node.data);
        }
      }
    }
    return {
      checkedKeys: keys,
      checkedNodes,
    };
  }

  function getHalfChecked(): {
    halfCheckedKeys: TreeKey[];
    halfCheckedNodes: TreeNodeData[];
  } {
    const halfCheckedNodes: TreeNodeData[] = [];
    const halfCheckedKeys: TreeKey[] = [];
    if (tree?.value && props.showCheckbox) {
      const { treeNodeMap } = tree.value;
      for (const key of indeterminateKeys.value) {
        const node = treeNodeMap.get(key);
        if (node) {
          halfCheckedKeys.push(key);
          halfCheckedNodes.push(node.data);
        }
      }
    }
    return {
      halfCheckedNodes,
      halfCheckedKeys,
    };
  }

  const afterNodeCheck = (node: TreeNode, checked: CheckboxValueType) => {
    const { checkedNodes, checkedKeys } = getChecked();
    const { halfCheckedNodes, halfCheckedKeys } = getHalfChecked();
    emit(NODE_CHECK, node.data, {
      checkedKeys,
      checkedNodes,
      halfCheckedKeys,
      halfCheckedNodes,
    });
    emit(NODE_CHECK_CHANGE, node.data, checked);
  };

  const toggleCheckbox = (
    node: TreeNode,
    isChecked: CheckboxValueType,
    nodeClick = true,
  ) => {
    const checkedKeySet = checkedKeys.value;
    const toggle = (node: TreeNode, checked: CheckboxValueType) => {
      checkedKeySet[checked ? SetOperationEnum.ADD : SetOperationEnum.DELETE](
        node.key,
      );
      const children = node.children;
      if (!props.checkStrictly && children) {
        for (const childNode of children) {
          if (!childNode.disabled) {
            toggle(childNode, checked);
          }
        }
      }
    };
    toggle(node, isChecked);
    updateCheckedKeys();
    if (nodeClick) {
      afterNodeCheck(node, isChecked);
    }
  };

  function applyCheckedKeys(keys: TreeKey[]) {
    if (tree?.value) {
      const { treeNodeMap } = tree.value;
      if (props.showCheckbox && treeNodeMap && keys) {
        for (const key of keys) {
          const node = treeNodeMap.get(key);
          if (node && !isChecked(node)) {
            toggleCheckbox(node, true, false);
          }
        }
      }
    }
  }

  watch(
    [() => tree.value, () => props.defaultCheckedKeys],
    () => {
      return nextTick(() => {
        applyCheckedKeys(props.defaultCheckedKeys);
      });
    },
    {
      immediate: true,
    },
  );

  const isIndeterminate = (node: TreeNode) =>
    indeterminateKeys.value.has(node.key);

  // expose
  function getCheckedKeys(leafOnly = false): TreeKey[] {
    return getChecked(leafOnly).checkedKeys;
  }

  function getCheckedNodes(leafOnly = false): TreeNodeData[] {
    return getChecked(leafOnly).checkedNodes;
  }

  function getHalfCheckedKeys(): TreeKey[] {
    return getHalfChecked().halfCheckedKeys;
  }

  function getHalfCheckedNodes(): TreeNodeData[] {
    return getHalfChecked().halfCheckedNodes;
  }

  function setCheckedKeys(keys: TreeKey[]) {
    checkedKeys.value.clear();
    indeterminateKeys.value.clear();
    applyCheckedKeys(keys);
  }

  function setChecked(key: TreeKey, isChecked: boolean) {
    if (tree?.value && props.showCheckbox) {
      const node = tree.value.treeNodeMap.get(key);
      if (node) {
        toggleCheckbox(node, isChecked, false);
      }
    }
  }

  return {
    updateCheckedKeys,
    toggleCheckbox,
    isChecked,
    isIndeterminate,
    // expose
    getCheckedKeys,
    getCheckedNodes,
    getHalfCheckedKeys,
    getHalfCheckedNodes,
    setChecked,
    setCheckedKeys,
  };
}
