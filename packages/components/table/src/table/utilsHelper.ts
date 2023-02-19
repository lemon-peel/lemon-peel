
import type { Store } from '../store';
import type { DefaultRow } from './defaults';

function useUtils(store: Store) {
  const setCurrentRow = (row: DefaultRow) => {
    store.commit('setCurrentRow', row);
  };

  const getSelectionRows = () => {
    return store.watcher.getSelectionRows();
  };

  const toggleRowSelection = (row: DefaultRow, selected: boolean) => {
    store.watcher.toggleRowSelection(row, selected, false);
    store.watcher.updateAllSelected();
  };

  const clearSelection = () => {
    store.watcher.clearSelection();
  };

  const clearFilter = (columnKeys: string[]) => {
    store.watcher.clearFilter(columnKeys);
  };

  const toggleAllSelection = () => {
    store.commit('toggleAllSelection');
  };

  const toggleRowExpansion = (row: DefaultRow, expanded?: boolean) => {
    store.watcher.toggleRowExpansionAdapter(row, expanded);
  };

  const clearSort = () => {
    store.watcher.clearSort();
  };

  const sort = (prop: string, order: string) => {
    store.commit('sort', { prop, order });
  };

  return {
    setCurrentRow,
    getSelectionRows,
    toggleRowSelection,
    clearSelection,
    clearFilter,
    toggleAllSelection,
    toggleRowExpansion,
    clearSort,
    sort,
  };
}

export default useUtils;
