
import { computed, unref } from 'vue';
import { isObject } from '@lemon-peel/utils';

import { SortOrder, oppositeOrderMap } from '../constants';
import { placeholderSign } from '../private';
import { calcColumnStyle } from './utils';

import type { CSSProperties, Ref } from 'vue';
import type { TableV2Props } from '../table';
import type { AnyColumns, Column, KeyType } from '../types';

function useColumns(
  props: TableV2Props,
  columns: Ref<AnyColumns>,
  fixed: Ref<boolean>,
) {
  const visibleColumns = computed(() => {
    return unref(columns).filter(column => !column.hidden);
  });

  const fixedColumnsOnLeft = computed(() =>
    unref(visibleColumns).filter(
      column => column.fixed === 'left' || column.fixed === true,
    ),
  );

  const fixedColumnsOnRight = computed(() =>
    unref(visibleColumns).filter(column => column.fixed === 'right'),
  );

  const normalColumns = computed(() =>
    unref(visibleColumns).filter(column => !column.fixed),
  );

  const mainColumns = computed(() => {
    const ret: AnyColumns = [];

    for (const column of unref(fixedColumnsOnLeft)) {
      ret.push({
        ...column,
        placeholderSign,
      });
    }

    for (const column of unref(normalColumns)) {
      ret.push(column);
    }

    for (const column of unref(fixedColumnsOnRight)) {
      ret.push({
        ...column,
        placeholderSign,
      });
    }

    return ret;
  });

  const hasFixedColumns = computed(() => {
    return unref(fixedColumnsOnLeft).length || unref(fixedColumnsOnRight).length;
  });

  const columnsStyles = computed(() => {
    const arr = unref(columns);

    return arr.reduce<Record<Column<any>['key'], CSSProperties>>(
      (style, column) => {
        style[column.key] = calcColumnStyle(column, unref(fixed), props.fixed);
        return style;
      },
      {},
    );
  });

  const columnsTotalWidth = computed(() => {
    return unref(visibleColumns).reduce(
      (width, column) => width + column.width,
      0,
    );
  });

  const getColumn = (key: KeyType) => {
    return unref(columns).find(column => column.key === key);
  };

  const getColumnStyle = (key: KeyType) => {
    return unref(columnsStyles)[key];
  };

  const updateColumnWidth = (column: Column<any>, width: number) => {
    column.width = width;
  };

  function onColumnSorted(e: MouseEvent) {
    const { key } = (e.currentTarget as HTMLElement).dataset;
    if (!key) return;
    const { sortState, sortBy } = props;

    let order = SortOrder.ASC;

    order = isObject(sortState) ? oppositeOrderMap[sortState[key]] : oppositeOrderMap[sortBy.order];

    props.onColumnSort?.({ column: getColumn(key)!, key, order });
  }

  return {
    columns,
    columnsStyles,
    columnsTotalWidth,
    fixedColumnsOnLeft,
    fixedColumnsOnRight,
    hasFixedColumns,
    mainColumns,
    normalColumns,
    visibleColumns,

    getColumn,
    getColumnStyle,
    updateColumnWidth,
    onColumnSorted,
  };
}

export { useColumns };
export type UseColumnsReturn = ReturnType<typeof useColumns>;
