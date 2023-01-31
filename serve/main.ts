
import type { Component } from 'vue';
import { createApp } from 'vue';
import '@lemon-peel/theme-chalk/src/dark/css-vars.scss';

(async () => {
  const apps = import.meta.glob<{ default: Component }>('./src/*.{vue,tsx}');
  const name = location.pathname.replace(/^\//, '') || 'App';
  const file = apps[`./src/${name}.tsx`];
  if (!file) {
    location.pathname = 'App';
    return;
  }
  const { default: App } = await file();
  const app = createApp(App);
  app.mount('#app');
})();
