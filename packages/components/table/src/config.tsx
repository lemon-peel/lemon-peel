
import LpCheckbox from '@lemon-peel/components/checkbox';
import { LpIcon } from '@lemon-peel/components/icon';
import { ArrowRight, Loading } from '@element-plus/icons-vue';
import { getProp, throwError } from '@lemon-peel/utils';

import type { VNode, VNodeChild } from 'vue';
import type { TableColumnCtx } from './tableColumn/defaults';
import type { RenderHeaderData, RenderRowData } from './table/defaults';

const defaultClassNames = {
  selection: 'table-column--selection',
  expand: 'table__expand-column',
};

export const cellStarts = {
  default: {
    order: '',
  },
  selection: {
    width: 48,
    minWidth: 48,
    realWidth: 48,
    order: '',
  },
  expand: {
    width: 48,
    minWidth: 48,
    realWidth: 48,
    order: '',
  },
  index: {
    width: 48,
    minWidth: 48,
    realWidth: 48,
    order: '',
  },
};

export const getDefaultClassName = (type: keyof typeof defaultClassNames) => {
  return defaultClassNames[type] || '';
};

export type CellRenders = {
  renderHeader?(data: RenderHeaderData): VNodeChild;
  renderCell?(data: RenderRowData): VNodeChild;
  sortable?: boolean;
  resizable?: boolean;
};

// 这些选项不应该被覆盖
export const cellForced: Record<string, CellRenders> = {
  selection: {
    renderHeader({ store }: RenderHeaderData) {
      if (!store) return throwError('LpTable', `'store' is ${typeof store}`);

      function isDisabled() {
        return store!.states.data.value
          && store!.states.data.value.length === 0;
      }

      return <LpCheckbox {...{
        disabled: isDisabled(),
        size: store.states.tableSize.value,
        indeterminate:
          store.states.selection.value.length > 0 &&
          !store.states.isAllSelected.value,
        'onUpdate:checked': store.actions.toggleAllSelection,
        checked: store.states.isAllSelected.value,
      }} />;
    },
    renderCell({ row, column, store, rowIndex }: RenderRowData) {
      return <LpCheckbox {...{
        disabled: column.selectable
          ? !column.selectable.call(null, row, rowIndex)
          : false,
        size: store.states.tableSize.value,
        'onUpdate:checked': () => {
          store.actions.rowSelectedChanged(row);
        },
        onClick: (e: Event) => e.stopPropagation(),
        checked: store.watcher.isSelected(row),
      }}/>;
    },
    sortable: false,
    resizable: false,
  },
  index: {
    renderHeader({ column }: RenderHeaderData) {
      return column.label || '#';
    },
    renderCell({ column, rowIndex }: RenderRowData) {
      let i = rowIndex + 1;
      const index = column.index;

      if (typeof index === 'number') {
        i = rowIndex + index;
      } else if (typeof index === 'function') {
        i = index(rowIndex);
      }
      return <div>{i}</div>;
    },
    sortable: false,
  },
  expand: {
    renderHeader({ column }: { column: TableColumnCtx }) {
      return column.label || '';
    },
    renderCell({ row, store, expanded }: RenderRowData) {
      const { ns } = store;
      const classes = [ns.e('expand-icon')];
      if (expanded) {
        classes.push(ns.em('expand-icon', 'expanded'));
      }

      const callback = function (e: Event) {
        e.stopPropagation();
        store.expand.toggleRowExpansion(row);
      };

      return <div class={classes} onClick={callback}>
        <LpIcon><ArrowRight /></LpIcon>
      </div>;
    },
    sortable: false,
    resizable: false,
  },
};

export function defaultRenderCell({ row, column, rowIndex }: RenderRowData) {
  const property = column.property;
  const value = property && getProp(row, property).value;
  if (column && column.formatter) {
    return column.formatter(row, column, value, rowIndex);
  }
  return value?.toString?.() || '';
}

export function treeCellPrefix(
  { row, store, treeNode }: RenderRowData,
  createPlacehoder = false,
) {
  const { ns } = store;

  if (!treeNode) {
    return createPlacehoder ? [<span class={ns.e('placeholder')}></span>] : null;
  }

  const ele: VNode[] = [];
  const onClick = (e: MouseEvent) => {
    e.stopPropagation();
    treeNode && !treeNode.loading
      && store.tree.loadOrToggle(row);
  };

  if (treeNode && treeNode.indent) {
    ele.push(<span class={ns.e('indent')} style={{ 'padding-left': `${treeNode.indent}px` }}></span>);
  }

  if (treeNode && (treeNode.children.length || treeNode.lazy)) {
    const expandClasses = [
      ns.e('expand-icon'),
      treeNode?.expanded ? ns.em('expand-icon', 'expanded') : '',
    ];

    ele.push(<div {...{ class: expandClasses, onClick }}>
      <LpIcon class={{ [ns.is('loading')]: !!(treeNode?.loading) }}>
        {treeNode?.loading ? <Loading /> : <ArrowRight />}
      </LpIcon>
    </div>);
  } else {
    ele.push(<span class={ns.e('placeholder')}></span>);
  }
  return ele;
}


