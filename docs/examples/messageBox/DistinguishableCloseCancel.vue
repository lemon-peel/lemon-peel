<template>
  <lp-button text @click="open">Click to open Message Box</lp-button>
</template>

<script lang="ts" setup>
import { LpMessage, LpMessageBox } from 'lemon-peel';
import type { Action } from 'lemon-peel';
const open = () => {
  LpMessageBox.confirm(
    'You have unsaved changes, save and proceed?',
    'Confirm',
    {
      distinguishCancelAndClose: true,
      confirmButtonText: 'Save',
      cancelButtonText: 'Discard Changes',
    },
  )
    .then(() => {
      LpMessage({
        type: 'info',
        message: 'Changes saved. Proceeding to a new route.',
      });
    })
    .catch((action: Action) => {
      LpMessage({
        type: 'info',
        message:
          action === 'cancel'
            ? 'Changes discarded. Proceeding to a new route.'
            : 'Stay in the current route',
      });
    });
};
</script>
