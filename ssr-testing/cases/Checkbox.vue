<template>
  <div>
    <lp-checkbox v-model:checked="checked1" label="Option 1" size="large" />
    <lp-checkbox v-model:checked="checked2" label="Option 2" size="large" />
  </div>
  <div>
    <lp-checkbox v-model:checked="checked3" label="Option 1" />
    <lp-checkbox v-model:checked="checked4" label="Option 2" />
  </div>
  <div>
    <lp-checkbox v-model:checked="checked5" label="Option 1" size="small" />
    <lp-checkbox v-model:checked="checked6" label="Option 2" size="small" />
  </div>
  <div>
    <lp-checkbox v-model:checked="checked5" label="Option 1" size="small" disabled />
    <lp-checkbox v-model:checked="checked6" label="Option 2" size="small" disabled />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const checked1 = ref(true);
const checked2 = ref(false);
const checked3 = ref(false);
const checked4 = ref(false);
const checked5 = ref(false);
const checked6 = ref(false);
</script>
