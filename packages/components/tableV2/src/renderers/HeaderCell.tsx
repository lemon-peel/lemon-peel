import { HeaderCell, SortIcon } from '../components';
// import ColumnResizer from '../table-column-resizer'
import { Alignment, SortOrder, oppositeOrderMap } from '../constants';
import { placeholderSign } from '../private';
import { enforceUnit, tryCall } from '../utils';

import type { FunctionalComponent, UnwrapNestedRefs } from 'vue';
import type { CssNamespace } from '@lemon-peel/hooks';
import type { TableV2HeaderRowCellRendererParams } from '../components';
import type { UseTableReturn } from '../useTable';
import type { TableV2Props as TableV2Props } from '../table';
import type { TableV2HeaderCell } from '../headerCell';

export type HeaderCellRendererProps = TableV2HeaderRowCellRendererParams &
UnwrapNestedRefs<Pick<UseTableReturn, 'onColumnSorted'>> &
Pick<TableV2Props, 'sortBy' | 'sortState' | 'headerCellProps'> & {
  ns: CssNamespace;
};

const HeaderCellRenderer: FunctionalComponent<HeaderCellRendererProps> = (
  props,
  { slots },
) => {
  const { column, ns, style, onColumnSorted } = props;

  const cellStyle = enforceUnit(style);

  if (column.placeholderSign === placeholderSign) {
    return (
      <div class={ns.em('header-row-cell', 'placeholder')} style={cellStyle} />
    );
  }

  const { headerCellRenderer, headerClass, sortable } = column;

  /**
   * render Cell children
   */

  const cellProperties = {
    ...props,
    class: ns.e('header-cell-text'),
  };

  const cellRenderer =
    headerCellRenderer ||
    slots.default ||
    ((props: TableV2HeaderCell) => <HeaderCell {...props} />);

  const Cell = cellRenderer(cellProperties);

  /**
   * Render cell container and sort indicator
   */
  const { sortBy, sortState, headerCellProps } = props;

  let sorting: boolean; let sortOrder: SortOrder;
  if (sortState) {
    const order = sortState[column.key];
    sorting = Boolean(oppositeOrderMap[order]);
    sortOrder = sorting ? order : SortOrder.ASC;
  } else {
    sorting = column.key === sortBy.key;
    sortOrder = sorting ? sortBy.order : SortOrder.ASC;
  }

  const cellKls = [
    ns.e('header-cell'),
    tryCall(headerClass, props, ''),
    column.align === Alignment.CENTER && ns.is('align-center'),
    column.align === Alignment.RIGHT && ns.is('align-right'),
    sortable && ns.is('sortable'),
  ];

  const cellWrapperProperties = {
    ...tryCall(headerCellProps, props),
    onClick: column.sortable ? onColumnSorted : undefined,
    class: cellKls,
    style: cellStyle,
    ['data-key']: column.key,
  };

  // For now we don't deliver resizable column feature since it has some UX issue.
  return (
    <div {...cellWrapperProperties}>
      {Cell}

      {sortable && (
        <SortIcon
          class={[ns.e('sort-icon'), sorting && ns.is('sorting')]}
          sortOrder={sortOrder}
        />
      )}
    </div>
  );
};

export default HeaderCellRenderer;
export type HeaderCellSlotProps = HeaderCellRendererProps & { class: string };
