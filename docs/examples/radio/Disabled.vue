<template>
  <lp-radio v-model:value="radio" disabled label="disabled">Option A</lp-radio>
  <lp-radio v-model:value="radio" disabled label="selected and disabled">Option B</lp-radio>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const radio = ref('selected and disabled');
</script>
