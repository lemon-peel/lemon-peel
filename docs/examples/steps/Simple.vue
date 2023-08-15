<template>
  <lp-steps :space="200" :active="1" simple>
    <lp-step title="Step 1" :icon="Edit" />
    <lp-step title="Step 2" :icon="UploadFilled" />
    <lp-step title="Step 3" :icon="Picture" />
  </lp-steps>

  <lp-steps :active="1" finish-status="success" simple style="margin-top: 20px">
    <lp-step title="Step 1" />
    <lp-step title="Step 2" />
    <lp-step title="Step 3" />
  </lp-steps>
</template>

<script lang="ts" setup>
import { Edit, Picture, UploadFilled } from '@element-plus/icons-vue';
</script>
