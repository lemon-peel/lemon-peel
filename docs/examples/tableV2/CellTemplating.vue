<template>
  <lp-table-v2
    :columns="columns"
    :data="data"
    :width="700"
    :height="400"
    fixed
  />
</template>

<script lang="tsx" setup>
import { ref } from 'vue';
import dayjs from 'dayjs';
import {
  LpButton,
  LpIcon,
  LpTag,
  LpTooltip,
  TableV2FixedDir,
} from 'lemon-peel';
import { Timer } from '@element-plus/icons-vue';

import type { Column } from 'lemon-peel';

let id = 0;

const dataGenerator = () => ({
  id: `random-id-${++id}`,
  name: 'Tom',
  date: '2020-10-1',
});

const columns: Column<any>[] = [
  {
    key: 'date',
    title: 'Date',
    dataKey: 'date',
    width: 150,
    fixed: TableV2FixedDir.LEFT,
    cellRenderer: ({ cellData: date }) => (
      <LpTooltip content={dayjs(date).format('YYYY/MM/DD')}>
        {
          <span class="flex items-center">
            <LpIcon class="mr-3">
              <Timer />
            </LpIcon>
            {dayjs(date).format('YYYY/MM/DD')}
          </span>
        }
      </LpTooltip>
    ),
  },
  {
    key: 'name',
    title: 'Name',
    dataKey: 'name',
    width: 150,
    align: 'center',
    cellRenderer: ({ cellData: name }) => <LpTag>{name}</LpTag>,
  },
  {
    key: 'operations',
    title: 'Operations',
    cellRenderer: () => (
      <>
        <LpButton size="small">Edit</LpButton>
        <LpButton size="small" type="danger">
          Delete
        </LpButton>
      </>
    ),
    width: 150,
    align: 'center',
  },
];

const data = ref(Array.from({ length: 200 }).map(dataGenerator));
</script>
