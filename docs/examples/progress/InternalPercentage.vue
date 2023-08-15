<template>
  <div class="demo-progress">
    <lp-progress :text-inside="true" :stroke-width="26" :percentage="70" />
    <lp-progress
      :text-inside="true"
      :stroke-width="24"
      :percentage="100"
      status="success"
    />
    <lp-progress
      :text-inside="true"
      :stroke-width="22"
      :percentage="80"
      status="warning"
    />
    <lp-progress
      :text-inside="true"
      :stroke-width="20"
      :percentage="50"
      status="exception"
    />
  </div>
</template>

<style scoped>
.demo-progress .lp-progress--line {
  margin-bottom: 15px;
  width: 350px;
}
</style>
