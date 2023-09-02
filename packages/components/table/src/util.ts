
import { createPopper } from '@popperjs/core';
import { flatMap, get } from 'lodash';
import { hasOwn, isArray, isBoolean, throwError } from '@lemon-peel/utils';
import { useZIndex } from '@lemon-peel/hooks';
import escapeHtml from 'escape-html';

import type { Options as PopperOptions } from '@lemon-peel/components/popper';
import type { Instance as PopperInstance } from '@popperjs/core';
import type { LpTooltipProps } from '@lemon-peel/components/tooltip';
import type { Nullable, NotUndefined } from '@lemon-peel/utils';
import type { DefaultRow, TableProps } from './table/defaults';
import type { TableColumnCtx } from './tableColumn/defaults';
import type { Store } from './store';

export type TableOverflowTooltipOptions = Partial<
Pick<
LpTooltipProps,
| 'effect'
| 'enterable'
| 'hideAfter'
| 'offset'
| 'placement'
| 'popperClass'
| 'popperOptions'
| 'showAfter'
| 'showArrow'
// | 'transition'
>
>;

export function getCell(event: Event) {
  return (event.target as HTMLElement)?.closest('td');
}

const isObject = function (obj: unknown): boolean {
  return obj !== null && typeof obj === 'object';
};

export type SortMethod = (a: any, b: any) => void;
export type SortBy = string | (string | ((val: DefaultRow, index: number, array?: DefaultRow[]) => number))[];

export function orderBy(
  array: DefaultRow[],
  sortKey: string,
  reverse: string | number,
  sortMethod?: SortMethod,
  sortBy?: SortBy,
) {
  if (
    !sortKey &&
    !sortMethod &&
    (!sortBy || (Array.isArray(sortBy) && sortBy.length === 0))
  ) {
    return array;
  }

  if (typeof reverse === 'string') {
    reverse = reverse === 'descending' ? -1 : 1;
  } else {
    reverse = reverse && reverse < 0 ? -1 : 1;
  }
  const getKey = sortMethod
    ? null
    : function (value: any, index: number) {
      if (sortBy) {
        if (!Array.isArray(sortBy)) {
          sortBy = [sortBy];
        }
        return sortBy.map(by => {
          return typeof by === 'string' ? get(value, by) : by(value, index, array);
        });
      }
      if (sortKey !== '$key' && isObject(value) && '$value' in value) value = value.$value;
      return [isObject(value) ? get(value, sortKey) : value];
    };

  const compare = (a: any, b: any) => {
    if (sortMethod) {
      return sortMethod(a.value, b.value);
    }
    for (let i = 0, len = a.key.length; i < len; i++) {
      if (a.key[i] < b.key[i]) {
        return -1;
      }
      if (a.key[i] > b.key[i]) {
        return 1;
      }
    }
    return 0;
  };

  return array
    .map((value, index) => {
      return {
        value,
        index,
        key: getKey ? getKey(value, index) : null,
      };
    })
    .sort((a, b) => {
      let order = compare(a, b);
      if (!order) {
        // make stable https://en.wikipedia.org/wiki/Sorting_algorithm#Stability
        order = a.index - b.index;
      }
      return order * +reverse;
    })
    .map(item => item.value);
}

export function getColumnById(
  columns: TableColumnCtx[],
  columnId: string,
): null | TableColumnCtx {
  let column = null;
  columns.forEach(item => {
    if (item.id === columnId) {
      column = item;
    }
  });
  return column;
}

export function getColumnByKey(
  table: {
    columns: TableColumnCtx[];
  },
  columnKey: string,
): TableColumnCtx {
  let column = null;
  for (let i = 0; i < table.columns.length; i++) {
    const item = table.columns[i];
    if (item.columnKey === columnKey) {
      column = item;
      break;
    }
  }
  if (!column)
    throwError('LpTable', `No column matching with column-key: ${columnKey}`);
  return column;
}

export function getColumnByCell(
  columns: TableColumnCtx[],
  cell: HTMLElement,
  namespace: string,
): null | TableColumnCtx {
  const matches = (cell.className || '').match(
    new RegExp(`${namespace}-table_[^\\s]+`, 'gm'),
  );
  if (matches) {
    return getColumnById(columns, matches[0]);
  }
  return null;
}

export function getRowIdentity<T extends DefaultRow = DefaultRow>(
  row: T,
  rowKey: NotUndefined<TableProps['rowKey']>,
): string {
  if (!row) throw new Error('Row is required when get row identity');

  if (typeof rowKey === 'function') {
    return rowKey.call(null, row);
  }

  if (!rowKey.includes('.')) {
    return `${row[rowKey]}`;
  }

  const key = rowKey.split('.');
  let current = row;
  for (const element of key) {
    current = current[element];
  }
  return `${current}`;
}

