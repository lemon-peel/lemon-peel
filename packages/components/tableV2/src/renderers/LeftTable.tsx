import Table from '../tableGrid';

import type { FunctionalComponent, Ref } from 'vue';
import type { TableV2GridProps as TableV2GridProps } from '../grid';
import type { TableGridInstance } from '../tableGrid';

type LeftTableProps = TableV2GridProps & {
  leftTableRef: Ref<TableGridInstance | undefined>;
};

const LeftTable: FunctionalComponent<LeftTableProps> = (properties, { slots }) => {
  if (properties.columns.length === 0) return;

  const { leftTableRef, ...rest } = properties;

  return (
    <Table ref={leftTableRef} {...rest}>
      {slots}
    </Table>
  );
};

export default LeftTable;
