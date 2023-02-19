import { computed, ref } from 'vue';
import { lazyProxy } from '@lemon-peel/utils';
import { memoize } from 'lodash-es';

import { getRowIdentity } from '../util';
import { useWatcher } from './watcher';

import type { Ref } from 'vue';
import type { DefaultRow, TableProps, TableVM } from '../table/defaults';

export const useCurrent = memoize((table: TableVM) => {
  const watcher = lazyProxy(() => useWatcher(table));

  const tableProps = table.props as TableProps;
  const tableData = computed(() => tableProps.data);
  const rowKey = computed(() => tableProps.rowKey);
  const currentRowKey = ref<string | null>(null);
  const currentRow: Ref<DefaultRow | null> = ref(null);

  const setCurrentRowByKey = (key: string) => {
    let curRow = null;
    if (rowKey.value) {
      curRow = (tableData.value || []).find(
        item => getRowIdentity(item, rowKey.value!) === key,
      )!;
    }
    currentRow.value = curRow;
    table.emit('current-change', currentRow.value, null);
  };

  const setCurrentRowKey = (key: string) => {
    watcher.assertRowKey();
    currentRowKey.value = key;
    setCurrentRowByKey(key);
  };

  const restoreCurrentRowKey = () => {
    currentRowKey.value = null;
  };

  const updateCurrentRow = (row: DefaultRow) => {
    const oldCurrentRow = currentRow.value;

    if (row && row !== oldCurrentRow) {
      currentRow.value = row;
      table.emit('current-change', currentRow.value, oldCurrentRow);
    } else if (!row && oldCurrentRow) {
      currentRow.value = null;
      table.emit('current-change', null, oldCurrentRow);
    }
  };

  const updateCurrentRowData = () => {
    // data 为 null 时，解构时的默认值会被忽略
    const data = tableData.value || [];
    const oldRow = currentRow.value;
    // 当 currentRow 不在 data 中时尝试更新数据
    if (oldRow && !data.includes(oldRow)) {
      if (rowKey.value) {
        const currentRowKey = getRowIdentity(oldRow, rowKey.value!);
        setCurrentRowByKey(currentRowKey);
      } else {
        currentRow.value = null;
      }

      if (currentRow.value === null) {
        table.emit('current-change', null, oldRow);
      }
    } else if (currentRowKey.value) {
      // 把初始时下设置的 rowKey 转化成 rowData
      setCurrentRowByKey(currentRowKey.value);
      restoreCurrentRowKey();
    }
  };

  return {
    setCurrentRowKey,
    restoreCurrentRowKey,
    setCurrentRowByKey,
    updateCurrentRow,
    updateCurrentRowData,
    states: {
      currentRowKey,
      currentRow,
    },
  };
});

export default useCurrent;
