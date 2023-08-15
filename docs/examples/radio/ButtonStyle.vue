<template>
  <div>
    <lp-radio-group v-model="radio1" size="large">
      <lp-radio-button label="New York" />
      <lp-radio-button label="Washington" />
      <lp-radio-button label="Los Angeles" />
      <lp-radio-button label="Chicago" />
    </lp-radio-group>
  </div>
  <div style="margin-top: 20px">
    <lp-radio-group v-model="radio2">
      <lp-radio-button label="New York" />
      <lp-radio-button label="Washington" />
      <lp-radio-button label="Los Angeles" />
      <lp-radio-button label="Chicago" />
    </lp-radio-group>
  </div>
  <div style="margin-top: 20px">
    <lp-radio-group v-model="radio3" size="small">
      <lp-radio-button label="New York" />
      <lp-radio-button label="Washington" disabled />
      <lp-radio-button label="Los Angeles" />
      <lp-radio-button label="Chicago" />
    </lp-radio-group>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const radio1 = ref('New York');
const radio2 = ref('New York');
const radio3 = ref('New York');
</script>
