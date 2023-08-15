<template>
  <lp-radio-group v-model="labelPosition" label="label position">
    <lp-radio-button label="left">Left</lp-radio-button>
    <lp-radio-button label="right">Right</lp-radio-button>
    <lp-radio-button label="top">Top</lp-radio-button>
  </lp-radio-group>
  <div style="margin: 20px" />
  <lp-form
    :label-position="labelPosition"
    label-width="100px"
    :model="formLabelAlign"
    style="max-width: 460px"
  >
    <lp-form-item label="Name">
      <lp-input v-model="formLabelAlign.name" />
    </lp-form-item>
    <lp-form-item label="Activity zone">
      <lp-input v-model="formLabelAlign.region" />
    </lp-form-item>
    <lp-form-item label="Activity form">
      <lp-input v-model="formLabelAlign.type" />
    </lp-form-item>
  </lp-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';

const labelPosition = ref('right');

const formLabelAlign = reactive({
  name: '',
  region: '',
  type: '',
});
</script>
