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
  type StoreStates = typeof watcher.states;

  const mutations = {
    setData(states: StoreStates, data: DefaultRow[]) {
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
      states: StoreStates,
      column: TableColumnCtx,
      parent: TableColumnCtx,
    ) {
      const array = unref(states.originalColumns);
      let newColumns = [];
      if (parent) {
        if (parent && !parent.children) {
          parent.children = [];
        }
        parent.children!.push(column);
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
      states: StoreStates,
      column: TableColumnCtx,
      parent: TableColumnCtx,
    ) {
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

    sort(states: StoreStates, options: Sort) {
      const { prop, order, init } = options;
      if (prop) {
        const column = unref(states.columns).find(
          (column: TableColumnCtx) => column.property === prop,
        );
        if (column) {
          column.order = order;
          watcher.updateSort(column, prop, order);
          // eslint-disable-next-line @typescript-eslint/no-use-before-define
          commit('changeSortCondition', { init });
        }
      }
    },

    changeSortCondition(states: StoreStates, options: Sort) {
      const { sortingColumn, sortProp, sortOrder } = states;
      const columnValue = unref(sortingColumn);
      const propValue = unref(sortProp);
      const orderValue = unref(sortOrder);
      if (orderValue === null) {
        states.sortingColumn.value = null;
        states.sortProp.value = null;
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

    filterChange(_states: StoreStates, options: Filter) {
      const { column, values, silent } = options;
      const newFilters = watcher.updateFilters(column, values);
      watcher.execQuery();

      if (!silent) {
        table.emit('filter-change', newFilters);
      }
      table.updateTableScrollY();
    },

    toggleAllSelection() {
      instance.store.toggleAllSelection();
    },

    rowSelectedChanged(_states, row: T) {
      instance.store.toggleRowSelection(row);
      instance.store.updateAllSelected();
    },

    setHoverRow(states: StoreStates, row: T) {
      states.hoverRow.value = row;
    },

    setCurrentRow(_states, row: T) {
      instance.store.updateCurrentRow(row);
    },
  };

  function commit(name: keyof typeof mutations, ...args: any[]) {
    if (!mutations[name]) {
      throw new Error(`Action not found: ${name}`);
    }

    mutations[name](states, ...args);
  }

  return { commit };
});

export default useActions;

export type StoreFilter = Record<string, string[]>;
