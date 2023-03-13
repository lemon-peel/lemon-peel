import { computed, defineComponent, nextTick, ref, unref } from 'vue';
import { useNamespace } from '@lemon-peel/hooks';
import { ensureArray } from '@lemon-peel/utils';
import { tableV2HeaderProps } from '../header';
import { enforceUnit } from '../utils';

import type { CSSProperties, UnwrapRef } from 'vue';
import type { TableV2HeaderProps } from '../header';
import type { UseColumnsReturn } from '../composables/useColumns';

const COMPONENT_NAME = 'LpTableV2Header';
const TableV2Header = defineComponent({
  name: COMPONENT_NAME,
  props: tableV2HeaderProps,
  setup(properties, { slots, expose }) {
    const ns = useNamespace('table-v2');

    const headerRef = ref<HTMLElement>();

    const headerStyle = computed(() =>
      enforceUnit({
        width: properties.width,
        height: properties.height,
      }),
    );

    const rowStyle = computed(() =>
      enforceUnit({
        width: properties.rowWidth,
        height: properties.height,
      }),
    );

    const headerHeights = computed(() => ensureArray(unref(properties.headerHeight)));

    const scrollToLeft = (left?: number) => {
      const headerElement = unref(headerRef);
      nextTick(() => {
        headerElement?.scroll &&
          headerElement.scroll({
            left,
          });
      });
    };

    const renderFixedRows = () => {
      const fixedRowClassName = ns.e('fixed-header-row');

      const { columns, fixedHeaderData, rowHeight } = properties;

      return fixedHeaderData?.map((fixedRowData, fixedRowIndex) => {
        const style: CSSProperties = enforceUnit({
          height: rowHeight,
          width: '100%',
        });

        return slots.fixed?.({
          class: fixedRowClassName,
          columns,
          rowData: fixedRowData,
          rowIndex: -(fixedRowIndex + 1),
          style,
        });
      });
    };

    const renderDynamicRows = () => {
      const dynamicRowClassName = ns.e('dynamic-header-row');
      const { columns } = properties;

      return unref(headerHeights).map((rowHeight, rowIndex) => {
        const style: CSSProperties = enforceUnit({
          width: '100%',
          height: rowHeight,
        });

        return slots.dynamic?.({
          class: dynamicRowClassName,
          columns,
          headerIndex: rowIndex,
          style,
        });
      });
    };

    expose({
      /**
       * @description scroll to position based on the provided value
       */
      scrollToLeft,
    });

    return () => {
      if (properties.height <= 0) return;

      return (
        <div ref={headerRef} class={properties.class} style={unref(headerStyle)}>
          <div style={unref(rowStyle)} class={ns.e('header')}>
            {renderDynamicRows()}
            {renderFixedRows()}
          </div>
        </div>
      );
    };
  },
});

export default TableV2Header;

export type TableV2HeaderInstance = InstanceType<typeof TableV2Header> & {
  /**
   * @description scroll to position based on the provided value
   */
  scrollToLeft: (left?: number) => void;
};

export type TableV2HeaderRendererParams = {
  class: string;
  columns: TableV2HeaderProps['columns'];
  columnsStyles: UnwrapRef<UseColumnsReturn['columnsStyles']>;
  headerIndex: number;
  style: CSSProperties;
};

export type TableV2HeaderRowRendererParams = {
  rowData: any;
  rowIndex: number;
} & Omit<TableV2HeaderRendererParams, 'headerIndex'>;
