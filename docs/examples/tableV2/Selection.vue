<template>
  <div style="height: 400px">
    <lp-auto-resizer>
      <template #default="{ height, width }">
        <lp-table-v2
          :columns="columns"
          :data="data"
          :width="width"
          :height="height"
          fixed
        />
      </template>
    </lp-auto-resizer>
  </div>
</template>

<script lang="tsx" setup>
import { ref, unref } from 'vue';
import { LpCheckbox } from 'lemon-peel';

import type { FunctionalComponent } from 'vue';
import type { CheckboxValueType, Column } from 'lemon-peel';

type SelectionCellProps = {
  value: boolean;
  intermediate?: boolean;
  onChange: (value: CheckboxValueType) => void;
};

const SelectionCell: FunctionalComponent<SelectionCellProps> = ({
  value,
  intermediate = false,
  onChange,
}) => {
  return (
    <LpCheckbox
      onChange={onChange}
      checked={value}
      indeterminate={intermediate}
    />
  );
};

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
        checked: false,
        parentId: null,
      },
    );
  });

const columns: Column<any>[] = generateColumns(10);
const data = ref(generateData(columns, 200));
columns.unshift({
  key: 'selection',
  width: 50,
  cellRenderer: ({ rowData }) => {
    const onChange = (value: CheckboxValueType) => (rowData.checked = value);
    return <SelectionCell value={rowData.checked} onChange={onChange} />;
  },

  headerCellRenderer: () => {
    const d = unref(data);
    const onChange = (value: CheckboxValueType) =>
      (data.value = d.map(row => {
        row.checked = value;
        return row;
      }));
    const allSelected = d.every(row => row.checked);
    const containsChecked = d.some(row => row.checked);

    return (
      <SelectionCell
        value={allSelected}
        intermediate={containsChecked && !allSelected}
        onChange={onChange}
      />
    );
  },
});

</script>
