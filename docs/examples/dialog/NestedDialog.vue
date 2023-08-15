<template>
  <lp-button text @click="outerVisible = true">
    open the outer Dialog
  </lp-button>

  <lp-dialog v-model="outerVisible" title="Outer Dialog">
    <template #default>
      <lp-dialog
        v-model="innerVisible"
        width="30%"
        title="Inner Dialog"
        append-to-body
      />
    </template>
    <template #footer>
      <div class="dialog-footer">
        <lp-button @click="outerVisible = false">Cancel</lp-button>
        <lp-button type="primary" @click="innerVisible = true">
          open the inner Dialog
        </lp-button>
      </div>
    </template>
  </lp-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const outerVisible = ref(false);
const innerVisible = ref(false);
</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
