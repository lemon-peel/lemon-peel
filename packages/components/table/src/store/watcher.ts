import { computed, ref, unref, watch, watchEffect } from 'vue';
import { memoize, debounce } from 'lodash';
import { lazyProxy } from '@lemon-peel/utils';
import { hasOwn } from '@lemon-peel/utils';

import { getColumnById, getColumnByKey, getKeysMap, getRowIdentity, orderBy, toggleRowStatus } from '../util';
import { useExpand } from './expand';
import { useTree } from './tree';
import { useActions } from './actions';

import type { Ref } from 'vue';
import type { TableColumnCtx } from '../tableColumn/defaults';
import type { DefaultRow, TableProps, TableVM } from '../table/defaults';
import type { TableRefs } from '../table/defaults';
import type { StoreFilter } from './index';

const sortData = (data: DefaultRow[], states: {
  sortProp: string;
  sortOrder: string | number;
  sortingColumn?: TableColumnCtx;
}) => {
  const sortingColumn = states.sortingColumn;
  if (!sortingColumn || typeof sortingColumn.sortable === 'string') {
    return data;
  }
  return orderBy(
    data,
    states.sortProp,
    states.sortOrder,
    sortingColumn.sortMethod,
    sortingColumn.sortBy,
  );
};

const doFlattenColumns = (columns: TableColumnCtx[]) => {
  const result: TableColumnCtx[] = [];
  columns.forEach(column => {
    if (column.children) {
      // eslint-disable-next-line prefer-spread
      result.push.apply(result, doFlattenColumns(column.children));
    } else {
      result.push(column);
    }
  });
  return result;
};

