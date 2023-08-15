<template>
  <lp-popover :visible="visible" placement="top" :width="160">
    <p>Are you sure to delete this?</p>
    <div style="text-align: right; margin: 0">
      <lp-button size="small" text @click="visible = false">cancel</lp-button>
      <lp-button size="small" type="primary" @click="visible = false">confirm</lp-button>
    </div>
    <template #reference>
      <lp-button @click="visible = true">Delete</lp-button>
    </template>
  </lp-popover>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const visible = ref(false);
</script>
