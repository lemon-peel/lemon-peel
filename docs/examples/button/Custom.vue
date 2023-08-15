
<template>
  <div class="flex">
    <lp-button color="#626aef" :dark="isDark">Default</lp-button>
    <lp-button color="#626aef" :dark="isDark" plain>Plain</lp-button>

    <lp-button color="#626aef" :dark="isDark" disabled>Disabled</lp-button>
    <lp-button color="#626aef" :dark="isDark" disabled plain>Disabled Plain</lp-button>
  </div>
</template>

<script lang="ts" setup>
import { isDark } from '@composables/dark';
</script>
