<script setup lang="ts">
import { isDark, toggleDark } from '@/vitepress/composables/dark';
import CommonThemeToggler from '../common/VpThemeToggler.vue';
import { useNavbarLocale } from '../../composables/navbarLocale';

const locale = useNavbarLocale();
</script>

<template>
  <div class="full-screen-theme-toggler">
    <span>Theme</span>
    <CommonThemeToggler
      :aria-label="locale['theme-toggler']"
      :aria-checked="isDark"
      @click="toggleDark()"
    />
  </div>
</template>

<style lang="scss" scoped>
.full-screen-theme-toggler {
  display: flex;
  padding: 12px 14px;
  align-items: center;
  justify-content: space-between;
  margin-top: 16px;
  font-size: 13px;
  background-color: var(--bg-color-soft);
  border-radius: 8px;
}
</style>
../../composables/navbarLocale
