<script setup lang="ts">
import { useSocialLinks } from '../../composables/socialLinks';
import VPSocialLink from './VpSocialLink.vue';

const links = useSocialLinks();
</script>

<template>
  <div class="social-links">
    <VPSocialLink v-for="link in links" :key="link.text" v-bind="link" />
  </div>
</template>

<style scoped lang="scss">
.social-links {
  height: 24px;
  padding: 0 12px;
}
</style>
../../composables/socialLinks
