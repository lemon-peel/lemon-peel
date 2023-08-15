<template>
  <div class="demo-progress">
    <lp-progress :percentage="50" />
    <lp-progress :percentage="100" :format="format" />
    <lp-progress :percentage="100" status="success" />
    <lp-progress :percentage="100" status="warning" />
    <lp-progress :percentage="50" status="exception" />
  </div>
</template>

<script lang="ts" setup>
const format = percentage => (percentage === 100 ? 'Full' : `${percentage}%`);
</script>

<style scoped>
.demo-progress .lp-progress--line {
  margin-bottom: 15px;
  width: 350px;
}
</style>
