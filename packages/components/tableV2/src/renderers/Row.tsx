import { Row } from '../components';
import { tryCall } from '../utils';

import type { FunctionalComponent, UnwrapNestedRefs } from 'vue';
import type { CssNamespace } from '@lemon-peel/hooks';
import type { UseTableReturn } from '../useTable';
import type { TableV2Props } from '../table';
import type { TableGridRowSlotParams } from '../tableGrid';

type RowRendererProps = TableGridRowSlotParams &
Pick<
TableV2Props,
| 'expandColumnKey'
| 'estimatedRowHeight'
| 'rowProps'
| 'rowClass'
| 'rowKey'
| 'rowEventHandlers'
> &
UnwrapNestedRefs<
Pick<
UseTableReturn,
| 'depthMap'
| 'expandedRowKeys'
| 'hasFixedColumns'
| 'hoveringRowKey'
| 'onRowHovered'
| 'onRowExpanded'
| 'columnsStyles'
>
> & {
  ns: CssNamespace;
};

const RowRenderer: FunctionalComponent<RowRendererProps> = (
  properties,
  { slots },
) => {
  const {
    columns,
    columnsStyles,
    depthMap,
    expandColumnKey,
    expandedRowKeys,
    estimatedRowHeight,
    hasFixedColumns,
    hoveringRowKey,
    rowData,
    rowIndex,
    style,
    isScrolling,
    rowProps: originRowProps,
    rowClass,
    rowKey,
    rowEventHandlers,
    ns,
    onRowHovered,
    onRowExpanded,
  } = properties;

  const rowKls = tryCall(rowClass, { columns, rowData, rowIndex }, '');
  const additionalProps = tryCall(originRowProps, {
    columns,
    rowData,
    rowIndex,
  });
  const rowKeyVal = rowData[rowKey];
  const depth = depthMap[rowKeyVal] || 0;
  const canExpand = Boolean(expandColumnKey);
  const isFixedRow = rowIndex < 0;
  const kls = [
    ns.e('row'),
    rowKls,
    {
      [ns.e(`row-depth-${depth}`)]: canExpand && rowIndex >= 0,
      [ns.is('expanded')]: canExpand && expandedRowKeys.includes(rowKeyVal),
      [ns.is('hovered')]: !isScrolling && rowKeyVal === hoveringRowKey,
      [ns.is('fixed')]: !depth && isFixedRow,
      [ns.is('customized')]: Boolean(slots.row),
    },
  ];

  const onRowHover = hasFixedColumns ? onRowHovered : undefined;

  const rowProps = {
    ...additionalProps,
    columns,
    columnsStyles,
    class: kls,
    depth,
    expandColumnKey,
    estimatedRowHeight: isFixedRow ? undefined : estimatedRowHeight,
    isScrolling,
    rowIndex,
    rowData,
    rowKey: rowKeyVal,
    rowEventHandlers,
    style,
  };

  return (
    <Row {...rowProps} onRowHover={onRowHover} onRowExpand={onRowExpanded}>
      {slots}
    </Row>
  );
};

export default RowRenderer;
