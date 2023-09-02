---
title: Container
lang: en-US
---

# Container

Container components for scaffolding basic structure of the page:

`<lp-container>`: wrapper container. When nested with a `<lp-header>` or `<lp-footer>`, all its child elements will be vertically arranged. Otherwise horizontally.

`<lp-header>`: container for headers.

`<lp-aside>`: container for side sections (usually a side nav).

`<lp-main>`: container for main sections.

`<lp-footer>`: container for footers.

:::tip

These components use flex for layout, so please make sure your browser supports it. Besides, `<lp-container>`'s direct child elements have to be one or more of the latter four components. And father element of the latter four components must be a `<lp-container>`.

:::

## Common layouts

<style lang="scss">
@use '../../examples/container/common-layout.scss';
</style>

:::demo

container/LayoutHm

:::

:::demo

container/LayoutHmf

:::

:::demo

container/LayoutAm

:::

:::demo

container/LayoutHam

:::

:::demo

container/LayoutHamf

:::

:::demo

container/LayoutAhm

:::

:::demo

container/LayoutAhmf

:::

## Example

:::demo

container/Example

:::

## Container Attributes

| Name      | Description                         | Type   | Accepted Values       | Default                                                                    |
| --------- | ----------------------------------- | ------ | --------------------- | -------------------------------------------------------------------------- |
| direction | layout direction for child elements | string | horizontal / vertical | vertical when nested with `el-header` or `el-footer`; horizontal otherwise |

## Container Slots

| Name | Description               | Subtags                                    |
| ---- | ------------------------- | ------------------------------------------ |
| —    | customize default content | Container / Header / Aside / Main / Footer |

## Header Attributes

| Name   | Description          | Type   | Accepted Values | Default |
| ------ | -------------------- | ------ | --------------- | ------- |
| height | height of the header | string | —               | 60px    |

## Header Slots

| Name | Description               |
| ---- | ------------------------- |
| —    | customize default content |

## Aside Attributes

| Name  | Description               | Type   | Accepted Values | Default |
| ----- | ------------------------- | ------ | --------------- | ------- |
| width | width of the side section | string | —               | 300px   |

## Aside Slots

| Name | Description               |
| ---- | ------------------------- |
| —    | customize default content |

## Main Slots

| Name | Description               |
| ---- | ------------------------- |
| —    | customize default content |

## Footer Attributes

| Name   | Description          | Type   | Accepted Values | Default |
| ------ | -------------------- | ------ | --------------- | ------- |
| height | height of the footer | string | —               | 60px    |

## Footer Slots

| Name | Description               |
| ---- | ------------------------- |
| —    | customize default content |
