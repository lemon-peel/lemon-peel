<template>
  <div>
    <lp-link :underline="false">Without Underline</lp-link>
    <lp-link>With Underline</lp-link>
  </div>
</template>
<style scoped>
.lp-link {
  margin-right: 8px;
}
.lp-link .lp-icon--right.lp-icon {
  vertical-align: text-bottom;
}
</style>
