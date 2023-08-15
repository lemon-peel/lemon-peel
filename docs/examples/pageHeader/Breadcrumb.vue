<template>
  <lp-page-header>
    <template #breadcrumb>
      <lp-breadcrumb separator="/">
        <lp-breadcrumb-item :to="{ path: './page-header.html' }">
          homepage
        </lp-breadcrumb-item>
        <lp-breadcrumb-item><a href="./page-header.html">route 1</a></lp-breadcrumb-item>
        <lp-breadcrumb-item>route 2</lp-breadcrumb-item>
      </lp-breadcrumb>
    </template>
    <template #content>
      <span class="text-large font-600 mr-3"> Title </span>
    </template>
  </lp-page-header>
</template>
