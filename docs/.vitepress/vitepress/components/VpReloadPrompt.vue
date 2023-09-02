<script setup lang="ts">
import { computed, watch } from 'vue';
import { useStorage } from '@vueuse/core';
// eslint-disable-next-line import/no-unresolved
import { useRegisterSW } from 'virtual:pwa-register/vue';
import { useLang } from '../composables/lang';
import pwaLocale from '../../i18n/component/pwa.json';

type PwaLocale = typeof pwaLocale['en-US'];

const lang = useLang();
const locale = computed(() => (pwaLocale as Record<string, PwaLocale>)[lang.value]);
const { needRefresh, updateServiceWorker } = useRegisterSW();
const alwaysRefresh = useStorage('PWA_Always_Refresh', false);

watch(needRefresh, value => {
  value && alwaysRefresh.value && updateServiceWorker();
});
</script>

<template>
  <transition name="pwa-popup">
    <lp-card v-if="!alwaysRefresh && needRefresh" class="pwa-card" role="alert">
      <p class="pwa-card-text">{{ locale.message }}</p>
      <lp-button type="primary" plain @click="updateServiceWorker()">
        {{ locale.refresh }}
      </lp-button>
      <lp-button plain @click="alwaysRefresh = true">
        {{ locale['always-refresh'] }}
      </lp-button>
      <lp-button plain @click="needRefresh = false">
        {{ locale.close }}
      </lp-button>
    </lp-card>
  </transition>
</template>

<style scoped>
.pwa-card {
  position: fixed;
  right: 1em;
  bottom: 1em;
  z-index: 3000;
  text-align: center;
}

.pwa-card .pwa-card-text {
  margin: 0 0 1em;
}

.pwa-popup-enter-active,
.pwa-popup-leave-active {
  transition: var(--el-transition-md-fade);
}

.pwa-popup-enter,
.pwa-popup-leave-to {
  opacity: 0;
  transform: translate(0, 50%) scale(0.5);
}
</style>
