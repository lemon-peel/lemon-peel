import { Fragment, defineComponent, getCurrentInstance, isVNode, onBeforeMount, onBeforeUnmount, onMounted, ref, inject } from 'vue';
import { isString } from '@lemon-peel/utils';

import { compose, mergeOptions } from '../util';
import { tableColumnProps } from './defaults';
import { cellStarts } from '../config';
import useWatcher from './watcherHelper';
import useRender from './renderHelper';

import type { Component } from 'vue';
import type { TableColumn, TableColumnCtx } from './defaults';
import { STORE_INJECTION_KEY, TABLE_INJECTION_KEY } from '../tokens';


let columnIdSeed = 1;

export default defineComponent({
  name: 'LpTableColumn',
  props: tableColumnProps,
  setup(props, { expose, slots }) {
    const instance = getCurrentInstance() as TableColumn;
    const columnConfig = ref<Partial<TableColumnCtx>>({});
    const table = inject(TABLE_INJECTION_KEY)!;
    const store = inject(STORE_INJECTION_KEY)!;

    const {
      registerNormalWatchers,
      registerComplexWatchers,
    } = useWatcher(props, columnConfig);

    const {
      columnId,
      isSubColumn,
      columnOrTableParent,
      setColumnWidth,
      setColumnForcedProps,
      setColumnRenders,
      getPropsData,
      getColumnLpIndex,
      realAlign,
      realHeaderAlign,
    } = useRender(table, props, slots);

    const parent = columnOrTableParent.value;
    columnId.value = `${parent.tableId || parent.columnId}_column_${columnIdSeed++}`;

    onBeforeMount(() => {
      isSubColumn.value = table !== parent;

      const type = props.type || 'default';
      const sortable = props.sortable === '' ? true : props.sortable;
      const defaults = {
        ...cellStarts[type as keyof typeof cellStarts],
        id: columnId.value,
        type,
        property: props.prop || props.property,
        align: realAlign,
        headerAlign: realHeaderAlign,
        showOverflowTooltip:
          props.showOverflowTooltip || props.showTooltipWhenOverflow,
        // filter 相关属性
        filterable: props.filters || props.filterMethod,
        filteredValue: [],
        filterPlacement: '',
        isColumnGroup: false,
        isSubColumn: false,
        filterOpened: false,
        // sort 相关属性
        sortable,
        // index 列
        index: props.index,
        // <lp-table-column key="xxx" />
        rawColumnKey: instance.vnode.key,
      };

      let column = getPropsData([
        'columnKey',
        'label',
        'className',
        'labelClassName',
        'type',
        'renderHeader',
        'formatter',
        'fixed',
        'resizable',
      ],
      ['sortMethod', 'sortBy', 'sortOrders'],
      ['selectable', 'reserveSelection'],
      [
        'filterMethod',
        'filters',
        'filterMultiple',
        'filterOpened',
        'filteredValue',
        'filterPlacement',
      ]);

      column = mergeOptions(defaults, column);
      // 注意 compose 中函数执行的顺序是从右到左
      const chains = compose(
        setColumnRenders,
        setColumnWidth,
        setColumnForcedProps,
      );

      column = chains(column as TableColumnCtx);
      columnConfig.value = column;

      // 注册 watcher
      registerNormalWatchers();
      registerComplexWatchers();
    });

    onMounted(() => {
      const parent = columnOrTableParent.value;
      const children = isSubColumn.value
        ? parent.vnode.el.children
        : parent.refs.hiddenColumns?.children;
      const getColumnIndex = () =>
        getColumnLpIndex(children || [], instance.vnode.el);
      columnConfig.value.getColumnIndex = getColumnIndex;
      const columnIndex = getColumnIndex();
      columnIndex > -1 &&
        store.actions.insertColumn(
          columnConfig.value as TableColumnCtx,
          isSubColumn.value ? parent.columnConfig.value : null,
        );
    });

    onBeforeUnmount(() => {
      store.actions.removeColumn(
        columnConfig.value as TableColumnCtx,
        isSubColumn.value ? parent.columnConfig.value : null,
      );
    });

    expose({
      columnId,
      columnConfig,
    });

    instance.columnId = columnId.value;
    instance.columnConfig = columnConfig;

    return () => {
      try {
        const renderDefault = slots.default!({
          row: {},
          column: {},
          rowIndex: -1,
        });

        if (!Array.isArray(renderDefault)) return <div />;

        const children = [];
        for (const childNode of renderDefault) {
          if (
            (childNode.type as Component).name === 'LpTableColumn' ||
            childNode.shapeFlag & 2
          ) {
            children.push(childNode);
          } else if (
            childNode.type === Fragment &&
            Array.isArray(childNode.children)
          ) {
            for (const vnode of childNode.children) {
              // No rendering when vnode is dynamic slot or text
              if (isVNode(vnode) && vnode?.patchFlag !== 1024 && !isString(vnode?.children)) {
                children.push(vnode);
              }
            }
          }
        }

        return <div>{children}</div>;
      } catch {
        return <div></div>;
      }
    };
  },
});
