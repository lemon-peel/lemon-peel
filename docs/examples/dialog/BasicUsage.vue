<template>
  <lp-button text @click="dialogVisible = true">
    click to open the Dialog
  </lp-button>

  <lp-dialog
    v-model="dialogVisible"
    title="Tips"
    width="30%"
    :before-close="handleClose"
  >
    <span>This is a message</span>
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
import { LpMessageBox } from 'lemon-peel';

const dialogVisible = ref(false);

const handleClose = (done: () => void) => {
  LpMessageBox.confirm('Are you sure to close this dialog?')
    .then(() => {
      done();
    })
    .catch(() => {
      // catch error
    });
};
</script>
<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
