---
title: Page
lang: en-US
---

# Page Header

If path of the page is simple, it is recommended to use PageHeader instead of the Breadcrumb.

## Complete example

:::demo

pageHeader/Complete

:::

## Basic usage

Standard page header, for simply scenarios.

:::demo

pageHeader/Basic

:::

## Custom icon

The default icon might not meet your satisfaction, you can customize the icon by setting `icon` attribute
like the example.

:::demo

pageHeader/CustomIcon

:::

## No icon

Sometimes the page is just full of elements, and you might not want the icon to show up on the page,
you can set the `icon` attribute to `null` to get rid of it.

:::demo

pageHeader/NoIcon

:::

## Breadcrumbs

Page header allows you to add breadcrumbs for giving route information to the users by `breadcrumb` slot.

:::demo

pageHeader/Breadcrumb

:::

## Additional operation section

The header can be as complicated as needed, you may add additional sections to the header, to allow rich
interactions.

:::demo

pageHeader/AdditionalSections

:::

## Main content

Sometimes we want the head to show with some co-responding content, we can utilize the `default` slot for doing so.

:::demo

pageHeader/MainContent

:::

## Anatomy

The component is consisted of these parts

```vue
<template>
  <lp-page-header>
    <!-- Line 1 -->
    <template #breadcrumb />
    <!-- Line 2 -->
    <template #icon />
    <template #title />
    <template #content />
    <template #extra />
    <!-- Lines after 2 -->
    <template #default />
  </lp-page-header>
</template>
```

## Attributes

| Name    | Description    | Type                  | Accepted Values | Default |
| ------- | -------------- | --------------------- | --------------- | ------- |
| icon    | icon component | `string \| Component` | —               | Back    |
| title   | main title     | string                | —               | Back    |
| content | content        | string                | —               | —       |

## Events

| Name | Description                         | Parameters |
| ---- | ----------------------------------- | ---------- |
| back | triggers when right side is clicked | —          |

## Slots

| Name       | Description        |
| ---------- | ------------------ |
| icon       | custom icon        |
| title      | title content      |
| content    | content            |
| extra      | extra              |
| breadcrumb | breadcrumb content |
| default    | main content       |
