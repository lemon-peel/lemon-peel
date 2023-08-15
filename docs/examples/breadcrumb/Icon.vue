<template>
  <lp-breadcrumb :separator-icon="ArrowRight">
    <lp-breadcrumb-item :to="{ path: '/' }">homepage</lp-breadcrumb-item>
    <lp-breadcrumb-item>promotion management</lp-breadcrumb-item>
    <lp-breadcrumb-item>promotion list</lp-breadcrumb-item>
    <lp-breadcrumb-item>promotion detail</lp-breadcrumb-item>
  </lp-breadcrumb>
</template>

<script lang="ts" setup>
import { ArrowRight } from '@element-plus/icons-vue';
</script>
