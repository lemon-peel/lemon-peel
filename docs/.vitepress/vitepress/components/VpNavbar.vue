<script setup lang="ts">
import { computed } from 'vue';
import { inBrowser, useData } from 'vitepress';

import VPNavbarSearch from './navbar/VpSearch.vue';
import VPNavbarMenu from './navbar/VpMenu.vue';
import VPNavbarThemeToggler from './navbar/VpThemeToggler.vue';
import VPNavbarTranslation from './navbar/VpTranslation.vue';
import VPNavbarSocialLinks from './navbar/VpSocialLinks.vue';
import VPNavbarHamburger from './navbar/VpHamburger.vue';

defineProps<{
  fullScreen: boolean;
}>();

defineEmits(['toggle']);

const { theme, page } = useData();

const currentLink = computed(() => {
  if (!inBrowser) {
    return `/${page.value?.frontmatter?.lang || ''}/`;
  }
  const existLangIndex = theme.value.langs.findIndex(lang =>
    window?.location?.pathname.startsWith(`/${lang}`),
  );

  return existLangIndex === -1 ? '/' : `/${theme.value.langs[existLangIndex]}/`;
});
</script>

<template>
  <div class="navbar-wrapper">
    <div class="header-container">
      <div class="logo-container">
        <a :href="currentLink">
          <img
            class="logo"
            src="/images/element-plus-logo.svg"
            alt="Element Plus Logo"
          >
        </a>
      </div>
      <div class="content">
        <VPNavbarSearch class="search" :options="theme.agolia" multilang />
        <VPNavbarMenu class="menu" />
        <VPNavbarThemeToggler class="theme-toggler" />
        <VPNavbarTranslation class="translation" />
        <VPNavbarSocialLinks class="social-links" />
        <VPNavbarHamburger
          :active="fullScreen"
          class="hamburger"
          @click="$emit('toggle')"
        />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.logo-container {
  display: flex;
  align-items: center;
  height: var(--header-height);
  > a {
    height: 28px;
    width: 128px;
  }
  .logo {
    position: relative;
    height: 100%;
  }
}
</style>
