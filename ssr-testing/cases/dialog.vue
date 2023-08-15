<template>
  <lp-button type="text" @click="dialogVisible = true">click to open the Dialog</lp-button>

  <lp-dialog v-model="dialogVisible" title="Tips" width="30%">
    <span>This is a message</span>
    <template #footer>
      <span class="dialog-footer">
        <lp-button style="margin-right: 10px" @click="dialogVisible = false">Cancel</lp-button>
        <lp-button type="primary" @click="dialogVisible = false">Confirm</lp-button>
      </span>
    </template>
  </lp-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const dialogVisible = ref(true);
</script>
