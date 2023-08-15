<template>
  <lp-row class="mb-4">
    <lp-button>Default</lp-button>
    <lp-button type="primary">Primary</lp-button>
    <lp-button type="success">Success</lp-button>
    <lp-button type="info">Info</lp-button>
    <lp-button type="warning">Warning</lp-button>
    <lp-button type="danger">Danger</lp-button>
  </lp-row>

  <lp-row class="mb-4">
    <lp-button plain>Plain</lp-button>
    <lp-button type="primary" plain>Primary</lp-button>
    <lp-button type="success" plain>Success</lp-button>
    <lp-button type="info" plain>Info</lp-button>
    <lp-button type="warning" plain>Warning</lp-button>
    <lp-button type="danger" plain>Danger</lp-button>
  </lp-row>

  <lp-row class="mb-4">
    <lp-button round>Round</lp-button>
    <lp-button type="primary" round>Primary</lp-button>
    <lp-button type="success" round>Success</lp-button>
    <lp-button type="info" round>Info</lp-button>
    <lp-button type="warning" round>Warning</lp-button>
    <lp-button type="danger" round>Danger</lp-button>
  </lp-row>

  <lp-row>
    <lp-button :icon="Search" circle />
    <lp-button type="primary" :icon="Edit" circle />
    <lp-button type="success" :icon="Check" circle />
    <lp-button type="info" :icon="Message" circle />
    <lp-button type="warning" :icon="Star" circle />
    <lp-button type="danger" :icon="Delete" circle />
  </lp-row>
</template>

<script lang="ts" setup>
import { Check, Delete, Edit, Message, Search, Star } from '@element-plus/icons-vue';
</script>
