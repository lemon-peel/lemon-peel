<script lang="ts" setup>
defineProps<{
  version: string;
}>();
</script>

<template>
  <lp-tag size="small" effect="plain" hit round class="ml-2">
    {{ version }}
  </lp-tag>
</template>
