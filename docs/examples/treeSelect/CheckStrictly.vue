<template>
  <lp-tree-select
    v-model:value="value"
    :data="data"
    check-strictly
    :render-after-expand="false"
  />
  <lp-divider />
  show checkbox(only click checkbox to select):
  <lp-tree-select
    v-model:value="value"
    :data="data"
    check-strictly
    :render-after-expand="false"
    show-checkbox
  />
  <lp-divider />
  show checkbox with `check-on-click-node`:
  <lp-tree-select
    v-model:value="value"
    :data="data"
    check-strictly
    :render-after-expand="false"
    show-checkbox
    check-on-click-node
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const value = ref();

const data = [
  {
    value: '1',
    label: 'Level one 1',
    children: [
      {
        value: '1-1',
        label: 'Level two 1-1',
        children: [
          {
            value: '1-1-1',
            label: 'Level three 1-1-1',
          },
        ],
      },
    ],
  },
  {
    value: '2',
    label: 'Level one 2',
    children: [
      {
        value: '2-1',
        label: 'Level two 2-1',
        children: [
          {
            value: '2-1-1',
            label: 'Level three 2-1-1',
          },
        ],
      },
      {
        value: '2-2',
        label: 'Level two 2-2',
        children: [
          {
            value: '2-2-1',
            label: 'Level three 2-2-1',
          },
        ],
      },
    ],
  },
  {
    value: '3',
    label: 'Level one 3',
    children: [
      {
        value: '3-1',
        label: 'Level two 3-1',
        children: [
          {
            value: '3-1-1',
            label: 'Level three 3-1-1',
          },
        ],
      },
      {
        value: '3-2',
        label: 'Level two 3-2',
        children: [
          {
            value: '3-2-1',
            label: 'Level three 3-2-1',
          },
        ],
      },
    ],
  },
];
</script>
