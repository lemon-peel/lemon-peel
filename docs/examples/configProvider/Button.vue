<template>
  <div>
    <div m="b-2">
      <lp-checkbox v-model="config.autoInsertSpace">autoInsertSpace</lp-checkbox>
    </div>

    <lp-config-provider :button="config">
      <lp-button>中文</lp-button>
    </lp-config-provider>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

const config = reactive({
  autoInsertSpace: true,
});
</script>
