<template>
  <div>
    <lp-input v-model:value="input1" placeholder="Please input">
      <template #prepend>Http://</template>
    </lp-input>
  </div>
  <div class="mt-4">
    <lp-input v-model:value="input2" placeholder="Please input">
      <template #append>.com</template>
    </lp-input>
  </div>
  <div class="mt-4">
    <lp-input
      v-model:value="input3"
      placeholder="Please input"
      class="input-with-select"
    >
      <template #prepend>
        <lp-select v-model:value="select" placeholder="Select" style="width: 115px">
          <lp-option label="Restaurant" value="1" />
          <lp-option label="Order No." value="2" />
          <lp-option label="Tel" value="3" />
        </lp-select>
      </template>
      <template #append>
        <lp-button :icon="Search" />
      </template>
    </lp-input>
  </div>
  <div class="mt-4">
    <lp-input
      v-model:value="input3"
      placeholder="Please input"
      class="input-with-select"
    >
      <template #prepend>
        <lp-button :icon="Search" />
      </template>
      <template #append>
        <lp-select v-model:value="select" placeholder="Select" style="width: 115px">
          <lp-option label="Restaurant" value="1" />
          <lp-option label="Order No." value="2" />
          <lp-option label="Tel" value="3" />
        </lp-select>
      </template>
    </lp-input>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Search } from '@element-plus/icons-vue';
const input1 = ref('');
const input2 = ref('');
const input3 = ref('');
const select = ref('');
</script>

<style>
.input-with-select .lp-input-group__prepend {
  background-color: var(--el-fill-color-blank);
}
</style>
