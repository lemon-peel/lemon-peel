<template>
  <lp-button text @click="open">Click to open Message Box</lp-button>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import { LpMessage, LpMessageBox } from 'lemon-peel';
const open = () => {
  LpMessageBox({
    title: 'Message',
    message: h('p', null, [
      h('span', null, 'Message can be '),
      h('i', { style: 'color: teal' }, 'VNode'),
    ]),
    showCancelButton: true,
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    beforeClose: (action, instance, done) => {
      if (action === 'confirm') {
        instance.confirmButtonLoading = true;
        instance.confirmButtonText = 'Loading...';
        setTimeout(() => {
          done();
          setTimeout(() => {
            instance.confirmButtonLoading = false;
          }, 300);
        }, 3000);
      } else {
        done();
      }
    },
  }).then(action => {
    LpMessage({
      type: 'info',
      message: `action: ${action}`,
    });
  });
};
</script>
