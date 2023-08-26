<template>
  <lp-form :model="form" label-width="120px">
    <lp-form-item label="Activity name">
      <lp-input v-model:value="form.name" />
    </lp-form-item>
    <lp-form-item label="Activity zone">
      <lp-select v-model:value="form.region" placeholder="please select your zone">
        <lp-option label="Zone one" value="shanghai" />
        <lp-option label="Zone two" value="beijing" />
      </lp-select>
    </lp-form-item>
    <lp-form-item label="Activity time">
      <lp-col :span="11">
        <lp-date-picker
          v-model:value="form.date1"
          type="date"
          placeholder="Pick a date"
          style="width: 100%"
        />
      </lp-col>
      <lp-col :span="2" class="text-center">
        <span class="text-gray-500">-</span>
      </lp-col>
      <lp-col :span="11">
        <lp-time-picker
          v-model:value="form.date2"
          placeholder="Pick a time"
          style="width: 100%"
        />
      </lp-col>
    </lp-form-item>
    <lp-form-item label="Instant delivery">
      <lp-switch v-model:value="form.delivery" />
    </lp-form-item>
    <lp-form-item label="Activity type">
      <lp-checkbox-group v-model:value="form.type">
        <lp-checkbox label="Online activities" name="type" />
        <lp-checkbox label="Promotion activities" name="type" />
        <lp-checkbox label="Offline activities" name="type" />
        <lp-checkbox label="Simple brand exposure" name="type" />
      </lp-checkbox-group>
    </lp-form-item>
    <lp-form-item label="Resources">
      <lp-radio-group v-model:value="form.resource">
        <lp-radio label="Sponsor" />
        <lp-radio label="Venue" />
      </lp-radio-group>
    </lp-form-item>
    <lp-form-item label="Activity form">
      <lp-input v-model:value="form.desc" type="textarea" />
    </lp-form-item>
    <lp-form-item>
      <lp-button type="primary" @click="onSubmit">Create</lp-button>
      <lp-button>Cancel</lp-button>
    </lp-form-item>
  </lp-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

// do not use same name with ref
const form = reactive({
  name: '',
  region: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
});

const onSubmit = () => {
  console.log('submit!');
};
</script>
