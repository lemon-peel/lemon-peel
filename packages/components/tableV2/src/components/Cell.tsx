import type { FunctionalComponent } from 'vue';
import type { TableV2CellProps } from '../cell';

const TableV2Cell: FunctionalComponent<TableV2CellProps> = (
  properties: TableV2CellProps,
  { slots },
) => {
  const { cellData, style } = properties;
  const displayText = cellData?.toString?.() || '';
  return (
    <div class={properties.class} title={displayText} style={style}>
      {slots.default ? slots.default(properties) : displayText}
    </div>
  );
};

TableV2Cell.displayName = 'LpTableV2Cell';
TableV2Cell.inheritAttrs = false;

export default TableV2Cell;
