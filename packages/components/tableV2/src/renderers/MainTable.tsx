import Table from '../tableGrid';

import type { FunctionalComponent, Ref } from 'vue';
import type { TableV2GridProps } from '../grid';
import type { TableGridInstance } from '../tableGrid';

export type MainTableRendererProps = TableV2GridProps & {
  mainTableRef: Ref<TableGridInstance | undefined>;
};

const MainTable: FunctionalComponent<MainTableRendererProps> = (
  properties: MainTableRendererProps,
  { slots },
) => {
  const { mainTableRef, ...rest } = properties;
  return (
    <Table ref={mainTableRef} {...rest}>
      {slots}
    </Table>
  );
};

export default MainTable;
