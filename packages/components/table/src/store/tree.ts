import { lazyProxy } from '@lemon-peel/utils';

import { computed, ref, unref, watch } from 'vue';
import { memoize } from 'lodash-es';

import { getRowIdentity, walkTreeNode } from '../util';
import { useExpand } from './expand';
import { useWatcher } from './watcher';

import type { DefaultRow } from './../table/defaults';
import type { TableVM, TableProps, TreeNode } from '../table/defaults';

export type TreeNodeMap = Record<string, TreeNode>;

export const useTree = memoize((table: TableVM) => {
  const watcher = lazyProxy(() => useWatcher(table));
  const expand = lazyProxy(() => useExpand(table));


  const tableProps = table.props as TableProps;
  const tableData = computed(() => tableProps.data);
  const rowKey = computed(() => tableProps.rowKey);
  const lazyColumnIdentifier = computed(() => tableProps.treeProps?.hasChildren || 'hasChildren');
  const childrenColumnName = computed(() => tableProps.treeProps?.children || 'children');

  const expandRowKeys = ref<string[]>([]);
  const indent = computed(() => tableProps.indent || 16);
  const lazy = computed(() => tableProps.lazy || false);
  const treeData = ref<TreeNodeMap>({});
  const lazyTreeNodeMap = ref<Record<string, DefaultRow[]>>({});

  const normalize = (data: TableProps['data']) => {
    const res: TreeNodeMap = {};
    walkTreeNode(
      data,
      (parent, children, level) => {
        const parentId = getRowIdentity(parent, rowKey.value!);
        if (Array.isArray(children)) {
          res[parentId] = {
            children: children.map(row => getRowIdentity(row, rowKey.value!)),
            level: level!,
          };
        } else if (lazy.value) {
          // 当 children 不存在且 lazy 为 true，该节点即为懒加载的节点
          res[parentId] = {
            children: [],
            lazy: true,
            level: level!,
          };
        }
      },
      childrenColumnName.value,
      lazyColumnIdentifier.value,
    );
    return res;
  };

  const normalizedData = computed(() => {
    return rowKey.value
      ? normalize(tableData.value || [])
      : {};
  });

  const normalizedLazyNode = computed(() => {
    const keys = Object.keys(lazyTreeNodeMap.value);
    const res: TreeNodeMap = {};
    if (keys.length === 0) return res;
    keys.forEach(key => {
      if (lazyTreeNodeMap.value[key].length) return;

      const item: TreeNode = { children: [] as string[] };

      lazyTreeNodeMap.value[key].forEach(row => {
        const currentRowKey = getRowIdentity(row, rowKey.value!);
        item.children.push(currentRowKey);
        if (row[lazyColumnIdentifier.value] && !res[currentRowKey]) {
          res[currentRowKey] = { children: [] };
        }
      });

      res[key] = item;
    });
    return res;
  });

  const updateTreeData = (
    ifChangeExpandRowKeys = false,
    ifExpandAll = expand.states.defaultExpandAll.value,
  ) => {
    const nested = normalizedData.value;
    const lazyNode = normalizedLazyNode.value;
    const keys = Object.keys(nested);
    const newTreeData: TreeNodeMap = {};
    if (!keys.length) {
      treeData.value = newTreeData;
      table.updateTableScrollY();
      return;
    }

    const oldTreeData = unref(treeData);
    const rootLazyRowKeys = [] as string[];

    const getExpanded = (oldVal: TreeNode, key: string) => {
      if (ifChangeExpandRowKeys) {
        return expandRowKeys.value ? ifExpandAll || expandRowKeys.value.includes(key) : !!(ifExpandAll || oldVal?.expanded);
      } else {
        const included =
            ifExpandAll ||
            (expandRowKeys.value && expandRowKeys.value.includes(key));
        return !!(oldVal?.expanded || included);
      }
    };

    // 合并 expanded 与 display，确保数据刷新后，状态不变
    keys.forEach(key => {
      const oldValue = oldTreeData[key];
      const newValue = { ...nested[key] };
      newValue.expanded = getExpanded(oldValue, key);
      if (newValue.lazy) {
        const { loaded = false, loading = false } = oldValue || {};
        newValue.loaded = !!loaded;
        newValue.loading = !!loading;
        rootLazyRowKeys.push(key);
      }
      newTreeData[key] = newValue;
    });

    // 根据懒加载数据更新 treeData
    const lazyKeys = Object.keys(lazyNode);
    if (lazy.value && lazyKeys.length > 0 && rootLazyRowKeys.length > 0) {
      lazyKeys.forEach(key => {
        const oldValue = oldTreeData[key];
        const lazyNodeChildren = lazyNode[key].children;
        if (rootLazyRowKeys.includes(key)) {
          // 懒加载的 root 节点，更新一下原有的数据，原来的 children 一定是空数组
          if (newTreeData[key].children.length > 0) {
            throw new Error('[LpTable]children must be an empty array.');
          }
          newTreeData[key].children = lazyNodeChildren;
        } else {
          const { loaded = false, loading = false } = oldValue || {};
          newTreeData[key] = {
            lazy: true,
            loaded: !!loaded,
            loading: !!loading,
            expanded: getExpanded(oldValue, key),
            children: lazyNodeChildren,
            level: 0,
          };
        }
      });
    }

    treeData.value = newTreeData;
    table.updateTableScrollY();
  };

  watch(
    () => expandRowKeys.value,
    () => {
      updateTreeData(true);
    },
  );

  watch(
    () => normalizedData.value,
    () => {
      updateTreeData();
    },
  );
  watch(
    () => normalizedLazyNode.value,
    () => {
      updateTreeData();
    },
  );

  const updateTreeExpandKeys = (value: string[]) => {
    expandRowKeys.value = value;
    updateTreeData();
  };

  const toggleTreeExpansion = (row: DefaultRow, expanded?: boolean) => {
    watcher.assertRowKey();

    const id = getRowIdentity(row, rowKey.value!);
    const data = id && treeData.value[id];

    if (id && data && 'expanded' in data) {
      const oldExpanded = data.expanded;
      expanded = expanded === undefined ? !data.expanded : expanded;
      treeData.value[id].expanded = expanded;
      if (oldExpanded !== expanded) {
        table.emit('expand-change', row, expanded);
      }
      table.updateTableScrollY();
    }
  };

  const loadData = (row: DefaultRow, key: string, data: DefaultRow[]) => {
    const { load } = tableProps;
    if (load && !treeData.value[key].loaded) {
      treeData.value[key].loading = true;
      load(row, data, data => {
        if (!Array.isArray(data)) {
          throw new TypeError('[LpTable] data must be an array');
        }

        treeData.value[key].loading = false;
        treeData.value[key].loaded = true;
        treeData.value[key].expanded = true;
        if (data.length > 0) {
          lazyTreeNodeMap.value[key] = data;
        }

        table.emit('expand-change', row, true);
      });
    }
  };

  const loadOrToggle = (row: DefaultRow) => {
    watcher.assertRowKey();
    const id = getRowIdentity(row, rowKey.value!);
    const data = treeData.value[id];
    if (lazy.value && data && 'loaded' in data && !data.loaded) {
      loadData(row, id, tableData.value);
    } else {
      toggleTreeExpansion(row);
    }
  };

  return {
    loadData,
    loadOrToggle,
    toggleTreeExpansion,
    updateTreeExpandKeys,
    updateTreeData,
    normalize,
    states: {
      expandRowKeys,
      treeData,
      indent,
      lazy,
      lazyTreeNodeMap,
      lazyColumnIdentifier,
      childrenColumnName,
    },
  };
});
