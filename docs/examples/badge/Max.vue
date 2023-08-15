<template>
  <lp-badge :value="200" :max="99" class="item">
    <lp-button>comments</lp-button>
  </lp-badge>
  <lp-badge :value="100" :max="10" class="item">
    <lp-button>replies</lp-button>
  </lp-badge>
</template>

<style scoped>
.item {
  margin-top: 10px;
  margin-right: 40px;
}
</style>
