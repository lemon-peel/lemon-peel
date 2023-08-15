<template>
  <thead :class="{ [ns.is('group')]: isGroup }">
    <template v-for="(subColumns, rowIndex) in columnRows" :key="rowIndex">
      <tr :class="getHeaderRowClass(rowIndex)" :style="getHeaderRowStyle(rowIndex)">
        <th v-for="(column, cellIndex) in subColumns" :key="`${column.id}-thead`"
            :colspan="column.colSpan"
            :class="getHeaderCellClass( rowIndex, cellIndex, subColumns, column)"
            :rowspan="column.rowSpan"
            :style="getHeaderCellStyle(rowIndex, cellIndex, subColumns, column)"
            @click="handleHeaderClick($event, column)"
            @contextmenu="handleHeaderContextMenu($event, column)"
            @mousedown="handleMouseDown($event, column)"
            @mousemove="handleMouseMove($event, column)"
            @mouseout="handleMouseOut"
        >
          <div :class="['cell', column.filteredValue && column.filteredValue.length > 0 ? 'highlight' : '']">
            <template v-if="column.renderHeader">
              <component :is="column.renderHeader({ store, column, cellIndex }) as any" />
            </template>
            <template v-else>{{ column.label }}</template>

            <span v-if="column.sortable" class="caret-wrapper" @click="handleSortClick($event, column)">
              <i class="sort-caret ascending" @click="handleSortClick($event, column, 'ascending')" />
              <i class="sort-caret descending" @click="handleSortClick($event, column, 'descending')" />
            </span>

            <filter-panel v-if="column.filterable"
                          :column="column"
                          :up-data-column="(key: string, value: any) => { column[key as 'filterOpened'] = value }"
                          :placement="column.filterPlacement || 'bottom-start'"
            />
          </div>
        </th>
      </tr>
    </template>
  </thead>
</template>

<script lang="tsx" setup>
import { getCurrentInstance, inject, nextTick, onMounted, ref } from 'vue';
import { useNamespace } from '@lemon-peel/hooks';

import { STORE_INJECTION_KEY, TABLE_INJECTION_KEY } from '../tokens';
import { tableHeaderProps } from './tableHeader';

import useLayoutObserver from '../layout/layoutObserver';
import useEvent from './eventHelper';
import useStyle from './styleHelper';
import useUtils from './utilsHelper';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import FilterPanel from '../FilterPanel.vue';

defineOptions({ name: 'LpTableHeader' });

const props = defineProps(tableHeaderProps);
const emit = defineEmits([]);

const table = inject(TABLE_INJECTION_KEY)!;
const store = inject(STORE_INJECTION_KEY)!;
const ns = useNamespace('table');
const vm = getCurrentInstance()!;
const filterPanels = ref<Record<string, InstanceType<typeof FilterPanel>>>({});
(vm as any).filterPanels = filterPanels;
const { onColumnsChange, onScrollableChange } = useLayoutObserver(table);

onMounted(async () => {
  // Need double await, because udpateColumns is executed after nextTick for now
  await nextTick();
  await nextTick();
  const { prop, order } = props.defaultSort;
  store.actions.sort({ prop, order, init: true });
});

const {
  handleHeaderClick,
  handleHeaderContextMenu,
  handleMouseDown,
  handleMouseMove,
  handleMouseOut,
  handleSortClick,
  handleFilterClick,
} = useEvent(props, emit as any);

const {
  getHeaderRowStyle,
  getHeaderRowClass,
  getHeaderCellStyle,
  getHeaderCellClass,
} = useStyle();

const {
  isGroup,
  toggleAllSelection,
  columnRows,
} = useUtils();

defineExpose({
  handleFilterClick,
  filterPanels,
  toggleAllSelection,
  state: {
    onColumnsChange,
    onScrollableChange,
  },
});

</script>
