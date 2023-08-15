<template>
  <div class="demo-progress">
    <lp-progress :percentage="50" :indeterminate="true" />
    <lp-progress :percentage="100" :format="format" :indeterminate="true" />
    <lp-progress
      :percentage="100"
      status="success"
      :indeterminate="true"
      :duration="5"
    />
    <lp-progress
      :percentage="100"
      status="warning"
      :indeterminate="true"
      :duration="1"
    />
    <lp-progress :percentage="50" status="exception" :indeterminate="true" />
  </div>
</template>

<script lang="ts" setup>
const format = (percentage: number) => (percentage === 100 ? 'Full' : `${percentage}%`);
</script>
<style scoped>
.demo-progress .lp-progress--line {
  margin-bottom: 15px;
  width: 350px;
}
</style>