export const getKeysMap = (
  data: DefaultRow[],
  rowKey: NotUndefined<TableProps['rowKey']>,
): Record<string, { row: DefaultRow, index: number }> => {
  const arrayMap: Record<string, any> = {};

  (data || []).forEach((row, index) => {
    arrayMap[getRowIdentity(row, rowKey)] = { row, index };
  });

  return arrayMap;
};

export function mergeOptions<T extends Record<string, any>, K extends Record<string, any>>(defaults: T, config: K): T & K {
  const options = {} as Record<string, any>;
  let key;
  for (key in defaults) {
    options[key] = defaults[key];
  }

  for (key in config) {
    if (hasOwn(config as unknown as Record<string, any>, key)) {
      const value = config[key];
      if (value !== undefined) {
        options[key] = value;
      }
    }
  }

  return options as any;
}

export function parseWidth(width: number | string): number | string {
  if (width === '') return width;
  if (width !== undefined) {
    width = Number.parseInt(width as string, 10);
    if (Number.isNaN(width)) {
      width = '';
    }
  }
  return width;
}

export function parseMinWidth(minWidth: number | string): number | string {
  if (minWidth === '') return minWidth;
  if (minWidth !== undefined) {
    minWidth = parseWidth(minWidth);
    if (Number.isNaN(minWidth)) {
      minWidth = 80;
    }
  }
  return minWidth;
}

export function parseHeight(height: number | string) {
  if (typeof height === 'number') {
    return height;
  }
  if (typeof height === 'string') {
    return /^\d+(?:px)?$/.test(height) ? Number.parseInt(height, 10) : height;
  }
  return null;
}

// https://github.com/reduxjs/redux/blob/master/src/compose.js
export function compose<T = any>(...funcs: ((...args: [T]) => T)[]) {
  if (funcs.length === 0) {
    return (arg: any) => arg;
  }

  if (funcs.length === 1) {
    return funcs[0];
  }

  return funcs.reduce((pre, next) =>
    (...args: [T]) =>
      pre(next(...args)),
  );
}

export function toggleRowStatus<T extends DefaultRow = DefaultRow>(
  statusArr: T[],
  row: T,
  newVal?: boolean,
): boolean {
  let changed = false;
  const index = statusArr.indexOf(row);
  const included = index !== -1;

  const toggleStatus = (type: 'add' | 'remove') => {
    if (type === 'add') {
      statusArr.push(row);
    } else {
      statusArr.splice(index, 1);
    }
    changed = true;
    if (isArray(row.children)) {
      row.children.forEach(item => {
        toggleRowStatus(statusArr, item, newVal ?? !included);
      });
    }
  };

  if (isBoolean(newVal)) {
    if (newVal && !included) {
      toggleStatus('add');
    } else if (!newVal && included) {
      toggleStatus('remove');
    }
  } else {
    included ? toggleStatus('remove') : toggleStatus('add');
  }
  return changed;
}

export function walkTreeNode<T extends DefaultRow>(
  root: T[],
  cb: (parent: T, children?: T[], level?: number) => void,
  childrenKey = 'children',
  lazyKey = 'hasChildren',
) {
  const isNil = (array?: any) => !(Array.isArray(array) && array.length > 0);

  const walker = (parent: T, children: T[], level: number) => {
    cb(parent, children, level);
    children.forEach(item => {
      if (item[lazyKey]) {
        cb(item, [], level + 1);
        return;
      }
      const children = item[childrenKey];
      if (!isNil(children)) {
        walker(item, children, level + 1);
      }
    });
  };

  root.forEach(item => {
    if (item[lazyKey]) return cb(item, [], 0);

    const children = item[childrenKey];
    !isNil(children) && walker(item, children, 0);
  });
}

export let removePopper: (() => void) | undefined;

