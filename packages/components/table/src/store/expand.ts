import { lazyProxy } from '@lemon-peel/utils';
import { memoize } from 'lodash';
import { computed, ref } from 'vue';
import { getKeysMap, getRowIdentity, toggleRowStatus } from '../util';
import { useWatcher } from './watcher';

import type { Ref } from 'vue';
import type { DefaultRow } from './../table/defaults';
import type { TableProps, TableVM } from '../table/defaults';

function createExpand(table: TableVM) {
  const watcher = lazyProxy(() => useWatcher(table));

  const tableProps = table.props as TableProps;
  const tableData = computed(() => tableProps.data);
  const rowKey = computed(() => tableProps.rowKey);

  const defaultExpandAll = computed(() => tableProps.defaultExpandAll);
  const expandRows: Ref<DefaultRow[]> = ref([]);

  const updateExpandRows = () => {
    const data = tableData.value || [];
    if (defaultExpandAll.value) {
      expandRows.value = data.slice();
    } else if (rowKey.value) {
      // TODO：这里的代码可以优化
      const expandRowsMap = getKeysMap(expandRows.value, rowKey.value!);
      expandRows.value = data.reduce((prev: DefaultRow[], row: DefaultRow) => {
        const rowId = getRowIdentity(row, rowKey.value!);
        const rowInfo = expandRowsMap[rowId];
        if (rowInfo) {
          prev.push(row);
        }
        return prev;
      }, []);
    } else {
      expandRows.value = [];
    }
  };

  const toggleRowExpansion = (row: DefaultRow, expanded?: boolean) => {
    const changed = toggleRowStatus(expandRows.value, row, !!expanded);
    if (changed) {
      table.emit('expand-change', row, expandRows.value.slice());
    }
  };

  const setExpandRowKeys = (rowKeys: string[]) => {
    watcher.assertRowKey();
    const data = tableData.value || [];
    const keysMap = getKeysMap(data, rowKey.value!);
    expandRows.value = rowKeys.reduce((prev, cur: string) => {
      const info = keysMap[cur];
      if (info) {
        prev.push(info.row);
      }
      return prev;
    }, [] as DefaultRow[]);
  };

  const isRowExpanded = (row: DefaultRow): boolean => {
    const val = rowKey.value;
    if (val) {
      const expandMap = getKeysMap(expandRows.value, val);
      return !!expandMap[getRowIdentity(row, val)];
    }
    return expandRows.value.includes(row);
  };

  return {
    updateExpandRows,
    toggleRowExpansion,
    setExpandRowKeys,
    isRowExpanded,

    states: {
      expandRows,
      defaultExpandAll,
    },
  };
}

export const useExpand = memoize(createExpand);

export type Expand = ReturnType<typeof useExpand>;

export default useExpand;
