import { computed, getCurrentInstance, onBeforeMount, onMounted, onUnmounted, onUpdated } from 'vue';

import type TableLayout from './TableLayout';
import type { TableVM } from '../table/defaults';
import type { TableColumnCtx } from '../tableColumn/defaults';

function useLayoutObserver(root: TableVM) {
  const instance = getCurrentInstance()!;
  const tableLayout = computed(() => {
    const layout = root.layout as TableLayout;
    if (!layout) {
      throw new Error('Can not find table layout.');
    }
    return layout;
  });

  const onColumnsChange = (layout: TableLayout) => {
    const cols = root.vnode.el?.querySelectorAll('colgroup > col') || [];
    if (cols.length === 0) return;
    const flattenColumns = layout.getFlattenColumns();
    const columnsMap: Record<string, TableColumnCtx> = {};
    flattenColumns.forEach(column => {
      columnsMap[column.id] = column;
    });

    for (let i = 0, j = cols.length; i < j; i++) {
      const col = cols[i];
      const name = col.getAttribute('name');
      const column = columnsMap[name];
      if (column) {
        col.setAttribute('width', column.realWidth || column.width);
      }
    }
  };

  const onScrollableChange = (layout: TableLayout) => {
    const cols =
      root.vnode.el?.querySelectorAll('colgroup > col[name=gutter]') || [];
    for (let i = 0, j = cols.length; i < j; i++) {
      const col = cols[i];
      col.setAttribute('width', layout.scrollY.value ? layout.gutterWidth : '0');
    }
    const ths = root.vnode.el?.querySelectorAll('th.gutter') || [];
    for (let i = 0, j = ths.length; i < j; i++) {
      const th = ths[i];
      th.style.width = layout.scrollY.value ? `${layout.gutterWidth}px` : '0';
      th.style.display = layout.scrollY.value ? '' : 'none';
    }
  };

  onBeforeMount(() => {
    tableLayout.value.addObserver(instance as any);
  });

  onMounted(() => {
    onColumnsChange(tableLayout.value);
    onScrollableChange(tableLayout.value);
  });

  onUpdated(() => {
    onColumnsChange(tableLayout.value);
    onScrollableChange(tableLayout.value);
  });

  onUnmounted(() => {
    tableLayout.value.removeObserver(instance as any);
  });

  return {
    tableLayout: tableLayout.value,
    onColumnsChange,
    onScrollableChange,
  };
}

export default useLayoutObserver;
