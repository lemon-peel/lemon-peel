import Table from '../tableGrid';

import type { FunctionalComponent, Ref } from 'vue';
import type { TableV2GridProps } from '../grid';
import type { TableGridInstance } from '../tableGrid';

type LeftTableProps = TableV2GridProps & {
  rightTableRef: Ref<TableGridInstance | undefined>;
};

const LeftTable: FunctionalComponent<LeftTableProps> = (properties, { slots }) => {
  if (properties.columns.length === 0) return;

  const { rightTableRef, ...rest } = properties;

  return (
    <Table ref={rightTableRef} {...rest}>
      {slots}
    </Table>
  );
};

export default LeftTable;
