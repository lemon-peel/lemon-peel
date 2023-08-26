<template>
  <lp-checkbox
    v-model:checked="checkAll"
    :indeterminate="isIndeterminate"
    @change="handleCheckAllChange"
  >Check all</lp-checkbox>
  <lp-checkbox-group
    v-model:value="checkedCities"
    @change="handleCheckedCitiesChange"
  >
    <lp-checkbox v-for="city in cities" :key="city" :label="city">{{
      city
    }}</lp-checkbox>
  </lp-checkbox-group>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const checkAll = ref(false);
const isIndeterminate = ref(true);
const checkedCities = ref(['Shanghai', 'Beijing']);
const cities = ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen'];

const handleCheckAllChange = (val: boolean) => {
  checkedCities.value = val ? cities : [];
  isIndeterminate.value = false;
};
const handleCheckedCitiesChange = (value: string[]) => {
  const checkedCount = value.length;
  checkAll.value = checkedCount === cities.length;
  isIndeterminate.value = checkedCount > 0 && checkedCount < cities.length;
};
</script>
