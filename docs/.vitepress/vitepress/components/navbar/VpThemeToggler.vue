
<template>
  <div class="theme-toggler-content">
    <CommonThemeToggler
      :aria-label="locale['theme-toggler']"
      :aria-checked="isDark"
      @click="() => toggleDark()"
    />
  </div>
</template>

<script setup lang="ts">
import { isDark, toggleDark } from '@/vitepress/composables/dark';
import { useNavbarLocale } from '@/vitepress/composables/navbarLocale';

import CommonThemeToggler from '../common/VpThemeToggler.vue';

const locale = useNavbarLocale();
</script>

<style scoped lang="scss">
@use '@/vitepress/styles/mixins' as *;
.theme-toggler-content {
  @include with-bg;
  background-color: transparent;
  display: none;
  border-radius: 50%;
  height: 24px;
  padding: 0 12px;

  @include respond-to('md') {
    display: flex;
    align-items: center;
  }
}
</style>
