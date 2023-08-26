<template>
  <div>
    <div style="margin-bottom: 15px">fill: <lp-switch v-model:value="fill" /></div>
    <lp-space :fill="fill" wrap>
      <lp-card v-for="i in 3" :key="i" class="box-card">
        <template #header>
          <div class="card-header">
            <span>Card name</span>
            <lp-button class="button" text>Operation button</lp-button>
          </div>
        </template>
        <div v-for="o in 4" :key="o" class="text item">
          {{ 'List item ' + o }}
        </div>
      </lp-card>
    </lp-space>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const fill = ref(true);
</script>
