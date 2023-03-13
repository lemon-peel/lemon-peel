import { inject } from 'vue';
import { useNamespace } from '@lemon-peel/hooks';
import { ensurePosition, getFixedColumnOffset, getFixedColumnsClass } from '../util';
import { STORE_INJECTION_KEY, TABLE_INJECTION_KEY } from '../tokens';
import type { TableColumnCtx } from '../tableColumn/defaults';
import type { DefaultRow } from '../table/defaults';

function useStyle() {
  const table = inject(TABLE_INJECTION_KEY)!;
  const store = inject(STORE_INJECTION_KEY)!;
  const ns = useNamespace('table');

  const getHeaderRowStyle = (rowIndex: number) => {
    const headerRowStyle = table.props.headerRowStyle;
    if (typeof headerRowStyle === 'function') {
      return headerRowStyle.call(null, { rowIndex });
    }
    return headerRowStyle;
  };

  const getHeaderRowClass = (rowIndex: number): string => {
    const classes: string[] = [];
    const headerRowClassName = table.props.headerRowClassName;
    if (typeof headerRowClassName === 'string') {
      classes.push(headerRowClassName);
    } else if (typeof headerRowClassName === 'function') {
      classes.push(headerRowClassName.call(null, { rowIndex }));
    }

    return classes.join(' ');
  };

  const getHeaderCellStyle = (
    rowIndex: number,
    columnIndex: number,
    row: DefaultRow,
    column: TableColumnCtx,
  ) => {
    let headerCellStyles = table.props.headerCellStyle ?? {};
    if (typeof headerCellStyles === 'function') {
      headerCellStyles = headerCellStyles.call(null, {
        rowIndex,
        columnIndex,
        row,
        column,
      });
    }
    const fixedStyle = getFixedColumnOffset(
      columnIndex,
      column.fixed,
      store,
      row as unknown as TableColumnCtx[],
    );
    ensurePosition(fixedStyle, 'left');
    ensurePosition(fixedStyle, 'right');
    return Object.assign({}, headerCellStyles, fixedStyle);
  };

  const getHeaderCellClass = (
    rowIndex: number,
    columnIndex: number,
    row: DefaultRow,
    column: TableColumnCtx,
  ) => {
    const fixedClasses = getFixedColumnsClass(
      ns.b(),
      columnIndex,
      column.fixed,
      store,
      row as unknown as TableColumnCtx[],
    );
    const classes = [
      column.id,
      column.order,
      column.headerAlign,
      column.className,
      column.labelClassName,
      ...fixedClasses,
    ];

    if (!column.children) {
      classes.push('is-leaf');
    }

    if (column.sortable) {
      classes.push('is-sortable');
    }

    const headerCellClassName = table.props.headerCellClassName;
    if (typeof headerCellClassName === 'string') {
      classes.push(headerCellClassName);
    } else if (typeof headerCellClassName === 'function') {
      classes.push(
        headerCellClassName.call(null, {
          rowIndex,
          columnIndex,
          row,
          column,
        }),
      );
    }

    classes.push(ns.e('cell'));

    return classes.filter(Boolean).join(' ');
  };

  return {
    getHeaderRowStyle,
    getHeaderRowClass,
    getHeaderCellStyle,
    getHeaderCellClass,
  };
}

export default useStyle;
