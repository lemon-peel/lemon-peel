<template>
  <template v-if="descriptions.direction === 'vertical'">
    <tr>
      <template v-for="(cell, index) in row" :key="`tr1-${index}`">
        <lp-descriptions-cell :cell="cell" tag="th" type="label" />
      </template>
    </tr>
    <tr>
      <template v-for="(cell, index) in row" :key="`tr2-${index}`">
        <lp-descriptions-cell :cell="cell" tag="td" type="content" />
      </template>
    </tr>
  </template>
  <tr v-else>
    <template v-for="(cell, index) in row" :key="`tr3-${index}`">
      <template v-if="descriptions.border">
        <lp-descriptions-cell :cell="cell" tag="td" type="label" />
        <lp-descriptions-cell :cell="cell" tag="td" type="content" />
      </template>
      <lp-descriptions-cell v-else :cell="cell" tag="td" type="both" />
    </template>
  </tr>
</template>

<script lang="ts" setup>
import { inject } from 'vue';

import LpDescriptionsCell from './descriptionsCell';
import { descriptionsKey } from './token';
import { descriptionsRowProps } from './descriptionsRow';

import type { IDescriptionsInject } from './descriptions.type';

defineOptions({
  name: 'LpDescriptionsRow',
});

defineProps(descriptionsRowProps);

const descriptions = inject(descriptionsKey, {} as IDescriptionsInject);
</script>