export function createTablePopper(
  parentNode: HTMLElement | undefined,
  trigger: HTMLElement,
  popperContent: string,
  popperOptions: Partial<PopperOptions>,
  tooltipEffect?: string,
) {
  const { nextZIndex } = useZIndex();
  const ns = parentNode?.dataset.prefix;
  const scrollContainer = parentNode?.querySelector(`.${ns}-scrollbar__wrap`);

  const renderContent = (): HTMLDivElement => {
    const isLight = tooltipEffect === 'light';
    const content = document.createElement('div');
    content.className = `${ns}-popper ${isLight ? 'is-light' : 'is-dark'}`;
    popperContent = escapeHtml(popperContent);
    content.innerHTML = popperContent;
    content.style.zIndex = String(nextZIndex());
    // Avoid side effects caused by append to body
    parentNode?.append(content);
    return content;
  };

  const renderArrow = (): HTMLDivElement => {
    const arrow = document.createElement('div');
    arrow.className = `${ns}-popper__arrow`;
    return arrow;
  };

  let pop: Nullable<PopperInstance> = null;

  const showPopper = () => {
    pop && pop.update();
  };
  const content = renderContent();

  removePopper && removePopper();
  removePopper = () => {
    try {
      pop && pop.destroy();
      content && content.remove();
      trigger.removeEventListener('mouseenter', showPopper);
      trigger.removeEventListener('mouseleave', removePopper!);
      scrollContainer?.removeEventListener('scroll', removePopper!);
      removePopper = undefined;
    } catch {}
  };

  const arrow = renderArrow();
  content.append(arrow);
  pop = createPopper(trigger, content, {
    strategy: 'absolute',
    modifiers: [
      { name: 'offset', options: { offset: [0, 8] } },
      { name: 'arrow', options: { element: arrow, padding: 10 } },
    ],
    ...popperOptions,
  });

  trigger.addEventListener('mouseenter', showPopper);
  trigger.addEventListener('mouseleave', removePopper);
  scrollContainer?.addEventListener('scroll', removePopper);
  return pop;
}

function getCurrentColumns(column: TableColumnCtx): TableColumnCtx[] {
  return column.children ? flatMap(column.children, getCurrentColumns) : [column];
}

function getColSpan(colSpan: number, column: TableColumnCtx) {
  return colSpan + column.colSpan;
}

export const isFixedColumn = (
  index: number,
  fixed: string | boolean,
  store: any,
  realColumns?: TableColumnCtx[],
) => {
  let start = 0;
  let after = index;
  const columns = store.states.columns.value;
  if (realColumns) {
    // fixed column supported in grouped header
    const curColumns = getCurrentColumns(realColumns[index]);
    const preColumns = columns.slice(0, columns.indexOf(curColumns[0]));

    start = preColumns.reduce(getColSpan, 0);
    after = start + curColumns.reduce(getColSpan, 0) - 1;
  } else {
    start = index;
  }
  let fixedLayout;
  switch (fixed) {
    case 'left': {
      if (after < store.states.fixedLeafColumnsLength.value) {
        fixedLayout = 'left';
      }
      break;
    }
    case 'right': {
      if (
        start >=
        columns.length - store.states.rightFixedLeafColumnsLength.value
      ) {
        fixedLayout = 'right';
      }
      break;
    }
    default: {
      if (after < store.states.fixedLeafColumnsLength.value) {
        fixedLayout = 'left';
      } else if (
        start >=
        columns.length - store.states.rightFixedLeafColumnsLength.value
      ) {
        fixedLayout = 'right';
      }
    }
  }
  return fixedLayout
    ? {
      direction: fixedLayout,
      start,
      after,
    }
    : {};
};

export const getFixedColumnsClass = (
  namespace: string,
  index: number,
  fixed: string | boolean,
  store: Store,
  realColumns?: TableColumnCtx[],
  offset = 0,
) => {
  const classes: string[] = [];
  const { direction, start, after } = isFixedColumn(
    index,
    fixed,
    store,
    realColumns,
  );
  if (direction) {
    const isLeft = direction === 'left';
    classes.push(`${namespace}-fixed-column--${direction}`);
    if (
      isLeft &&
      after + offset === store.states.fixedLeafColumnsLength.value - 1
    ) {
      classes.push('is-last-column');
    } else if (
      !isLeft &&
      start - offset ===
        store.states.columns.value.length -
          store.states.rightFixedLeafColumnsLength.value
    ) {
      classes.push('is-first-column');
    }
  }
  return classes;
};

function getOffset(offset: number, column: TableColumnCtx) {
  return (
    offset +
    (column.realWidth === null || Number.isNaN(column.realWidth)
      ? Number(column.width)
      : column.realWidth)
  );
}

export function getFixedColumnOffset(
  index: number,
  fixed: string | boolean,
  store: any,
  realColumns?: TableColumnCtx[],
) {
  const {
    direction,
    start = 0,
    after = 0,
  } = isFixedColumn(index, fixed, store, realColumns);
  if (!direction) {
    return;
  }
  const styles: any = {};
  const isLeft = direction === 'left';
  const columns = store.states.columns.value;
  if (isLeft) {
    styles.left = columns.slice(0, start).reduce(getOffset, 0);
  } else {
    styles.right = columns
      .slice(after + 1)
      .reverse()
      .reduce(getOffset, 0);
  }
  return styles;
}

export function ensurePosition(style: Record<string, number | string>, key: string) {
  if (style && !Number.isNaN(style[key])) {
    style[key] = `${style[key]}px`;
  }
}
