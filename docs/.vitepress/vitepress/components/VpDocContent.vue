<script lang="ts" setup>
import { useData } from 'vitepress';
import VPPageFooter from './doc-content/VpPageFooter.vue';
import VPPageNav from './doc-content/VpPageNav.vue';
import VPTableOfContent from './doc-content/VpTableOfContent.vue';

const { page } = useData();
</script>

<template>
  <div class="doc-content-wrapper">
    <div class="doc-content-container">
      <Content class="doc-content" />
      <VPPageFooter />
      <VPPageNav />
    </div>
    <VPTableOfContent v-if="page.headers" />
  </div>
</template>
