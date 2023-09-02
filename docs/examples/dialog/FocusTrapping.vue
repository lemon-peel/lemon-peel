<template>
  <lp-button text @click="dialogVisible = true">
    click to open the Dialog
  </lp-button>

  <div>
    <p>Close dialog and the input will be focused</p>
    <lp-input ref="inputRef" placeholder="Please input" />
  </div>

  <lp-dialog
    v-model="dialogVisible"
    destroy-on-close
    title="Tips"
    width="30%"
    @close-auto-focus="handleCloseAutoFocus"
  >
    <span>This is a message</span>
    <lp-divider />
    <lp-input placeholder="Initially focused" />
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
import { LpInput } from 'lemon-peel';

const dialogVisible = ref(false);
const inputRef = ref<InstanceType<typeof LpInput>>();

const handleCloseAutoFocus = () => {
  inputRef.value?.focus();
};
</script>

<style scoped>
.dialog-footer button:first-child {
  margin-right: 10px;
}
</style>
