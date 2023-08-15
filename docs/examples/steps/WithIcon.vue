<template>
  <lp-steps :active="1">
    <lp-step title="Step 1" :icon="Edit" />
    <lp-step title="Step 2" :icon="Upload" />
    <lp-step title="Step 3" :icon="Picture" />
  </lp-steps>
</template>

<script lang="ts" setup>
import { Edit, Picture, Upload } from '@element-plus/icons-vue';
</script>
