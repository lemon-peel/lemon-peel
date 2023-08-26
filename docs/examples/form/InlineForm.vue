<template>
  <lp-form :inline="true" :model="formInline" class="demo-form-inline">
    <lp-form-item label="Approved by">
      <lp-input v-model:value="formInline.user" placeholder="Approved by" />
    </lp-form-item>
    <lp-form-item label="Activity zone">
      <lp-select v-model:value="formInline.region" placeholder="Activity zone">
        <lp-option label="Zone one" value="shanghai" />
        <lp-option label="Zone two" value="beijing" />
      </lp-select>
    </lp-form-item>
    <lp-form-item>
      <lp-button type="primary" @click="onSubmit">Query</lp-button>
    </lp-form-item>
  </lp-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

const formInline = reactive({
  user: '',
  region: '',
});

const onSubmit = () => {
  console.log('submit!');
};
</script>
