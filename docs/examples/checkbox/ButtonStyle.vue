<template>
  <div>
    <lp-checkbox-group v-model:value="checkboxGroup1" size="large">
      <lp-checkbox-button v-for="city in cities" :key="city" :label="city">
        {{ city }}
      </lp-checkbox-button>
    </lp-checkbox-group>
  </div>
  <div class="demo-button-style">
    <lp-checkbox-group v-model:value="checkboxGroup2">
      <lp-checkbox-button v-for="city in cities" :key="city" :label="city">{{
        city
      }}</lp-checkbox-button>
    </lp-checkbox-group>
  </div>
  <div class="demo-button-style">
    <lp-checkbox-group v-model:value="checkboxGroup3" size="small">
      <lp-checkbox-button
        v-for="city in cities"
        :key="city"
        :label="city"
        :disabled="city === 'Beijing'"
      >{{ city }}</lp-checkbox-button>
    </lp-checkbox-group>
  </div>
  <div class="demo-button-style">
    <lp-checkbox-group v-model:value="checkboxGroup4" size="small" disabled>
      <lp-checkbox-button v-for="city in cities" :key="city" :label="city">{{
        city
      }}</lp-checkbox-button>
    </lp-checkbox-group>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const checkboxGroup1 = ref(['Shanghai']);
const checkboxGroup2 = ref(['Shanghai']);
const checkboxGroup3 = ref(['Shanghai']);
const checkboxGroup4 = ref(['Shanghai']);
const cities = ['Shanghai', 'Beijing', 'Guangzhou', 'Shenzhen'];
</script>

<style scoped>
.demo-button-style {
  margin-top: 24px;
}
</style>
