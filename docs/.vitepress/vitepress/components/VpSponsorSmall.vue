
<template>
  <div>
    <a
      v-for="item in leftLogoSponsors"
      :key="item.name"
      :class="[
        'sponsor-item inline-flex items-center',
        item.isDark && isDark ? 'filter invert' : '',
      ]"
      :href="item.url"
      :title="`${item.name_cn || item.name} - ${item.slogan_cn || item.slogan}`"
      target="_blank"
      @click="onItemClick(item)"
    >
      <img :src="item.img" :alt="item.name">
    </a>
  </div>
</template>

<script setup lang="ts">
import { isDark } from '@/vitepress/composables/dark';
import { sendEvent } from '@/config/analytics';
import { leftLogoSponsors } from '@/config/sponsors';

const onItemClick = (item: any) => {
  sendEvent('sp_click', item.name, 'left_small_img');
};
</script>

<style scoped lang="scss">
@use '../styles/mixins' as *;
div {
  display: flex;
  align-items: center;
  .sponsor-item {
    margin-right: 4px;
    height: 36px;
    width: 36px;

    @include respond-to('max') {
      height: 44px;
      width: 44px;
    }

    @media (max-width: 767px) {
      width: 44px;
      height: 44px;
    }

    img {
      height: 100%;
      width: 100%;
    }
  }

  @include respond-to('xs') {
    width: 196px;
  }
}
</style>
