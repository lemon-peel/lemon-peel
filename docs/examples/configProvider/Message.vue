<template>
  <div>
    <lp-config-provider :message="config">
      <lp-button @click="open">OPEN</lp-button>
    </lp-config-provider>
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';
import { LpMessage } from 'lemon-peel';
const config = reactive({
  max: 3,
});
const open = () => {
  LpMessage('This is a message.');
};
</script>
