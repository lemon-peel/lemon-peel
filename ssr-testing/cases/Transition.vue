<template>
  <div>
    <lp-button @click="show = !show">Click Me</lp-button>

    <div style="margin-top: 20px; height: 200px">
      <lp-collapse-transition>
        <div v-show="show">
          <div class="transition-box">lp-collapse-transition</div>
          <div class="transition-box">lp-collapse-transition</div>
        </div>
      </lp-collapse-transition>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const show = ref(true);
</script>

<style>
.transition-box {
  margin-bottom: 10px;
  width: 200px;
  height: 100px;
  border-radius: 4px;
  background-color: #409eff;
  text-align: center;
  color: #fff;
  padding: 40px 20px;
  box-sizing: border-box;
  margin-right: 20px;
}
</style>
