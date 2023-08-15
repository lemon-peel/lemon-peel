<template>
  <lp-button text @click="dialogVisible = true">
    Click to open Dialog
  </lp-button>

  <lp-dialog v-model="dialogVisible" title="Tips" width="30%" draggable>
    <span>It's a draggable Dialog</span>
    <template #footer>
      <span class="dialog-footer">
        <lp-button @click="dialogVisible = false">Cancel</lp-button>
        <lp-button type="primary" @click="dialogVisible = false">
          Confirm
        </lp-button>
      </span>
    </template>
  </lp-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const dialogVisible = ref(false);
</script>
