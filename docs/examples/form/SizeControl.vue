<template>
  <div>
    <lp-radio-group v-model:value="value=&quot;size&quot;" label="size control">
      <lp-radio-button label="large">large</lp-radio-button>
      <lp-radio-button label="default">default</lp-radio-button>
      <lp-radio-button label="small">small</lp-radio-button>
    </lp-radio-group>
    <lp-radio-group v-model:value="labelPosition" label="position control">
      <lp-radio-button label="left">Left</lp-radio-button>
      <lp-radio-button label="right">Right</lp-radio-button>
      <lp-radio-button label="top">Top</lp-radio-button>
    </lp-radio-group>
  </div>
  <br>
  <lp-form
    ref="form"
    :model="sizeForm"
    label-width="auto"
    :label-position="labelPosition"
    :size="size"
  >
    <lp-form-item label="Activity name">
      <lp-input v-model:value="sizeForm.name" />
    </lp-form-item>
    <lp-form-item label="Activity zone">
      <lp-select
        v-model:value="sizeForm.region"
        placeholder="please select your zone"
      >
        <lp-option label="Zone one" value="shanghai" />
        <lp-option label="Zone two" value="beijing" />
      </lp-select>
    </lp-form-item>
    <lp-form-item label="Activity time">
      <lp-col :span="11">
        <lp-date-picker
          v-model:value="sizeForm.date1"
          type="date"
          label="Pick a date"
          placeholder="Pick a date"
          style="width: 100%"
        />
      </lp-col>
      <lp-col class="text-center" :span="1" style="margin: 0 0.5rem">-</lp-col>
      <lp-col :span="11">
        <lp-time-picker
          v-model:value="sizeForm.date2"
          label="Pick a time"
          placeholder="Pick a time"
          style="width: 100%"
        />
      </lp-col>
    </lp-form-item>
    <lp-form-item label="Activity type">
      <lp-checkbox-group v-model:value="sizeForm.type">
        <lp-checkbox-button label="Online activities" name="type" />
        <lp-checkbox-button label="Promotion activities" name="type" />
      </lp-checkbox-group>
    </lp-form-item>
    <lp-form-item label="Resources">
      <lp-radio-group v-model:value="sizeForm.resource">
        <lp-radio border label="Sponsor" />
        <lp-radio border label="Venue" />
      </lp-radio-group>
    </lp-form-item>
    <lp-form-item>
      <lp-button type="primary" @click="onSubmit">Create</lp-button>
      <lp-button>Cancel</lp-button>
    </lp-form-item>
  </lp-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';

const size = ref('default');
const labelPosition = ref('right');

const sizeForm = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
});

function onSubmit() {
  console.log('submit!');
}
</script>

<style>
.lp-radio-group {
  margin-right: 12px;
}
</style>
