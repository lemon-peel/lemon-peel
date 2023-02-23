import { memoize } from 'lodash-es';
import { unref } from 'vue';
import { lazyProxy } from '@lemon-peel/utils';

import { useCurrent } from './current';
import { useExpand } from './expand';
import { useTree } from './tree';
import { useWatcher } from './watcher';

import type { Ref } from 'vue';
import type { TableColumnCtx } from '../tableColumn/defaults';
import type { DefaultRow, Filter, Sort, TableVM } from '../table/defaults';

export interface WatcherPropsData {
  data: Ref<DefaultRow[]>;
  rowKey: Ref<string>;
}

function replaceColumn(
  array: TableColumnCtx[],
  column: TableColumnCtx,
) {
  return array.map(item => {
    if (item.id === column.id) {
      return column;
    } else if (item.children?.length) {
      item.children = replaceColumn(item.children, column);
    }
    return item;
  });
}

function sortColumn(array: TableColumnCtx[]) {
  array.forEach(item => {
    item.no = item.getColumnIndex?.();
    if (item.children?.length) {
      sortColumn(item.children);
    }
  });
  array.sort((cur, pre) => cur.no - pre.no);
}

export const useActions = memoize((table: TableVM) => {
  const current = lazyProxy(() => useCurrent(table));
  const expand = lazyProxy(() => useExpand(table));
  const tree = lazyProxy(() => useTree(table));
  const watcher = lazyProxy(() => useWatcher(table));

  return {
    setData(data: DefaultRow[]) {
      const states = watcher.states;
      const dataInstanceChanged = unref(states._data) !== data;
      states.data.value = data;
      states._data.value = data;
      watcher.execQuery();
      // 数据变化，更新部分数据。
      // 没有使用 computed，而是手动更新部分数据 https://github.com/vuejs/vue/issues/6660#issuecomment-331417140
      current.updateCurrentRowData();
      expand.updateExpandRows();
      tree.updateTreeData(
        expand.states.defaultExpandAll.value,
      );
      if (unref(states.reserveSelection)) {
        watcher.assertRowKey();
        watcher.updateSelectionByRowKey();
      } else {
        if (dataInstanceChanged) {
          watcher.clearSelection();
        } else {
          watcher.cleanSelection();
        }
      }
      watcher.updateAllSelected();
      if (table.$ready) {
        watcher.scheduleLayout();
      }
    },

    insertColumn(
      column: TableColumnCtx,
      parent?: TableColumnCtx,
    ) {
      const states = watcher.states;
      const array = unref(states.originalColumns);
      let newColumns = [];
      if (parent) {
        if (parent && !parent.children) {
          parent.children = [];
        }
        parent.children!.push(column as TableColumnCtx);
        newColumns = replaceColumn(array, parent);
      } else {
        array.push(column);
        newColumns = array;
      }
      sortColumn(newColumns);
      states.originalColumns.value = newColumns;
      if (column.type === 'selection') {
        states.selectable.value = column.selectable;
        states.reserveSelection.value = column.reserveSelection;
      }
      if (table.$ready) {
        watcher.updateColumns(); // hack for dynamics insert column
        watcher.scheduleLayout();
      }
    },

    removeColumn(
      column: TableColumnCtx,
      parent: TableColumnCtx,
    ) {
      const states = watcher.states;
      const array = unref(states.originalColumns) || [];
      if (parent) {
        parent.children?.splice(
          parent.children.findIndex(item => item.id === column.id),
          1,
        );
        if (parent.children?.length === 0) {
          delete parent.children;
        }
        states.originalColumns.value = replaceColumn(array, parent);
      } else {
        const index = array.indexOf(column);
        if (index > -1) {
          array.splice(index, 1);
          states.originalColumns.value = array;
        }
      }

      if (table.$ready) {
        watcher.updateColumns(); // hack for dynamics remove column
        watcher.scheduleLayout();
      }
    },

    changeSortCondition(options?: Partial<Sort>) {
      const { sortingColumn, sortProp, sortOrder } = watcher.states;
      const columnValue = unref(sortingColumn);
      const propValue = unref(sortProp);
      const orderValue = unref(sortOrder);
      if (orderValue === null) {
        sortingColumn.value = null;
        sortProp.value = null;
      }
      const ignore = { filter: true };
      watcher.execQuery(ignore);

      if (!options || !(options.silent || options.init)) {
        table.emit('sort-change', {
          column: columnValue,
          prop: propValue,
          order: orderValue,
        });
      }

      table.updateTableScrollY();
    },

    sort(options: Sort) {
      const { prop, order, init } = options;
      if (prop) {
        const column = unref(watcher.states.columns).find((column: TableColumnCtx) => column.property === prop);
        if (column) {
          column.order = order;
          watcher.updateSort(column, prop, order);
          this.changeSortCondition({ init });
        }
      }
    },

    filterChange(options: Filter) {
      const { column, values, silent } = options;
      const newFilters = watcher.updateFilters(column, values);
      watcher.execQuery();

      if (!silent) {
        table.emit('filter-change', newFilters);
      }
      table.updateTableScrollY();
    },

    toggleAllSelection() {
      watcher.toggleAllSelection();
    },

    rowSelectedChanged(row: DefaultRow) {
      watcher.toggleRowSelection(row, false);
      watcher.updateAllSelected();
    },

    setHoverRow(index: number | null) {
      watcher.states.hoverRow.value = index;
    },

    setCurrentRow(row: DefaultRow) {
      current.updateCurrentRow(row);
    },
  };
});

export default useActions;

export type StoreFilter = Record<string, string[]>;
