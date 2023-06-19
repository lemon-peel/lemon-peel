
import { createApp } from 'vue';

import { getRouter } from './router';
import App from './App.vue';

import type { Component } from 'vue';
import '@lemon-peel/theme-chalk/src/dark/css-vars.scss';

(async () => {
  const files = import.meta.glob<{ default: Component }>('./src/*.vue');
  const router = await getRouter(files as any);

  const app = createApp(App);
  app
    .use(router)
    .mount('#playground');
})();
