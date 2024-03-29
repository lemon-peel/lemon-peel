import { computed, getCurrentInstance, ref, shallowRef, unref, watch } from 'vue';
import { debounce } from 'lodash';
import { isNumber } from '@lemon-peel/utils';
import { FixedDir } from '../constants';

import type { Ref } from 'vue';
import type { TableV2Props } from '../table';
import type {
  RowExpandParams,
  RowHeightChangedParams,
  RowHoverParams,
} from '../row';
import type { FixedDirection, KeyType } from '../types';
import type { OnRowRenderedParams } from '../grid';
import type { TableGridInstance } from '../tableGrid';

type Heights = Record<KeyType, number>;
type GridInstanceRef = Ref<TableGridInstance | undefined>;

type UseRowProps = {
  mainTableRef: GridInstanceRef;
  leftTableRef: GridInstanceRef;
  rightTableRef: GridInstanceRef;

  onMaybeEndReached: () => void;
};

export const useRow = (
  props: TableV2Props,
  { mainTableRef, leftTableRef, rightTableRef, onMaybeEndReached }: UseRowProps,
) => {
  const vm = getCurrentInstance()!;
  const { emit } = vm;
  const isResetting = shallowRef(false);
  const hoveringRowKey = shallowRef<KeyType | null>(null);
  const expandedRowKeys = ref<KeyType[]>(props.defaultExpandedRowKeys || []);
  const lastRenderedRowIndex = ref(-1);
  const resetIndex = shallowRef<number | null>(null);
  const rowHeights = ref<Heights>({});
  const pendingRowHeights = ref<Heights>({});
  const leftTableHeights = shallowRef<Heights>({});
  const mainTableHeights = shallowRef<Heights>({});
  const rightTableHeights = shallowRef<Heights>({});
  const isDynamic = computed(() => isNumber(props.estimatedRowHeight));

  function onRowsRendered(params: OnRowRenderedParams) {
    props.onRowsRendered?.(params);

    if (params.rowCacheEnd > unref(lastRenderedRowIndex)) {
      lastRenderedRowIndex.value = params.rowCacheEnd;
    }
  }

  function onRowHovered({ hovered, rowKey }: RowHoverParams) {
    hoveringRowKey.value = hovered ? rowKey : null;
  }

  function onRowExpanded({
    expanded,
    rowData,
    rowIndex,
    rowKey,
  }: RowExpandParams) {
    const tmpExpandedRowKeys = [...unref(expandedRowKeys)];
    const currentKeyIndex = tmpExpandedRowKeys.indexOf(rowKey);
    if (expanded) {
      if (currentKeyIndex === -1) tmpExpandedRowKeys.push(rowKey);
    } else {
      if (currentKeyIndex > -1) tmpExpandedRowKeys.splice(currentKeyIndex, 1);
    }
    expandedRowKeys.value = tmpExpandedRowKeys;

    emit('update:expandedRowKeys', tmpExpandedRowKeys);
    props.onRowExpand?.({
      expanded,
      rowData,
      rowIndex,
      rowKey,
    });
    // If this is not controlled, then use this to notify changes
    props.onExpandedRowsChange?.(tmpExpandedRowKeys);
  }

  function resetAfterIndex(index: number, forceUpdate = false) {
    if (!unref(isDynamic)) return
    ;for (const tableRef of [mainTableRef, leftTableRef, rightTableRef]) {
      const table = unref(tableRef);
      if (table) table.resetAfterRowIndex(index, forceUpdate);
    }
  }

  const flushingRowHeights = debounce(() => {
    isResetting.value = true;
    rowHeights.value = { ...unref(rowHeights), ...unref(pendingRowHeights) };
    resetAfterIndex(unref(resetIndex)!, false);
    pendingRowHeights.value = {};
    // force update
    resetIndex.value = null;
    mainTableRef.value?.forceUpdate();
    leftTableRef.value?.forceUpdate();
    rightTableRef.value?.forceUpdate();
    vm.proxy?.$forceUpdate();
    isResetting.value = false;
  }, 0);

  function resetHeights(rowKey: KeyType, height: number, rowIdx: number) {
    const resetIdx = unref(resetIndex);
    if (resetIdx === null) {
      resetIndex.value = rowIdx;
    } else {
      if (resetIdx > rowIdx) {
        resetIndex.value = rowIdx;
      }
    }

    pendingRowHeights.value[rowKey] = height;
  }

  function onRowHeightChange(
    { rowKey, height, rowIndex }: RowHeightChangedParams,
    fixedDir: FixedDirection,
  ) {
    if (fixedDir) {
      if (fixedDir === FixedDir.RIGHT) {
        rightTableHeights.value[rowKey] = height;
      } else {
        leftTableHeights.value[rowKey] = height;
      }
    } else {
      mainTableHeights.value[rowKey] = height;
    }

    const maximumHeight = Math.max(
      ...[leftTableHeights, rightTableHeights, mainTableHeights].map(
        records => records.value[rowKey] || 0,
      ),
    );

    if (unref(rowHeights)[rowKey] !== maximumHeight) {
      resetHeights(rowKey, maximumHeight, rowIndex);
      flushingRowHeights();
    }
  }
  // when rendered row changes, maybe reaching the bottom
  watch(lastRenderedRowIndex, () => onMaybeEndReached());

  return {
    hoveringRowKey,
    expandedRowKeys,
    lastRenderedRowIndex,
    isDynamic,
    isResetting,
    rowHeights,

    resetAfterIndex,
    onRowExpanded,
    onRowHovered,
    onRowsRendered,
    onRowHeightChange,
  };
};

export type UseRowReturn = ReturnType<typeof useRow>;
