<template>
  <lp-form
    ref="formRef"
    :model="numberValidateForm"
    label-width="100px"
    class="demo-ruleForm"
  >
    <lp-form-item
      label="age"
      prop="age"
      :rules="[
        { required: true, message: 'age is required' },
        { type: 'number', message: 'age must be a number' },
      ]"
    >
      <lp-input
        v-model.number="numberValidateForm.age"
        type="text"
        autocomplete="off"
      />
    </lp-form-item>
    <lp-form-item>
      <lp-button type="primary" @click="submitForm(formRef)">Submit</lp-button>
      <lp-button @click="resetForm(formRef)">Reset</lp-button>
    </lp-form-item>
  </lp-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import type { FormInstance } from 'element-plus';

const formRef = ref<FormInstance>();

const numberValidateForm = reactive({
  age: '',
});

const submitForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.validate(valid => {
    if (valid) {
      console.log('submit!');
    } else {
      console.log('error submit!');
      return false;
    }
  });
};

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  formEl.resetFields();
};
</script>
