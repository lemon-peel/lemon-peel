import { computed, ref, shallowRef, toRef, unref, watch } from 'vue';
import { isArray } from '@lemon-peel/utils';
import { useColumns, useData, useRow, useScrollbar, useStyles } from './composables';

import type { TableV2Props } from './table';
import type { TableGridInstance } from './tableGrid';

function useTable(props: TableV2Props) {
  const mainTableRef = ref<TableGridInstance>();
  const leftTableRef = ref<TableGridInstance>();
  const rightTableRef = ref<TableGridInstance>();
  const {
    columns,
    columnsStyles,
    columnsTotalWidth,
    fixedColumnsOnLeft,
    fixedColumnsOnRight,
    hasFixedColumns,
    mainColumns,

    onColumnSorted,
  } = useColumns(props, toRef(props, 'columns'), toRef(props, 'fixed'));

  const {
    expandedRowKeys,
    hoveringRowKey,
    lastRenderedRowIndex,
    isDynamic,
    isResetting,
    rowHeights,

    resetAfterIndex,
    onRowExpanded,
    onRowHeightChange,
    onRowHovered,
    onRowsRendered,
  } = useRow(props, {
    mainTableRef,
    leftTableRef,
    rightTableRef,
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    onMaybeEndReached,
  });

  const { data, depthMap } = useData(props, {
    expandedRowKeys,
    lastRenderedRowIndex,
    resetAfterIndex,
  });

  const {
    bodyWidth,
    fixedTableHeight,
    mainTableHeight,
    leftTableWidth,
    rightTableWidth,
    headerWidth,
    rowsHeight,
    windowHeight,
    footerHeight,
    emptyStyle,
    rootStyle,
    headerHeight,
  } = useStyles(props, {
    columnsTotalWidth,
    data,
    fixedColumnsOnLeft,
    fixedColumnsOnRight,
  });

  const {
    scrollTo,
    scrollToLeft,
    scrollToTop,
    scrollToRow,
    onScroll,
    onVerticalScroll,
    scrollPos,
  } = useScrollbar(props, {
    mainTableRef,
    leftTableRef,
    rightTableRef,
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    onMaybeEndReached,
  });


  function onMaybeEndReached() {
    const { onEndReached } = props;
    if (!onEndReached) return;

    const { scrollTop } = unref(scrollPos);

    const totalHeight = unref(rowsHeight);
    const clientHeight = unref(windowHeight);

    const heightUntilEnd =
      totalHeight - (scrollTop + clientHeight) + props.hScrollbarSize;

    if (
      unref(lastRenderedRowIndex) >= 0 &&
      totalHeight === scrollTop + unref(mainTableHeight) - unref(headerHeight)
    ) {
      onEndReached(heightUntilEnd);
    }
  }

  // state
  const isScrolling = shallowRef(false);

  // DOM/Component refs
  const containerRef = ref();

  const showEmpty = computed(() => {
    const noData = unref(data).length === 0;

    return isArray(props.fixedData)
      ? props.fixedData.length === 0 && noData
      : noData;
  });

  const getRowHeight = (rowIndex: number) => {
    const { estimatedRowHeight, rowHeight, rowKey } = props;

    if (!estimatedRowHeight) return rowHeight;

    return (
      unref(rowHeights)[unref(data)[rowIndex][rowKey]] || estimatedRowHeight
    );
  };

  // events

  watch(
    () => props.expandedRowKeys,
    value => (expandedRowKeys.value = value),
    {
      deep: true,
    },
  );

  return {
    // models
    columns,
    containerRef,
    mainTableRef,
    leftTableRef,
    rightTableRef,
    // states
    isDynamic,
    isResetting,
    isScrolling,
    hoveringRowKey,
    hasFixedColumns,
    // records
    columnsStyles,
    columnsTotalWidth,
    data,
    expandedRowKeys,
    depthMap,
    fixedColumnsOnLeft,
    fixedColumnsOnRight,
    mainColumns,
    // metadata
    bodyWidth,
    emptyStyle,
    rootStyle,
    headerWidth,
    footerHeight,
    mainTableHeight,
    fixedTableHeight,
    leftTableWidth,
    rightTableWidth,
    // flags
    showEmpty,

    // methods
    getRowHeight,

    // event handlers
    onColumnSorted,
    onRowHovered,
    onRowExpanded,
    onRowsRendered,
    onRowHeightChange,
    // use scrollbars
    scrollTo,
    scrollToLeft,
    scrollToTop,
    scrollToRow,
    onScroll,
    onVerticalScroll,
  };
}

export { useTable };

export type UseTableReturn = ReturnType<typeof useTable>;
