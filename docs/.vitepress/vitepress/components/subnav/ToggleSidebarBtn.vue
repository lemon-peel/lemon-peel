<script lang="ts" setup>
import ToggleButton from '../icons/ToggleButton.vue';
</script>

<template>
  <button class="reset-btn sidebar-button flex items-center">
    <LpIcon :size="20" class="mr-2">
      <ToggleButton />
    </LpIcon>
    <span class="leading-6">Menu</span>
  </button>
</template>

<style>
.sidebar-button {
  cursor: pointer;
  color: var(--text-color);
}

.sidebar-button .icon {
  display: block;
  width: 1.25rem;
  height: 1.25rem;
}

/* @media screen and (max-width: 1044px) {
  .sidebar-button {
    display: block;
  }
} */
</style>
