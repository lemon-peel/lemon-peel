<template>
  <table :class="ns.e('footer')" cellspacing="0" cellpadding="0" border="0">
    <h-col-group :columns="columns" :table-layout="'auto'" />
    <tbody>
      <tr>
        <template v-for="(column, cellIndex) in columns" :key="cellIndex">
          <td
            :colspan="column.colSpan"
            :rowspan="column.rowSpan"
            :class="getCellClasses(columns, cellIndex)"
            :style="getCellStyles(column, cellIndex)"
          >
            <div :class="['cell', column.labelClassName]">
              {{ sums[cellIndex] }}
            </div>
          </td>
        </template>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';
import { useNamespace } from '@lemon-peel/hooks';
import HColGroup from '../HColGroup.vue';
import useStyle from './styleHelper';

import { tableFooterProps } from './tableFooter';
import { STORE_INJECTION_KEY } from '../tokens';

defineOptions({
  name: 'LpTableFooter',
});

const props = defineProps(tableFooterProps);

const store = inject(STORE_INJECTION_KEY)!;
const { getCellClasses, getCellStyles, columns } = useStyle(store);
const ns = useNamespace('table');

const sums = computed(() => {
  const data = store.states.data.value;
  if (props.summaryMethod) {
    return props.summaryMethod({
      columns: columns.value,
      data,
    });
  }

  const arr: (number | string)[] = [];
  columns.value.forEach((column, index) => {
    if (index === 0) {
      arr[index] = props.sumText;
      return;
    }

    const values = data.map(item => Number(item[column.property]));
    const precisions: number[] = [];

    let notNumber = true;
    values.forEach(value => {
      if (!Number.isNaN(+value)) {
        notNumber = false;
        const decimal = `${value}`.split('.')[1];
        precisions.push(decimal ? decimal.length : 0);
      }
    });

    const precision = Math.max.apply(null, precisions);
    arr[index] = notNumber ? '' : values.reduce((prev, curr) => {
      const value = Number(curr);
      return Number.isNaN(+value) ? prev : Number.parseFloat(
        (prev + curr).toFixed(Math.min(precision, 20)),
      );
    }, 0);
  });

  return arr;
});

</script>