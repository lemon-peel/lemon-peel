<template>
  <div class="demo-progress">
    <lp-progress type="dashboard" :percentage="percentage" :color="colors" />
    <lp-progress type="dashboard" :percentage="percentage2" :color="colors" />
    <div>
      <lp-button-group>
        <lp-button :icon="Minus" @click="decrease" />
        <lp-button :icon="Plus" @click="increase" />
      </lp-button-group>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import { Minus, Plus } from '@element-plus/icons-vue';

const percentage = ref(10);
const percentage2 = ref(0);

const colors = [
  { color: '#f56c6c', percentage: 20 },
  { color: '#e6a23c', percentage: 40 },
  { color: '#5cb87a', percentage: 60 },
  { color: '#1989fa', percentage: 80 },
  { color: '#6f7ad3', percentage: 100 },
];

const increase = () => {
  percentage.value += 10;
  if (percentage.value > 100) {
    percentage.value = 100;
  }
};
const decrease = () => {
  percentage.value -= 10;
  if (percentage.value < 0) {
    percentage.value = 0;
  }
};
onMounted(() => {
  setInterval(() => {
    percentage2.value = (percentage2.value % 100) + 10;
  }, 500);
});
</script>
<style scoped>
.demo-progress .lp-progress--line {
  margin-bottom: 15px;
  width: 350px;
}
.demo-progress .lp-progress--circle {
  margin-right: 15px;
}
</style>
