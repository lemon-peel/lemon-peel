<template>
  <lp-checkbox-group v-model:value="checkList">
    <lp-checkbox label="Option A" />
    <lp-checkbox label="Option B" />
    <lp-checkbox label="Option C" />
    <lp-checkbox label="disabled" disabled />
    <lp-checkbox label="selected and disabled" disabled />
  </lp-checkbox-group>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const checkList = ref(['selected and disabled', 'Option A']);

</script>
