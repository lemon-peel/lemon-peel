<template>
  <div class="demo-time-range">
    <lp-time-select
      v-model:value="startTime"
      :max-time="endTime"
      class="mr-4"
      placeholder="Start time"
      start="08:30"
      step="00:15"
      end="18:30"
    />
    <lp-time-select
      v-model:value="endTime"
      :min-time="startTime"
      placeholder="End time"
      start="08:30"
      step="00:15"
      end="18:30"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const startTime = ref('');
const endTime = ref('');
</script>
