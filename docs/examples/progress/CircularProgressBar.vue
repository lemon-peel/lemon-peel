<template>
  <div class="demo-progress">
    <lp-progress type="circle" :percentage="0" />
    <lp-progress type="circle" :percentage="25" />
    <lp-progress type="circle" :percentage="100" status="success" />
    <lp-progress type="circle" :percentage="70" status="warning" />
    <lp-progress type="circle" :percentage="50" status="exception" />
  </div>
</template>
<style scoped>
.demo-progress .lp-progress--line {
  margin-bottom: 15px;
  width: 350px;
}
.demo-progress .lp-progress--circle {
  margin-right: 15px;
}
</style>
