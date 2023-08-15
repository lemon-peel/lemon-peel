<template>
  <div>
    <lp-button mb-2 @click="toggle">Switch Language</lp-button>
    <br>

    <lp-config-provider :locale="locale">
      <lp-table mb-1 :data="[]" />
      <lp-pagination :total="100" />
    </lp-config-provider>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import en from 'element-plus/dist/locale/en.mjs';

const language = ref('zh-cn');
const locale = computed(() => (language.value === 'zh-cn' ? zhCn : en));

const toggle = () => {
  language.value = language.value === 'zh-cn' ? 'en' : 'zh-cn';
};
</script>
