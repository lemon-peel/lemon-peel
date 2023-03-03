import { defineComponent, provide, unref } from 'vue';
import { useNamespace } from '@lemon-peel/hooks/src';
import { useTable } from './useTable';
import { TableV2InjectionKey } from './tokens';
import { tableV2Props } from './table';

// renderers
import MainTable from './renderers/MainTable';
import LeftTable from './renderers/LeftTable';
import RightTable from './renderers/RightTable';
import Row from './renderers/Row';
import Cell from './renderers/Cell';
import Header from './renderers/Header';
import HeaderCell from './renderers/HeaderCell';
import Footer from './renderers/Footer';
import Empty from './renderers/Empty';
import Overlay from './renderers/Overlay';

import type { TableGridRowSlotParams } from './tableGrid';
import type { ScrollStrategy } from './composables/useScrollbar';
import type { TableV2HeaderRendererParams, TableV2HeaderRowCellRendererParams, TableV2RowCellRenderParam } from './components';

const COMPONENT_NAME = 'LpTableV2';

const TableV2 = defineComponent({
  name: COMPONENT_NAME,
  props: tableV2Props,
  setup(props, { slots, expose }) {
    const ns = useNamespace('table-v2');

    const {
      columnsStyles,
      fixedColumnsOnLeft,
      fixedColumnsOnRight,
      mainColumns,
      mainTableHeight,
      fixedTableHeight,
      leftTableWidth,
      rightTableWidth,
      data,
      depthMap,
      expandedRowKeys,
      hasFixedColumns,
      hoveringRowKey,
      mainTableRef,
      leftTableRef,
      rightTableRef,
      isDynamic,
      isResetting,
      isScrolling,

      bodyWidth,
      emptyStyle,
      rootStyle,
      headerWidth,
      footerHeight,

      showEmpty,

      // exposes
      scrollTo,
      scrollToLeft,
      scrollToTop,
      scrollToRow,

      getRowHeight,
      onColumnSorted,
      onRowHeightChange,
      onRowHovered,
      onRowExpanded,
      onRowsRendered,
      onScroll,
      onVerticalScroll,
    } = useTable(props);

    expose({
      /**
       * @description scroll to a given position
       * @params params {{ scrollLeft?: number, scrollTop?: number }} where to scroll to.
       */
      scrollTo,
      /**
       * @description scroll to a given position horizontally
       * @params scrollLeft {Number} where to scroll to.
       */
      scrollToLeft,
      /**
       * @description scroll to a given position vertically
       * @params scrollTop { Number } where to scroll to.
       */
      scrollToTop,
      /**
       * @description scroll to a given row
       * @params row {Number} which row to scroll to
       * @params @optional strategy {ScrollStrategy} use what strategy to scroll to
       */
      scrollToRow,
    });

    provide(TableV2InjectionKey, {
      ns,
      isResetting,
      hoveringRowKey,
      isScrolling,
    });

    return () => {
      const {
        cache,
        cellProps,
        estimatedRowHeight,
        expandColumnKey,
        fixedData,
        headerHeight,
        headerClass,
        headerProps,
        headerCellProps,
        sortBy,
        sortState,
        rowHeight,
        rowClass,
        rowEventHandlers,
        rowKey,
        rowProps,
        scrollbarAlwaysOn,
        indentSize,
        iconSize,
        useIsScrolling,
        vScrollbarSize,
        width,
      } = props;

      const localData = unref(data);

      const mainTableProps = {
        cache,
        class: ns.e('main'),
        columns: unref(mainColumns),
        data: localData,
        fixedData,
        estimatedRowHeight,
        bodyWidth: unref(bodyWidth),
        headerHeight,
        headerWidth: unref(headerWidth),
        height: unref(mainTableHeight),
        mainTableRef,
        rowKey,
        rowHeight,
        scrollbarAlwaysOn,
        scrollbarStartGap: 2,
        scrollbarEndGap: vScrollbarSize,
        useIsScrolling,
        width,
        getRowHeight,
        onRowsRendered,
        onScroll,
      };

      const leftColumnsWidth = unref(leftTableWidth);
      const localFixedTableHeight = unref(fixedTableHeight);

      const leftTableProps = {
        cache,
        class: ns.e('left'),
        columns: unref(fixedColumnsOnLeft),
        data: localData,
        estimatedRowHeight,
        leftTableRef,
        rowHeight,
        bodyWidth: leftColumnsWidth,
        headerWidth: leftColumnsWidth,
        headerHeight,
        height: localFixedTableHeight,
        rowKey,
        scrollbarAlwaysOn,
        scrollbarStartGap: 2,
        scrollbarEndGap: vScrollbarSize,
        useIsScrolling,
        width: leftColumnsWidth,
        getRowHeight,
        onScroll: onVerticalScroll,
      };

      const rightColumnsWidth = unref(rightTableWidth);
      const rightColumnsWidthWithScrollbar = rightColumnsWidth + vScrollbarSize;

      const rightTableProps = {
        cache,
        class: ns.e('right'),
        columns: unref(fixedColumnsOnRight),
        data: localData,
        estimatedRowHeight,
        rightTableRef,
        rowHeight,
        bodyWidth: rightColumnsWidthWithScrollbar,
        headerWidth: rightColumnsWidthWithScrollbar,
        headerHeight,
        height: localFixedTableHeight,
        rowKey,
        scrollbarAlwaysOn,
        scrollbarStartGap: 2,
        scrollbarEndGap: vScrollbarSize,
        width: rightColumnsWidthWithScrollbar,
        style: {
          [`--${unref(ns.namespace)}-table-scrollbar-size`]: `${vScrollbarSize}px`,
        },
        useIsScrolling,
        getRowHeight,
        onScroll: onVerticalScroll,
      };
      const localColumnsStyles = unref(columnsStyles);

      const tableRowProps = {
        ns,
        depthMap: unref(depthMap),
        columnsStyles: localColumnsStyles,
        expandColumnKey,
        expandedRowKeys: unref(expandedRowKeys),
        estimatedRowHeight,
        hasFixedColumns: unref(hasFixedColumns),
        hoveringRowKey: unref(hoveringRowKey),
        rowProps,
        rowClass,
        rowKey,
        rowEventHandlers,
        onRowHovered,
        onRowExpanded,
        onRowHeightChange,
      };

      const tableCellProps = {
        cellProps,
        expandColumnKey,
        indentSize,
        iconSize,
        rowKey,
        expandedRowKeys: unref(expandedRowKeys),
        ns,
      };

      const tableHeaderProps = {
        ns,
        headerClass,
        headerProps,
        columnsStyles: localColumnsStyles,
      };

      const tableHeaderCellProps = {
        ns,

        sortBy,
        sortState,
        headerCellProps,
        onColumnSorted,
      };

      const tableSlots = {
        row: (params: TableGridRowSlotParams) => (
          <Row {...params} {...tableRowProps}>
            {{
              row: slots.row,
              cell: (ceelParams: TableV2RowCellRenderParam) =>
                slots.cell ? (
                  <Cell
                    {...ceelParams}
                    {...tableCellProps}
                    style={localColumnsStyles[ceelParams.column.key]}
                  >
                    {slots.cell(ceelParams)}
                  </Cell>
                ) : (
                  <Cell
                    {...ceelParams}
                    {...tableCellProps}
                    style={localColumnsStyles[ceelParams.column.key]}
                  />
                ),
            }}
          </Row>
        ),
        header: (params: TableV2HeaderRendererParams) => (
          <Header {...params} {...tableHeaderProps}>
            {{
              header: slots.header,
              cell: (cellParams: TableV2HeaderRowCellRendererParams) =>
                slots['header-cell'] ? (
                  <HeaderCell
                    {...cellParams}
                    {...tableHeaderCellProps}
                    style={localColumnsStyles[cellParams.column.key]}
                  >
                    {slots['header-cell'](cellParams)}
                  </HeaderCell>
                ) : (
                  <HeaderCell
                    {...cellParams}
                    {...tableHeaderCellProps}
                    style={localColumnsStyles[cellParams.column.key]}
                  />
                ),
            }}
          </Header>
        ),
      };

      const rootKls = [
        props.class,
        ns.b(),
        ns.e('root'),
        {
          [ns.is('dynamic')]: unref(isDynamic),
        },
      ];

      const footerProps = {
        class: ns.e('footer'),
        style: unref(footerHeight),
      };

      return (
        <div class={rootKls} style={unref(rootStyle)}>
          <MainTable {...mainTableProps}>{tableSlots}</MainTable>
          <LeftTable {...leftTableProps}>{tableSlots}</LeftTable>
          <RightTable {...rightTableProps}>{tableSlots}</RightTable>
          {slots.footer && (
            <Footer {...footerProps}>{{ default: slots.footer }}</Footer>
          )}
          {unref(showEmpty) && (
            <Empty class={ns.e('empty')} style={unref(emptyStyle)}>
              {{ default: slots.empty }}
            </Empty>
          )}
          {slots.overlay && (
            <Overlay class={ns.e('overlay')}>
              {{ default: slots.overlay }}
            </Overlay>
          )}
        </div>
      );
    };
  },
});

export default TableV2;

export type TableV2Instance = InstanceType<typeof TableV2> & {
  /**
   * @description scroll to a given position
   * @params params {{ scrollLeft?: number, scrollTop?: number }} where to scroll to.
   */
  scrollTo: (parameter: { scrollLeft?: number, scrollTop?: number }) => void;
  /**
   * @description scroll to a given position horizontally
   * @params scrollLeft {Number} where to scroll to.
   */
  scrollToLeft: (scrollLeft: number) => void;
  /**
   * @description scroll to a given position vertically
   * @params scrollTop { Number } where to scroll to.
   */
  scrollToTop: (scrollTop: number) => void;
  /**
   * @description scroll to a given row
   * @params row {Number} which row to scroll to
   * @params strategy {ScrollStrategy} use what strategy to scroll to
   */
  scrollToRow(row: number, strategy?: ScrollStrategy): void;
};
