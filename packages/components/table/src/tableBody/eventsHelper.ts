import type { DefaultRow } from './../table/defaults';

import { inject } from 'vue';
import { debounce } from 'lodash-es';
import { getStyle, hasClass } from '@lemon-peel/utils';
import { createTablePopper, getCell, getColumnByCell } from '../util';
import { STORE_INJECTION_KEY, TABLE_INJECTION_KEY } from '../tokens';

import type { TableColumnCtx } from '../tableColumn/defaults';

function useEvents() {
  const table = inject(TABLE_INJECTION_KEY)!;
  const store = inject(STORE_INJECTION_KEY)!;

  const handleEvent = (event: Event, row: DefaultRow, name: string) => {
    const cell = getCell(event);
    let column: TableColumnCtx | null = null;
    const namespace = table.vnode.el?.dataset.prefix;
    if (cell) {
      column = getColumnByCell(store.states.columns.value, cell, namespace);

      if (column) {
        table.emit(`cell-${name}`, row, column, cell, event);
      }
    }
    table.emit(`row-${name}`, row, column, event);
  };

  const handleDoubleClick = (event: Event, row: DefaultRow) => {
    handleEvent(event, row, 'dblclick');
  };

  const handleClick = (event: Event, row: DefaultRow) => {
    store.actions.setCurrentRow(row);
    handleEvent(event, row, 'click');
  };

  const handleContextMenu = (event: Event, row: DefaultRow) => {
    handleEvent(event, row, 'contextmenu');
  };

  const handleMouseEnter = debounce((index: number) => {
    store.actions.setHoverRow(index);
  }, 30);

  const handleMouseLeave = debounce(() => {
    store.actions.setHoverRow(null);
  }, 30);

  const handleCellMouseEnter = (
    event: MouseEvent,
    row: DefaultRow,
    tooltipEffect?: string,
  ) => {
    const cell = getCell(event)!;
    const namespace = table.vnode.el?.dataset.prefix;
    if (cell) {
      const column = getColumnByCell(store.states.columns.value, cell, namespace)!;
      const hoverState = (table.hoverState = { cell, column, row });
      table.emit(
        'cell-mouse-enter',
        hoverState.row,
        hoverState.column,
        hoverState.cell,
        event,
      );
    }

    // 判断是否text-overflow, 如果是就显示tooltip
    const cellChild = (event.target as HTMLElement).querySelector(
      '.cell',
    ) as HTMLElement;
    if (
      !(
        hasClass(cellChild, `${namespace}-tooltip`) &&
        cellChild.childNodes.length > 0
      )
    ) {
      return;
    }
    // use range width instead of scrollWidth to determine whether the text is overflowing
    // to address a potential FireFox bug: https://bugzilla.mozilla.org/show_bug.cgi?id=1074543#c3
    const range = document.createRange();
    range.setStart(cellChild, 0);
    range.setEnd(cellChild, cellChild.childNodes.length);
    const rangeWidth = range.getBoundingClientRect().width;
    const padding =
      (Number.parseInt(getStyle(cellChild, 'paddingLeft'), 10) || 0) +
      (Number.parseInt(getStyle(cellChild, 'paddingRight'), 10) || 0);
    if (
      rangeWidth + padding > cellChild.offsetWidth ||
      cellChild.scrollWidth > cellChild.offsetWidth
    ) {
      createTablePopper(
        table.refs.tableWrapper,
        cell,
        cell.textContent || '',
        { placement: 'top', strategy: 'fixed' },
        tooltipEffect,
      );
    }
  };
  const handleCellMouseLeave = (event: MouseEvent) => {
    const cell = getCell(event);
    if (!cell) return;

    const oldHoverState = table.hoverState;
    table.emit(
      'cell-mouse-leave',
      oldHoverState?.row,
      oldHoverState?.column,
      oldHoverState?.cell,
      event,
    );
  };

  return {
    handleDoubleClick,
    handleClick,
    handleContextMenu,
    handleMouseEnter,
    handleMouseLeave,
    handleCellMouseEnter,
    handleCellMouseLeave,
  };
}

export default useEvents;
