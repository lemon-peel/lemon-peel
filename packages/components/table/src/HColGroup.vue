<!-- eslint-disable vue/require-v-for-key -->
<template>
  <colgroup>
    <col v-for="item in renderColumns" v-bind="getPropsData(item)">
  </colgroup>
</template>

<script lang="ts" setup>
import { computed, unref } from 'vue';
import type { PropType } from 'vue';

import type { TableColumnCtx } from './tableColumn/defaults';

defineOptions({ name: 'HColGroup' });

const props = defineProps({
  columns: { type: Array as PropType<TableColumnCtx[]>, required: true },
  tableLayout: { type: String, required: true },
});

const isAuto = computed(() => {
  return props.tableLayout === 'auto';
});

const renderColumns = computed(() => {
  let columns = props.columns || [];
  if (isAuto.value && columns.every(c => c.width === undefined)) {
    columns = [];
  }
  return columns;
});

const getPropsData = (column: TableColumnCtx) => {
  const propsData: Record<string, any> = {
    key: `${props.tableLayout}_${column.id}`,
    style: {},
    rawWidth: column.width,
    name: undefined as any,
  };

  if (isAuto.value) {
    propsData.style = {
      width: `${unref(column.width)}px`,
    };
  } else {
    propsData.name = column.id;
  }

  return propsData;
};
</script>
