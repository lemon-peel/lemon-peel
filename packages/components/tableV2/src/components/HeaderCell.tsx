import type { FunctionalComponent } from 'vue';
import type { TableV2HeaderCell } from '../headerCell';

const HeaderCell: FunctionalComponent<TableV2HeaderCell> = (properties, { slots }) =>
  slots.default ? (
    slots.default(properties)
  ) : (
    <div class={properties.class} title={properties.column?.title}>
      {properties.column?.title}
    </div>
  );

HeaderCell.displayName = 'LpTableV2HeaderCell';
HeaderCell.inheritAttrs = false;

export default HeaderCell;
