import { buildProps } from '@lemon-peel/utils';
import { useNamespace } from '@lemon-peel/hooks';
import { defineComponent, inject, nextTick, onMounted, ref } from 'vue';
import LpCheckbox from '@lemon-peel/components/checkbox';

import { TABLE_INJECTION_KEY } from '../tokens';
import useLayoutObserver from '../layoutObserver';
import useEvent from './eventHelper';
import useStyle from './style.helper';
import useUtils from './utilsHelper';
import FilterPanel from '../FilterPanel.vue';

import type { ExtractPropTypes, PropType } from 'vue';
import type { Sort } from '../table/defaults';

const tableHeaderProps = buildProps({
  fixed: { type: String, default: '' },
  border: Boolean,
  defaultSort: {
    type: Object as PropType<Sort>,
    default: () => ({ prop: '', order: '' }),
  },
});

export type TableHeaderProps = Readonly<ExtractPropTypes<typeof tableHeaderProps>>;

const LpTableHeader = defineComponent({
  name: 'LpTableHeader',
  components: {
    LpCheckbox,
  },
  props: tableHeaderProps,
  setup(props, { emit, expose }) {
    const table = inject(TABLE_INJECTION_KEY)!;
    const ns = useNamespace('table');
    const filterPanels = ref({});
    const { onColumnsChange, onScrollableChange } = useLayoutObserver(table);
    onMounted(async () => {
      // Need double await, because udpateColumns is executed after nextTick for now
      await nextTick();
      await nextTick();
      const { prop, order } = props.defaultSort;
      table?.store.commit('sort', { prop, order, init: true });
    });

    const {
      handleHeaderClick,
      handleHeaderContextMenu,
      handleMouseDown,
      handleMouseMove,
      handleMouseOut,
      handleSortClick,
      handleFilterClick,
    } = useEvent(props, emit);

    const {
      getHeaderRowStyle,
      getHeaderRowClass,
      getHeaderCellStyle,
      getHeaderCellClass,
    } = useStyle(props);

    const { isGroup, toggleAllSelection, columnRows } = useUtils(
      props as TableHeaderProps<unknown>,
    );

    expose({
      filterPanels,
      state: {
        onColumnsChange,
        onScrollableChange,
      },
    });

    return () => {
      const rowSpan = 1;
      return <thead class={{ [ns.is('group')]: isGroup }}>{
        columnRows.map((subColumns, rowIndex) => <tr
          class={getHeaderRowClass(rowIndex)}
          key={rowIndex} style={getHeaderRowStyle(rowIndex)}>
          { subColumns.map((column, cellIndex) => {
            if (column.rowSpan > rowSpan) {
              rowSpan = column.rowSpan;
            }
            return <th class={getHeaderCellClass(
              rowIndex,
              cellIndex,
              subColumns,
              column,
            )} colspan={column.colSpan}
                key={`${column.id}-thead`}
                rowspan={column.rowSpan}
                style={getHeaderCellStyle(
                  rowIndex,
                  cellIndex,
                  subColumns,
                  column,
                )}
                onClick={$event => handleHeaderClick($event, column)}
                onContextmenu={$event => handleHeaderContextMenu($event, column)}
                onMousedown={$event => handleMouseDown($event, column)}
                onMousemove={$event => handleMouseMove($event, column)}
                onMouseout={handleMouseOut}>
                  <div class={[
                    'cell',
                    column.filteredValue && column.filteredValue.length > 0
                      ? 'highlight'
                      : '',
                  ]}>
                    {column.renderHeader
                      ? column.renderHeader({
                        column,
                        $index: cellIndex,
                        store,
                        _self: $parent,
                      })
                      : column.label}
                      {column.sortable &&
                        <span class="caret-wrapper" onClick={$event => handleSortClick($event, column)}>
                          <i class="sort-caret ascending" onClick={$event => handleSortClick($event, column, 'ascending')}></i>
                          <i class="sort-caret descending" onClick={$event => handleSortClick($event, column, 'descending')}></i>
                        </span>}

                      {column.filterable &&
                        <FilterPanel
                          placement={column.filterPlacement || 'bottom-start'}
                          column={column} upDataColumn={(key, value) => {
                            column[key] = value;
                          }} />
                      }
                  </div>
                </th>;
          })}
        </tr>)
      }</thead>;
    };
  },
});

export default LpTableHeader;

export type TableHeader = InstanceType<typeof LpTableHeader>;