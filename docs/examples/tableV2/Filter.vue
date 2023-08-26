<template>
  <lp-table-v2
    fixed
    :columns="fixedColumns"
    :data="data"
    :width="700"
    :height="400"
  />
</template>
<script lang="tsx" setup>
import { ref } from 'vue';
import {
  LpButton,
  LpCheckbox,
  LpIcon,
  LpPopover,
  TableV2FixedDir,
} from 'lemon-peel';
import { Filter } from '@element-plus/icons-vue';

import type { HeaderCellSlotProps } from 'lemon-peel';

const generateColumns = (length = 10, prefix = 'column-', props?: any) =>
  Array.from({ length }).map((_, columnIndex) => ({
    ...props,
    key: `${prefix}${columnIndex}`,
    dataKey: `${prefix}${columnIndex}`,
    title: `Column ${columnIndex}`,
    width: 150,
  }));

const generateData = (
  columns: ReturnType<typeof generateColumns>,
  length = 200,
  prefix = 'row-',
) =>
  Array.from({ length }).map((_, rowIndex) => {
    return columns.reduce(
      (rowData, column, columnIndex) => {
        rowData[column.dataKey] = `Row ${rowIndex} - Col ${columnIndex}`;
        return rowData;
      },
      {
        id: `${prefix}${rowIndex}`,
        parentId: null,
      },
    );
  });
const columns = generateColumns(10);
const data = ref(generateData(columns, 200));

const shouldFilter = ref(false);
const popoverRef = ref();

const onFilter = () => {
  popoverRef.value.hide();
  data.value = shouldFilter.value ? generateData(columns, 100, 'filtered-') : generateData(columns, 200);
};

const onReset = () => {
  shouldFilter.value = false;
  onFilter();
};

columns[0].headerCellRenderer = (props: HeaderCellSlotProps) => {
  return (
    <div class="flex items-center justify-center">
      <span class="mr-2 text-xs">{props.column.title}</span>
      <LpPopover ref={popoverRef} trigger="click" {...{ width: 200 }}>
        {{
          default: () => (
            <div class="filter-wrapper">
              <div class="filter-group">
                <LpCheckbox v-model={shouldFilter.value}>
                  Filter Text
                </LpCheckbox>
              </div>
              <div class="el-table-v2__demo-filter">
                <LpButton text onClick={onFilter}>
                  Confirm
                </LpButton>
                <LpButton text onClick={onReset}>
                  Reset
                </LpButton>
              </div>
            </div>
          ),
          reference: () => (
            <LpIcon class="cursor-pointer">
              <Filter />
            </LpIcon>
          ),
        }}
      </LpPopover>
    </div>
  );
};

const fixedColumns = columns.map((column, columnIndex) => {
  let fixed: TableV2FixedDir | undefined;
  if (columnIndex < 2) fixed = TableV2FixedDir.LEFT;
  if (columnIndex > 9) fixed = TableV2FixedDir.RIGHT;
  return { ...column, fixed, width: 100 };
});
</script>

<style>
.lp-table-v2__demo-filter {
  border-top: var(--el-border);
  margin: 12px -12px -12px;
  padding: 0 12px;
  display: flex;
  justify-content: space-between;
}
</style>
