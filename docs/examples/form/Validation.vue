<template>
  <lp-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    label-width="120px"
    class="demo-ruleForm"
    :size="formSize"
    status-icon
  >
    <lp-form-item label="Activity name" prop="name">
      <lp-input v-model:value="ruleForm.name" />
    </lp-form-item>
    <lp-form-item label="Activity zone" prop="region">
      <lp-select v-model:value="ruleForm.region" placeholder="Activity zone">
        <lp-option label="Zone one" value="shanghai" />
        <lp-option label="Zone two" value="beijing" />
      </lp-select>
    </lp-form-item>
    <lp-form-item label="Activity count" prop="count">
      <lp-select-v2
        v-model:value="ruleForm.count"
        placeholder="Activity count"
        :options="options"
      />
    </lp-form-item>
    <lp-form-item label="Activity time" required>
      <lp-col :span="11">
        <lp-form-item prop="date1">
          <lp-date-picker
            v-model:value="ruleForm.date1"
            type="date"
            label="Pick a date"
            placeholder="Pick a date"
            style="width: 100%"
          />
        </lp-form-item>
      </lp-col>
      <lp-col class="text-center" :span="2">
        <span class="text-gray-500">-</span>
      </lp-col>
      <lp-col :span="11">
        <lp-form-item prop="date2">
          <lp-time-picker
            v-model:value="ruleForm.date2"
            label="Pick a time"
            placeholder="Pick a time"
            style="width: 100%"
          />
        </lp-form-item>
      </lp-col>
    </lp-form-item>
    <lp-form-item label="Instant delivery" prop="delivery">
      <lp-switch v-model:value="ruleForm.delivery" />
    </lp-form-item>
    <lp-form-item label="Activity type" prop="type">
      <lp-checkbox-group v-model:value="ruleForm.type">
        <lp-checkbox label="Online activities" name="type" />
        <lp-checkbox label="Promotion activities" name="type" />
        <lp-checkbox label="Offline activities" name="type" />
        <lp-checkbox label="Simple brand exposure" name="type" />
      </lp-checkbox-group>
    </lp-form-item>
    <lp-form-item label="Resources" prop="resource">
      <lp-radio-group v-model:value="ruleForm.resource">
        <lp-radio label="Sponsorship" />
        <lp-radio label="Venue" />
      </lp-radio-group>
    </lp-form-item>
    <lp-form-item label="Activity form" prop="desc">
      <lp-input v-model:value="ruleForm.desc" type="textarea" />
    </lp-form-item>
    <lp-form-item>
      <lp-button type="primary" @click="submitForm(ruleFormRef)">Create</lp-button>
      <lp-button @click="resetForm(ruleFormRef)">Reset</lp-button>
    </lp-form-item>
  </lp-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import type { FormInstance, FormRules } from 'lemon-peel';

const formSize = ref('default');
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive({
  name: 'Hello',
  region: '',
  count: '',
  date1: '',
  date2: '',
  delivery: false,
  type: [],
  resource: '',
  desc: '',
});

const rules = reactive<FormRules>({
  name: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
    { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
  ],
  region: [
    {
      required: true,
      message: 'Please select Activity zone',
      trigger: 'change',
    },
  ],
  count: [
    {
      required: true,
      message: 'Please select Activity count',
      trigger: 'change',
    },
  ],
  date1: [
    {
      type: 'date',
      required: true,
      message: 'Please pick a date',
      trigger: 'change',
    },
  ],
  date2: [
    {
      type: 'date',
      required: true,
      message: 'Please pick a time',
      trigger: 'change',
    },
  ],
  type: [
    {
      type: 'array',
      required: true,
      message: 'Please select at least one activity type',
      trigger: 'change',
    },
  ],
  resource: [
    {
      required: true,
      message: 'Please select activity resource',
      trigger: 'change',
    },
  ],
  desc: [
    { required: true, message: 'Please input activity form', trigger: 'blur' },
  ],
});

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!');
    } else {
      console.log('error submit!', fields);
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};

const options = Array.from({ length: 10_000 }).map((_, idx) => ({
  value: `${idx + 1}`,
  label: `${idx + 1}`,
}));
</script>
