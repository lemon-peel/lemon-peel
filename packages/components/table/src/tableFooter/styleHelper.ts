import { computed, inject } from 'vue';
import { useNamespace } from '@lemon-peel/hooks/src';

import { ensurePosition, getFixedColumnOffset, getFixedColumnsClass } from '../util';
import { STORE_INJECTION_KEY } from '../tokens';

import type { TableColumnCtx } from '../tableColumn/defaults';
import type { Store } from '../store';

function useMapState() {
  const store = inject(STORE_INJECTION_KEY)!;

  const leftFixedLeafCount = computed(() => {
    return store.states.fixedLeafColumnsLength.value;
  });

  const rightFixedLeafCount = computed(() => {
    return store.states.rightFixedColumns.value.length;
  });

  const columnsCount = computed(() => {
    return store.states.columns.value.length;
  });

  const leftFixedCount = computed(() => {
    return store.states.fixedColumns.value.length;
  });

  const rightFixedCount = computed(() => {
    return store.states.rightFixedColumns.value.length;
  });

  return {
    leftFixedLeafCount,
    rightFixedLeafCount,
    columnsCount,
    leftFixedCount,
    rightFixedCount,
    columns: store.states.columns,
  };
}

function useStyle(store: Store) {
  const { columns } = useMapState();
  const ns = useNamespace('table');

  const getCellClasses = (columns: TableColumnCtx[], cellIndex: number) => {
    const column = columns[cellIndex];
    const classes = [
      ns.e('cell'),
      column.id,
      column.align,
      column.labelClassName,
      ...getFixedColumnsClass(ns.b(), cellIndex, column.fixed, store),
    ];
    if (column.className) {
      classes.push(column.className);
    }
    if (!column.children) {
      classes.push(ns.is('leaf'));
    }
    return classes;
  };

  const getCellStyles = (column: TableColumnCtx, cellIndex: number) => {
    const fixedStyle = getFixedColumnOffset(
      cellIndex,
      column.fixed,
      store,
    );

    ensurePosition(fixedStyle, 'left');
    ensurePosition(fixedStyle, 'right');
    return fixedStyle;
  };

  return {
    getCellClasses,
    getCellStyles,
    columns,
  };
}

export default useStyle;
