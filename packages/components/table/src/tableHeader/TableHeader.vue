<template>
  <thead :class="{ [ns.is('group')]: isGroup }">
    <template v-for="(subColumns, rowIndex) in columnRows" :key="rowIndex">
      <tr :class="getHeaderRowClass(rowIndex)" :style="getHeaderRowStyle(rowIndex)">'
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
              <component :is="column.renderHeader({ column, cellIndex })" />
            </template>
            <template v-else>{{ column.label }}</template>

            <span v-if="column.sortable" class="caret-wrapper" @click="handleSortClick($event, column)">
              <i class="sort-caret ascending" @click="handleSortClick($event, column, 'ascending')" />
              <i class="sort-caret descending" @click="handleSortClick($event, column, 'descending')" />
            </span>

            <FilterPanel v-if="column.filterable"
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
import { inject, nextTick, onMounted, ref } from 'vue';
import { useNamespace } from '@lemon-peel/hooks';

import { STORE_INJECTION_KEY, TABLE_INJECTION_KEY } from '../tokens';
import { tableHeaderProps } from './types';

import useLayoutObserver from '../layout/layoutObserver';
import useEvent from './eventHelper';
import useStyle from './style.helper';
import useUtils from './utilsHelper';

import type FilterPanel from '../FilterPanel.vue';

defineOptions({ name: 'LpTableHeader' });

const props = defineProps(tableHeaderProps);
const emit = defineEmits([]);

const table = inject(TABLE_INJECTION_KEY)!;
const store = inject(STORE_INJECTION_KEY)!;
const ns = useNamespace('table');
const filterPanels = ref<Record<string, InstanceType<typeof FilterPanel>>>({});
const { onColumnsChange, onScrollableChange } = useLayoutObserver(table);

onMounted(async () => {
  // Need double await, because udpateColumns is executed after nextTick for now
  await nextTick();
  await nextTick();
  const { prop, order } = props.defaultSort;
  store.commit('sort', { prop, order, init: true });
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

const {
  isGroup,
  toggleAllSelection,
  columnRows,
} = useUtils(props);

defineExpose({
  handleFilterClick,
  filterPanels,
  state: {
    onColumnsChange,
    onScrollableChange,
  },
});

</script>