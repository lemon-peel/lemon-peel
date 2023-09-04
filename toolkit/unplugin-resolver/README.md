<h1 align="center">Unplugin aresolver for <a href="https://www.npmjs.com/package/lemon-peel">Lemon-Peel</a></h1>

## Install

```shell
# npm
npm i @lemon-peel/unplugin-resolver -D
# yarn
yarn add @lemon-peel/unplugin-resolver --dev
# pnpm
pnpm add @lemon-peel/unplugin-resolver -D
```

## Usage

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import Components from 'unplugin-vue-components/vite';
import LomonPeelResolver from '@lemon-peel/unplugin-resolver';

export default defineConfig({
  plugins: [
    Components({
      resolvers: LomonPeelResolver({ /* options */ }),
    }),
  ],
});
```

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import Components from 'unplugin-vue-components/rollup';
import LomonPeelResolver from '@lemon-peel/unplugin-resolver';

export default {
  plugins: [
    Components({
      resolvers: LomonPeelResolver({ /* options */ }),
    }),
  ],
};
```

<br></details>


<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('unplugin-vue-components/webpack')({
      resolvers: LomonPeelResolver({ /* options */ }),
    }),
  ],
};
```

<br></details>

Licensed as [MIT](../LICENSE).
