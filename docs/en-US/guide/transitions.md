---
title: Built-in Transitions
lang: en-US
---

# Built-in Transition

You can use Element's built-in transitions directly.
Before that, please read the [transition docs](https://vuejs.org/guide/built-ins/transition.html).

## Fade

:::demo We have two fading effects: `el-fade-in-linear` and `el-fade-in`.

transitions/Fade

:::

## Zoom

:::demo `el-zoom-in-center`, `el-zoom-in-top` and `el-zoom-in-bottom` are provided.

transitions/Zoom

:::

## Collapse

For collapse effect, use the `el-collapse-transition` component.

:::demo

transitions/Collapse

:::

## On-demand import

```ts
// collapse
import { LpCollapseTransition } from 'lemon-peel';

// fade/zoom
import 'lemon-peel/lib/theme-chalk/base.css';
import App from './App.vue';

const app = createApp(App);
app.component(LpCollapseTransition.name, LpCollapseTransition);
```
