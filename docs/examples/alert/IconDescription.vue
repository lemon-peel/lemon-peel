<template>
  <lp-alert
    title="success alert"
    type="success"
    description="more text description"
    show-icon
  />
  <lp-alert
    title="info alert"
    type="info"
    description="more text description"
    show-icon
  />
  <lp-alert
    title="warning alert"
    type="warning"
    description="more text description"
    show-icon
  />
  <lp-alert
    title="error alert"
    type="error"
    description="more text description"
    show-icon
  />
</template>
<style scoped>
.lp-alert {
  margin: 20px 0 0;
}
.lp-alert:first-child {
  margin: 0;
}
</style>
