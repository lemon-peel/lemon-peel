
import type { Component } from 'vue';
import { createApp } from 'vue';
import '@lemon-peel/theme-chalk/src/dark/css-vars.scss';

let a = 0;

(async () => {
  const apps = import.meta.glob<{ default: Component }>('./src/*.vue');
  const name = location.pathname.replace(/^\//, '') || 'App';
  const file = apps[`./src/${name}.vue`];
  if (!file) {
    location.pathname = 'App';
    return;
  }
  const { default: App } = await file();
  const app = createApp(App);
  a = '';
  console.info(a);
  app.mount('#app');
})();
