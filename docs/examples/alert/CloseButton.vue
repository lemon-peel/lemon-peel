<template>
  <lp-alert title="unclosable alert" type="success" :closable="false" />
  <lp-alert title="customized close-text" type="info" close-text="Gotcha" />
  <lp-alert title="alert with callback" type="warning" @close="hello" />
</template>

<script lang="ts" setup>
const hello = () => {
  // eslint-disable-next-line no-alert
  alert('Hello World!');
};
</script>
<style scoped>
.lp-alert {
  margin: 20px 0 0;
}
.lp-alert:first-child {
  margin: 0;
}
</style>