export const useWatcher = memoize((table: TableVM) => {
  const actions = lazyProxy(() => useActions(table));
  const expand = lazyProxy(() => useExpand(table));
  const tree = lazyProxy(() => useTree(table));
  const tableProps = table.props as TableProps;
  const tableSize = computed(() => tableProps.size);
  const rowKey = computed(() => tableProps.rowKey);

  const data = ref<TableProps['data']>([]);
  watchEffect(() => { data.value = tableProps.data; });

  const dataTmp: Ref<DefaultRow[]> = ref([]);
  const isComplex = ref(false);
  const originalColumns: Ref<TableColumnCtx[]> = ref([]);
  const originColumns: Ref<TableColumnCtx[]> = ref([]);
  const columns: Ref<TableColumnCtx[]> = ref([]);
  const fixedColumns: Ref<TableColumnCtx[]> = ref([]);
  const rightFixedColumns: Ref<TableColumnCtx[]> = ref([]);
  const leafColumns: Ref<TableColumnCtx[]> = ref([]);
  const fixedLeafColumns: Ref<TableColumnCtx[]> = ref([]);
  const rightFixedLeafColumns: Ref<TableColumnCtx[]> = ref([]);
  const leafColumnsLength: Ref<number> = ref(0);
  const fixedLeafColumnsLength = ref(0);
  const rightFixedLeafColumnsLength = ref(0);
  const isAllSelected = ref(false);
  const selection: Ref<DefaultRow[]> = ref([]);
  const reserveSelection = ref(false);
  const selectOnIndeterminate = computed(() => tableProps.selectOnIndeterminate);
  const selectable: Ref<((row: DefaultRow, index: number) => boolean) | null> = ref(null);
  const filters: Ref<StoreFilter> = ref({});
  const filteredData = ref<DefaultRow[] | null>(null);
  const sortingColumn = ref<TableColumnCtx | null>(null);
  const sortProp = ref<string | null>(null);
  const sortOrder = ref<string | null>(null);
  const hoverRow = ref<number | null>(null);

  // 更新 fixed
  const updateChildFixed = (column: TableColumnCtx) => {
    column.children?.forEach(childColumn => {
      childColumn.fixed = column.fixed;
      updateChildFixed(childColumn);
    });
  };

  // 更新列
  const updateColumns = () => {
    originalColumns.value.forEach(column => {
      updateChildFixed(column);
    });
    fixedColumns.value = originalColumns.value.filter(
      column => column.fixed === true || column.fixed === 'left',
    );
    rightFixedColumns.value = originalColumns.value.filter(
      column => column.fixed === 'right',
    );
    if (
      fixedColumns.value.length > 0 &&
      originalColumns.value[0] &&
      originalColumns.value[0].type === 'selection' &&
      !originalColumns.value[0].fixed
    ) {
      originalColumns.value[0].fixed = true;
      fixedColumns.value.unshift(originalColumns.value[0]);
    }

    const notFixedColumns = originalColumns.value.filter(column => !column.fixed);
    originColumns.value = [fixedColumns.value].flat()
      .concat(notFixedColumns)
      .concat(rightFixedColumns.value);

    const leafColumns = doFlattenColumns(notFixedColumns);
    const fixedLeafColumns = doFlattenColumns(fixedColumns.value);
    const rightFixedLeafColumns = doFlattenColumns(rightFixedColumns.value);

    leafColumnsLength.value = leafColumns.length;
    fixedLeafColumnsLength.value = fixedLeafColumns.length;
    rightFixedLeafColumnsLength.value = rightFixedLeafColumns.length;

    columns.value = [fixedLeafColumns].flat()
      .concat(leafColumns)
      .concat(rightFixedLeafColumns);
    isComplex.value =
      fixedColumns.value.length > 0 || rightFixedColumns.value.length > 0;
  };

  // 更新 DOM
  const scheduleLayout = (needUpdateColumns?: boolean, immediate = false) => {
    if (needUpdateColumns) {
      updateColumns();
    }

    if (immediate) {
      table.state.doLayout();
    } else {
      table.state.debouncedUpdateLayout();
    }
  };

  watch(data, () => table.state && scheduleLayout(false), {
    deep: true,
  });

  // 检查 rowKey 是否存在
  const assertRowKey = () => {
    if (!rowKey.value) throw new Error('[LpTable] prop row-key is required');
  };

  // 选择
  const isSelected = (row: DefaultRow) => {
    return selection.value.includes(row);
  };

  const clearSelection = () => {
    isAllSelected.value = false;
    const oldSelection = selection.value;
    if (oldSelection.length > 0) {
      selection.value = [];
      table.emit('selection-change', []);
    }
  };

  const cleanSelection = () => {
    let deleted: DefaultRow[];
    if (rowKey.value) {
      deleted = [];
      const selectedMap = getKeysMap(selection.value, rowKey.value);
      const dataMap = getKeysMap(data.value, rowKey.value);
      for (const key in selectedMap) {
        if (hasOwn(selectedMap, key) && !dataMap[key]) {
          deleted.push(selectedMap[key].row);
        }
      }
    } else {
      deleted = selection.value.filter(item => !data.value.includes(item));
    }

    if (deleted.length > 0) {
      const newSelection = selection.value.filter(
        item => !deleted.includes(item),
      );
      selection.value = newSelection;
      table.emit('selection-change', newSelection.slice());
    }
  };

  const getSelectionRows = () => {
    return (selection.value || []).slice();
  };

  const toggleRowSelection = (
    row: DefaultRow,
    selected?: boolean,
    emitChange = true,
  ) => {
    const changed = toggleRowStatus(selection.value, row, selected);
    if (changed) {
      const newSelection = (selection.value || []).slice();
      // 调用 API 修改选中值，不触发 select 事件
      if (emitChange) {
        table.emit('select', newSelection, row);
      }

      table.emit('selection-change', newSelection);
    }
  };

  // gets the number of all child nodes by rowKey
  const getChildrenCount = (rowKey: string) => {
    let count = 0;
    const children = tree.states.treeData.value[rowKey]?.children;
    if (children) {
      count += children.length;
      children.forEach(childKey => {
        count += getChildrenCount(childKey);
      });
    }
    return count;
  };

  const doToggleAllSelection = () => {
    // when only some rows are selected (but not all), select or deselect all of them
    // depending on the value of selectOnIndeterminate
    const value = selectOnIndeterminate.value
      ? !isAllSelected.value
      : !(isAllSelected.value || selection.value.length > 0);
    isAllSelected.value = value;

    let selectionChanged = false;
    let childrenCount = 0;

    data.value.forEach((row, index) => {
      const rowIndex = index + childrenCount;
      if (selectable.value) {
        if (
          selectable.value.call(null, row, rowIndex)
          && toggleRowStatus(selection.value, row, value)
        ) {
          selectionChanged = true;
        }
      } else {
        if (toggleRowStatus(selection.value, row, value)) {
          selectionChanged = true;
        }
      }
      childrenCount += getChildrenCount(getRowIdentity(row, rowKey.value!));
    });

    if (selectionChanged) {
      table.emit(
        'selection-change',
        selection.value ? selection.value.slice() : [],
      );
    }

    table.emit('select-all', selection.value);
  };

  const updateSelectionByRowKey = () => {
    const selectedMap = getKeysMap(selection.value, rowKey.value!);
    data.value.forEach(row => {
      const rowId = getRowIdentity(row, rowKey.value!);
      const rowInfo = selectedMap[rowId];
      if (rowInfo) {
        selection.value[rowInfo.index] = row;
      }
    });
  };

  const updateAllSelected = () => {
    // data 为 null 时，解构时的默认值会被忽略
    if (data.value?.length === 0) {
      isAllSelected.value = false;
      return;
    }

    let selectedMap: ReturnType<typeof getKeysMap>;
    if (rowKey.value) {
      selectedMap = getKeysMap(selection.value, rowKey.value);
    }

    const isSelected = function (row: DefaultRow) {
      return selectedMap ? !!selectedMap[getRowIdentity(row, rowKey.value!)] : selection.value.includes(row);
    };

    let flag = true;
    let selectedCount = 0;
    let childrenCount = 0;
    for (let i = 0, j = (data.value || []).length; i < j; i++) {
      const rowIndex = i + childrenCount;
      const item = data.value[i];
      const isRowSelectable =
        selectable.value && selectable.value.call(null, item, rowIndex);
      if (isSelected(item)) {
        selectedCount++;
      } else {
        if (!selectable.value || isRowSelectable) {
          flag = false;
          break;
        }
      }
      childrenCount += getChildrenCount(getRowIdentity(item, rowKey.value!));
    }

    if (selectedCount === 0) flag = false;
    isAllSelected.value = flag;
  };

  // 过滤与排序
  const updateFilters = (columns: TableColumnCtx | TableColumnCtx[], values: string[]) => {
    if (!Array.isArray(columns)) {
      columns = [columns];
    }

    const filterMap: Record<string, typeof values> = {};
    columns.forEach(col => {
      filters.value[col.id] = values;
      filterMap[col.columnKey || col.id] = values;
    });
    return filterMap;
  };

  const updateSort = (column: TableColumnCtx | null, prop: string | null, order: string | null) => {
    if (sortingColumn.value && sortingColumn.value !== column) {
      sortingColumn.value.order = null;
    }
    sortingColumn.value = column;
    sortProp.value = prop;
    sortOrder.value = order;
  };

  const execFilter = () => {
    let sourceData = unref(dataTmp);
    Object.keys(filters.value).forEach(columnId => {
      const values = filters.value[columnId];
      if (!values || values.length === 0) return;
      const column = getColumnById(
        columns.value,
        columnId,
      );
      if (column && column.filterMethod) {
        sourceData = sourceData.filter(row => {
          return values.some(value =>
            column.filterMethod.call(null, value, row, column),
          );
        });
      }
    });

    filteredData.value = sourceData;
  };

  const execSort = () => {
    data.value = sortData(filteredData.value!, {
      sortingColumn: sortingColumn.value!,
      sortProp: sortProp.value!,
      sortOrder: sortOrder.value!,
    });
  };

  // 根据 filters 与 sort 去过滤 data
  const execQuery = (ignore?: { filter: boolean }) => {
    if (!(ignore && ignore.filter)) {
      execFilter();
    }
    execSort();
  };

  const clearFilter = (columnKeys?: string | string[]) => {
    const { tableHeaderRef } = table.refs as TableRefs;

    if (!tableHeaderRef) return;
    const panels = Object.assign({}, tableHeaderRef.filterPanels);

    const keys = Object.keys(panels);
    if (keys.length === 0) return;

    if (typeof columnKeys === 'string') {
      columnKeys = [columnKeys];
    }

    if (Array.isArray(columnKeys)) {
      const columnList = columnKeys.map(key => getColumnByKey({ columns: columns.value }, key));

      keys.forEach(key => {
        const column = columnList.find(col => col.id === key);
        if (column) {
          column.filteredValue = [];
        }
      });

      actions.filterChange({
        column: columnList,
        values: [],
        silent: true,
        multi: true,
      });
    } else {
      keys.forEach(key => {
        const column = columns.value.find(col => col.id === key);
        if (column) {
          column.filteredValue = [];
        }
      });

      filters.value = {};
      actions.filterChange({
        column: {} as TableColumnCtx,
        values: [],
        silent: true,
      });
    }
  };

  const clearSort = () => {
    if (!sortingColumn.value) return;

    updateSort(null, null, null);
    actions.changeSortCondition({ silent: true });
  };

  // 适配层，expand-row-keys 在 Expand 与 TreeTable 中都有使用
  const setExpandRowKeysAdapter = (val: string[]) => {
    // 这里会触发额外的计算，但为了兼容性，暂时这么做
    expand.setExpandRowKeys(val);
    tree.updateTreeExpandKeys(val);
  };

  // 展开行与 TreeTable 都要使用
  const toggleRowExpansionAdapter = (row: DefaultRow, expanded?: boolean) => {
    const hasExpandColumn = columns.value.some(({ type }) => type === 'expand');
    if (hasExpandColumn) {
      expand.toggleRowExpansion(row, expanded);
    } else {
      tree.toggleTreeExpansion(row, expanded);
    }
  };

  return {
    assertRowKey,
    updateColumns,
    scheduleLayout,
    isSelected,
    clearSelection,
    cleanSelection,
    getSelectionRows,
    toggleRowSelection,
    toggleAllSelection: debounce(doToggleAllSelection, 10),
    updateSelectionByRowKey,
    updateAllSelected,
    updateFilters,
    updateSort,
    execFilter,
    execSort,
    execQuery,
    clearFilter,
    clearSort,
    setExpandRowKeysAdapter,
    toggleRowExpansionAdapter,
    states: {
      tableSize,
      rowKey,
      data,
      _data: dataTmp,
      isComplex,
      originalColumns,
      originColumns,
      columns,
      fixedColumns,
      rightFixedColumns,
      leafColumns,
      fixedLeafColumns,
      rightFixedLeafColumns,
      leafColumnsLength,
      fixedLeafColumnsLength,
      rightFixedLeafColumnsLength,
      isAllSelected,
      selection,
      reserveSelection,
      selectOnIndeterminate,
      selectable,
      filters,
      filteredData,
      sortingColumn,
      sortProp,
      sortOrder,
      hoverRow,
    },
  };
});

export type Watcher = ReturnType<typeof useWatcher>;
