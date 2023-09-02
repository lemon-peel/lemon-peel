
<template>
  <lp-result icon="error" :title="locale.title" :sub-title="locale.desc">
    <template #extra>
      <lp-button @click="goHome">{{ locale['button-title'] }}</lp-button>
    </template>
  </lp-result>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { isClient } from '@vueuse/core';
import { useLang } from '../composables/lang';
import localeData from '../../i18n/pages/not-found.json';

const lang = useLang();

const locale = computed(() => localeData[lang.value]);

const goHome = () => {
  if (!isClient) return;
  location.href = `/${lang.value}/`;
};
</script>

<style scoped>
.el-result {
  height: 100vh;
  width: 100vw;
}
</style>
