import type { DefaultRow } from './../table/defaults';

import { inject } from 'vue';
import { useNamespace } from '@lemon-peel/hooks/src';
import { ensurePosition, getFixedColumnOffset, getFixedColumnsClass } from '../util';
import { STORE_INJECTION_KEY, TABLE_INJECTION_KEY } from '../tokens';
import type { TableColumnCtx } from '../tableColumn/defaults';
import type { TableBodyProps } from './defaults';

function useStyles(props: TableBodyProps) {
  const table = inject(TABLE_INJECTION_KEY)!;
  const store = inject(STORE_INJECTION_KEY)!;
  const ns = useNamespace('table');

  const getRowStyle = (row: DefaultRow, rowIndex: number) => {
    const rowStyle = table.props.rowStyle;
    if (typeof rowStyle === 'function') {
      return rowStyle.call(null, {
        row,
        rowIndex,
      });
    }
    return rowStyle || null;
  };

  const getRowClass = (row: DefaultRow, rowIndex: number) => {
    const classes = [ns.e('row')];
    if (
      table.props.highlightCurrentRow &&
      row === store.states.currentRow.value
    ) {
      classes.push('current-row');
    }

    if (props.stripe && rowIndex % 2 === 1) {
      classes.push(ns.em('row', 'striped'));
    }

    const rowClassName = table.props.rowClassName;
    if (typeof rowClassName === 'string') {
      classes.push(rowClassName);
    } else if (typeof rowClassName === 'function') {
      classes.push(
        rowClassName.call(null, {
          row,
          rowIndex,
        }),
      );
    }
    return classes;
  };

  const getCellStyle = (
    rowIndex: number,
    columnIndex: number,
    row: DefaultRow,
    column: TableColumnCtx,
  ) => {
    const cellStyle = table.props.cellStyle;
    let cellStyles = cellStyle ?? {};
    if (typeof cellStyle === 'function') {
      cellStyles = cellStyle.call(null, {
        rowIndex,
        columnIndex,
        row,
        column,
      });
    }

    const fixedStyle = getFixedColumnOffset(
      columnIndex,
      props.fixed,
      store,
    );

    ensurePosition(fixedStyle, 'left');
    ensurePosition(fixedStyle, 'right');
    return Object.assign({}, cellStyles, fixedStyle);
  };

  const getCellClass = (
    rowIndex: number,
    columnIndex: number,
    row: DefaultRow,
    column: TableColumnCtx,
    offset: number,
  ) => {
    const fixedClasses = getFixedColumnsClass(
      ns.b(),
      columnIndex,
      props?.fixed,
      store,
      undefined,
      offset,
    );

    const classes = [column.id, column.align, column.className, ...fixedClasses];
    const cellClassName = table.props.cellClassName;
    if (typeof cellClassName === 'string') {
      classes.push(cellClassName);
    } else if (typeof cellClassName === 'function') {
      classes.push(
        cellClassName.call(null, {
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

  const getSpan = (
    row: DefaultRow,
    column: TableColumnCtx,
    rowIndex: number,
    columnIndex: number,
  ) => {
    let rowspan = 1;
    let colspan = 1;
    const fn = table.props.spanMethod;
    if (typeof fn === 'function') {
      const result = fn({
        row,
        column,
        rowIndex,
        columnIndex,
      });
      if (Array.isArray(result)) {
        rowspan = result[0];
        colspan = result[1];
      } else if (typeof result === 'object') {
        rowspan = result.rowspan;
        colspan = result.colspan;
      }
    }
    return { rowspan, colspan };
  };

  const getColspanRealWidth = (
    columns: TableColumnCtx[],
    colspan: number,
    index: number,
  ): number => {
    if (colspan < 1) {
      return columns[index].realWidth!;
    }

    const widthArr = columns
      .map(({ realWidth, width }) => realWidth || width)
      .slice(index, index + colspan);

    return Number(widthArr.reduce((acc, width) => Number(acc) + Number(width), -1));
  };

  return {
    getRowStyle,
    getRowClass,
    getCellStyle,
    getCellClass,
    getSpan,
    getColspanRealWidth,
  };
}

export default useStyles;
