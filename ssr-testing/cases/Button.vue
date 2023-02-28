<template>
  <lp-row style="margin-block-end: 8px">
    <lp-button size="large">Large</lp-button>
    <lp-button>Default</lp-button>
    <lp-button size="small">Small</lp-button>
    <lp-button size="large" :icon="Search">Search</lp-button>
    <lp-button :icon="Search">Search</lp-button>
    <lp-button size="small" :icon="Search">Search</lp-button>
  </lp-row>
  <lp-row style="margin-block-end: 8px">
    <lp-button size="large" round>Large</lp-button>
    <lp-button round>Default</lp-button>
    <lp-button size="small" round>Small</lp-button>
    <lp-button size="large" :icon="Search" round>Search</lp-button>
    <lp-button :icon="Search" round>Search</lp-button>
    <lp-button size="small" :icon="Search" round>Search</lp-button>
  </lp-row>
  <lp-row style="margin-block-end: 8px">
    <lp-button :icon="Search" size="large" circle />
    <lp-button :icon="Search" circle />
    <lp-button :icon="Search" size="small" circle />
  </lp-row>
</template>

<script setup lang="ts">
import { Search } from '@element-plus/icons-vue';
</script>
