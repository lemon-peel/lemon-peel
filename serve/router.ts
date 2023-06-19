
import { createRouter, createWebHashHistory } from 'vue-router';

import type { Component } from 'vue';

function toRouteName(name: string) {
  return name.replace('./src/', '')
    .replace(/\.(vue|tsx)$/, '');
}

function toRoutePath(name: string) {
  return name.replace('./src', '')
    .replace(/\.(vue|tsx)$/, '')
    .toLowerCase();
}

// eslint-disable-next-line unused-imports/no-unused-vars
export async function getRouter(files: Record<string, () => Promise<{ default: Component }>>) {
  const router = createRouter({
    history: createWebHashHistory(),
    routes: [
      { path: '/', redirect: toRoutePath(Object.keys(files)[0]) },
      ...Object.entries(files).map(([name, load])=> {
        return {
          name: toRouteName(name),
          path: toRoutePath(name),
          // eslint-disable-next-line unicorn/no-await-expression-member
          component: async () => ((await load()).default),
        };
      }),
    ],
  });
  return router;
}
