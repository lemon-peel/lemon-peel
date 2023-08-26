<template>
  <div>
    <lp-checkbox v-model:checked="checked1" label="Option1" size="large" border />
    <lp-checkbox v-model:checked="checked2" label="Option2" size="large" border />
  </div>
  <div class="mt-4">
    <lp-checkbox v-model:checked="checked3" label="Option1" border />
    <lp-checkbox v-model:checked="checked4" label="Option2" border />
  </div>
  <div class="mt-4">
    <lp-checkbox-group v-model:value="checkboxGroup1" size="small">
      <lp-checkbox label="Option1" border />
      <lp-checkbox label="Option2" border />
    </lp-checkbox-group>
  </div>
  <div class="mt-4">
    <lp-checkbox-group v-model:value="checkboxGroup1" size="small">
      <lp-checkbox label="Option1" border disabled />
      <lp-checkbox label="Option2" border disabled />
    </lp-checkbox-group>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const checked1 = ref(true);
const checked2 = ref(false);
const checked3 = ref(false);
const checked4 = ref(true);
const checkboxGroup1 = ref(['Option1']);
</script>
