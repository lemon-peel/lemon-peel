import { nextTick, ref } from 'vue';
import { isClient } from '@vueuse/core';
import { parseHeight } from '../util';

import type { Store } from '../store';

import type { TableHeaderInstance } from '../tableHeader';
import type { TableVM } from '../table/defaults';
import type { TableColumnCtx } from '../tableColumn/defaults';


class TableLayout {
  observers: TableHeaderInstance[] = [];

  columns: TableColumnCtx[] = [];

  height = ref<number | null>(null);

  scrollX = ref<boolean>(false);

  scrollY = ref<boolean>(false);

  bodyWidth = ref<number | null>(null);

  fixedWidth = ref<number | null>(null);

  rightFixedWidth = ref<number | null>(null);

  gutterWidth = 0;

  table: TableVM;

  store: Store;

  fit: boolean;

  showHeader: boolean;

  constructor(options: {
    table: TableVM;
    store: Store;
    fit: boolean;
    showHeader: boolean;
  }) {
    this.table = options.table;
    this.store = options.store;
    this.fit = options.fit;
    this.showHeader = options.showHeader;
  }

  updateScrollY() {
    const height = this.height.value;
    /**
     * When the height is not initialized, it is null.
     * After the table is initialized, when the height is not configured, the height is 0.
     */
    if (height === null) return false;
    const scrollBarRef = this.table.refs.scrollBarRef;
    if (this.table.vnode.el && scrollBarRef) {
      let scrollY = true;
      const prevScrollY = this.scrollY.value;
      scrollY =
        scrollBarRef.wrap$.scrollHeight > scrollBarRef.wrap$.clientHeight;
      this.scrollY.value = scrollY;
      return prevScrollY !== scrollY;
    }
    return false;
  }

  setHeight(value: string | number | null, prop = 'height'): any {
    if (!isClient) return;
    const el = this.table.vnode.el!;
    value = parseHeight(value!);
    this.height.value = Number(value);

    if (!el && (value || value === 0))
      return nextTick(() => this.setHeight(value, prop));

    if (typeof value === 'number') {
      el.style[prop] = `${value}px`;
      this.updateElsHeight();
    } else if (typeof value === 'string') {
      el.style[prop] = value;
      this.updateElsHeight();
    }
  }

  setMaxHeight(value: string | number) {
    this.setHeight(value, 'max-height');
  }

  getFlattenColumns(): TableColumnCtx[] {
    const flattenColumns: TableColumnCtx[] = [];
    const columns = this.store.states.columns.value;
    columns.forEach((column: TableColumnCtx) => {
      if (column.isColumnGroup) {
        // eslint-disable-next-line prefer-spread
        flattenColumns.push.apply(flattenColumns, column.columns);
      } else {
        flattenColumns.push(column);
      }
    });

    return flattenColumns;
  }

  updateElsHeight() {
    this.updateScrollY();
    this.notifyObservers('scrollable');
  }

  // eslint-disable-next-line class-methods-use-this
  headerDisplayNone(el: HTMLElement) {
    if (!el) return true;
    let headerChild = el;
    while (headerChild.tagName !== 'DIV') {
      if (getComputedStyle(headerChild).display === 'none') {
        return true;
      }
      headerChild = headerChild.parentElement!;
    }
    return false;
  }

  updateColumnsWidth() {
    if (!isClient) return;
    const fit = this.fit;
    const bodyWidth = this.table.vnode.el!.clientWidth;
    let bodyMinWidth = 0;

    const flattenColumns = this.getFlattenColumns();
    const flexColumns = flattenColumns.filter(
      column => typeof column.width !== 'number',
    );
    flattenColumns.forEach(column => {
      // Clean those columns whose width changed from flex to unflex
      if (typeof column.width === 'number' && column.realWidth)
        column.realWidth = null;
    });
    if (flexColumns.length > 0 && fit) {
      flattenColumns.forEach(column => {
        bodyMinWidth += Number(column.width || column.minWidth || 80);
      });
      if (bodyMinWidth <= bodyWidth) {
        // DON'T HAVE SCROLL BAR
        this.scrollX.value = false;

        const totalFlexWidth = bodyWidth - bodyMinWidth;

        if (flexColumns.length === 1) {
          flexColumns[0].realWidth =
            Number(flexColumns[0].minWidth || 80) + totalFlexWidth;
        } else {
          const allColumnsWidth = flexColumns.reduce(
            (prev, column) => prev + Number(column.minWidth || 80),
            0,
          );
          const flexWidthPerPixel = totalFlexWidth / allColumnsWidth;
          let noneFirstWidth = 0;

          flexColumns.forEach((column, index) => {
            if (index === 0) return;
            const flexWidth = Math.floor(
              Number(column.minWidth || 80) * flexWidthPerPixel,
            );
            noneFirstWidth += flexWidth;
            column.realWidth = Number(column.minWidth || 80) + flexWidth;
          });

          flexColumns[0].realWidth =
            Number(flexColumns[0].minWidth || 80) +
            totalFlexWidth -
            noneFirstWidth;
        }
      } else {
        // HAVE HORIZONTAL SCROLL BAR
        this.scrollX.value = true;
        flexColumns.forEach(column => {
          column.realWidth = Number(column.minWidth);
        });
      }

      this.bodyWidth.value = Math.max(bodyMinWidth, bodyWidth);
      this.table.state.resizeState.value.width = this.bodyWidth.value;
    } else {
      flattenColumns.forEach(column => {
        column.realWidth = !column.width && !column.minWidth ? 80 : Number(column.width || column.minWidth);
        bodyMinWidth += column.realWidth;
      });
      this.scrollX.value = bodyMinWidth > bodyWidth;

      this.bodyWidth.value = bodyMinWidth;
    }

    const fixedColumns = this.store.states.fixedColumns.value;

    if (fixedColumns.length > 0) {
      let fixedWidth = 0;
      fixedColumns.forEach(column => {
        fixedWidth += Number(column.realWidth || column.width);
      });

      this.fixedWidth.value = fixedWidth;
    }

    const rightFixedColumns = this.store.states.rightFixedColumns.value;
    if (rightFixedColumns.length > 0) {
      let rightFixedWidth = 0;
      rightFixedColumns.forEach(column => {
        rightFixedWidth += Number(column.realWidth || column.width);
      });

      this.rightFixedWidth.value = rightFixedWidth;
    }
    this.notifyObservers('columns');
  }

  addObserver(observer: TableHeaderInstance) {
    this.observers.push(observer);
  }

  removeObserver(observer: TableHeaderInstance) {
    const index = this.observers.indexOf(observer);
    if (index !== -1) {
      this.observers.splice(index, 1);
    }
  }

  notifyObservers(event: string) {
    const observers = this.observers;
    observers.forEach(observer => {
      switch (event) {
        case 'columns': {
          observer.state?.onColumnsChange(this);
          break;
        }
        case 'scrollable': {
          observer.state?.onScrollableChange(this);
          break;
        }
        default: {
          throw new Error(`Table Layout don't have event ${event}.`);
        }
      }
    });
  }
}

export default TableLayout;
