<template>
  <div>
    <lp-check-tag checked style="margin-right: 8px">Checked</lp-check-tag>
    <lp-check-tag :checked="checked" @change="onChange">Toggle me</lp-check-tag>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const checked = ref(false);

const onChange = (status: boolean) => {
  checked.value = status;
};
</script>
