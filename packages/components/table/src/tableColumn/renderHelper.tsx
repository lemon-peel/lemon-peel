import { Comment, computed, getCurrentInstance, h, inject, ref, unref, Fragment } from 'vue';
import { debugWarn } from '@lemon-peel/utils';
import { useNamespace } from '@lemon-peel/hooks';
import type { CellRenders } from '../config';
import { cellForced, defaultRenderCell, getDefaultClassName, treeCellPrefix } from '../config';
import { parseMinWidth, parseWidth } from '../util';
import { STORE_INJECTION_KEY } from '../tokens';

import type { Component, ComponentInternalInstance, SetupContext, VNodeChild } from 'vue';
import type { TableColumnCtx, TableColumnProps } from './defaults';
import type { RenderExpanded, TableVM } from '../table/defaults';
import type { TableColumn } from './defaults';

declare module 'vue' {
  interface VNode {
    vParent: ComponentInternalInstance;
  }
}

function useRender(table: TableVM, props: TableColumnProps, slots: SetupContext['slots']) {
  const vm = getCurrentInstance() as TableColumn;
  const store = inject(STORE_INJECTION_KEY)!;
  const columnId = ref('');
  const isSubColumn = ref(false);
  const realAlign = computed<string | null>(() => (props.align ? `is-${props.align}` : null));
  const realHeaderAlign = computed<string | null>(() =>  props.headerAlign ? `is-${props.headerAlign}` : realAlign.value);
  const ns = useNamespace('table');

  const columnOrTableParent = computed(() => {
    let parent: any = vm.vnode.vParent || vm.parent;
    while (parent && !parent.tableId && !parent.columnId) {
      parent = parent.vnode.vParent || parent.parent;
    }
    return parent;
  });

  const hasTreeColumn = computed<boolean>(() => {
    const { treeData } = store.states;
    const treeDataValue = treeData.value;
    return treeDataValue && Object.keys(treeDataValue).length > 0;
  });

  const realWidth = ref(parseWidth(props.width || ''));
  const realMinWidth = ref(parseMinWidth(props.minWidth));
  const setColumnWidth = (column: TableColumnCtx) => {
    if (realWidth.value) column.width = realWidth.value;
    if (realMinWidth.value) column.minWidth = realMinWidth.value;
    if (!realWidth.value && realMinWidth.value) column.width = undefined;
    if (!column.minWidth) column.minWidth = 80;

    column.realWidth = Number(
      column.width === undefined ? column.minWidth : column.width,
    );
    return column;
  };

  const setColumnForcedProps = (column: TableColumnCtx) => {
    // 对于特定类型的 column，某些属性不允许设置
    const type = column.type;
    const source = cellForced[type] || {} as CellRenders;

    Object.keys(source)
      .forEach(prop => {
        const value = source[prop as keyof CellRenders];
        if (prop !== 'className' && value !== undefined) {
          column[prop as 'type'] = value as any;
        }
      });

    const className = getDefaultClassName(type as any);

    if (className) {
      const forceClass = `${unref(ns.namespace)}-${className}`;
      column.className = column.className
        ? `${column.className} ${forceClass}`
        : forceClass;
    }
    return column;
  };

  const checkSubColumn = (children: VNodeChild) => {
    const check = (item: VNodeChild) => {
      if (item
        && typeof item === 'object'
        && !Array.isArray(item)
        && (item.type as Component).name === 'LpTableColumn') {
        item.vParent = vm;
      }
    };

    if (Array.isArray(children)) {
      children.forEach(child => check(child));
    } else {
      check(children);
    }
  };

  const setColumnRenders = (column: TableColumnCtx) => {
    // renderHeader 属性不推荐使用。
    if (props.renderHeader) {
      debugWarn(
        'TableColumn',
        'Comparing to render-header, scoped-slot header is easier to use. We recommend users to use scoped-slot header.',
      );
    } else if (column.type !== 'selection') {
      column.renderHeader = scope => {
        // help render
        vm.columnConfig.value.label;
        const renderHeader = slots.header;
        return renderHeader ? renderHeader(scope) : <Fragment>{column.label}</Fragment> ;
      };
    }

    let originRenderCell = column.renderCell;

    if (column.type === 'expand') {
      // 对于展开行，renderCell 不允许配置的。在上一步中已经设置过，这里需要简单封装一下。
      column.renderCell = data =>
        (<div class="cell">{originRenderCell(data)}</div>);

      table.renderExpanded = (data => {
        return slots.default ? slots.default(data) : null;
      }) as RenderExpanded;
      return column;

    }

    originRenderCell = originRenderCell || defaultRenderCell;

    // 对 renderCell 进行包装
    column.renderCell = data => {
      console.log('renderCell', data);
      let children: VNodeChild;
      if (slots.default) {
        const vnodes = slots.default(data);
        children = vnodes.some(v => v.type !== Comment)
          ? vnodes
          : originRenderCell(data);
      } else {
        children = originRenderCell(data);
      }

      const shouldCreatePlaceholder =
        hasTreeColumn.value &&
        data.cellIndex === 0 &&
        data.column.type !== 'selection';
      const prefix = treeCellPrefix(data, shouldCreatePlaceholder);
      const props = {
        class: 'cell',
        style: {},
      };
      if (column.showOverflowTooltip) {
        props.class = `${props.class} ${unref(ns.namespace)}-tooltip`;
        props.style = {
          width: `${
            (data.column.realWidth || Number(data.column.width)) - 1
          }px`,
        };
      }

      checkSubColumn(children);
      return h('div', props, [prefix, children]);
    };

    return column;
  };

  const getPropsData = (...propsKey: (keyof TableColumnProps)[][]) => {
    return ([] as (keyof TableColumnProps)[])
      .concat(...propsKey)
      .reduce((prev, cur) => {
        prev[cur] = props[cur];
        return prev;
      }, {} as Record<string, any>);
  };

  const getColumnLpIndex = (children: any[], child: any) => {
    return Array.prototype.indexOf.call(children, child);
  };

  return {
    columnId,
    realAlign,
    isSubColumn,
    realHeaderAlign,
    columnOrTableParent,
    setColumnWidth,
    setColumnForcedProps,
    setColumnRenders,
    getPropsData,
    getColumnLpIndex,
  };
}

export default useRender;
