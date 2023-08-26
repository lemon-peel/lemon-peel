<template>
  <lp-form
    ref="ruleFormRef"
    :model="ruleForm"
    status-icon
    :rules="rules"
    label-width="120px"
    class="demo-ruleForm"
  >
    <lp-form-item label="Password" prop="pass">
      <lp-input v-model:value="value=&quot;ruleForm.pass&quot;" type="password" autocomplete="off" />
    </lp-form-item>
    <lp-form-item label="Confirm" prop="checkPass">
      <lp-input
        v-model:value="ruleForm.checkPass"
        type="password"
        autocomplete="off"
      />
    </lp-form-item>
    <lp-form-item label="Age" prop="age">
      <lp-input v-model.number="ruleForm.age" />
    </lp-form-item>
    <lp-form-item>
      <lp-button type="primary" @click="submitForm(ruleFormRef)">Submit</lp-button>
      <lp-button @click="resetForm(ruleFormRef)">Reset</lp-button>
    </lp-form-item>
  </lp-form>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue';
import type { FormInstance } from 'lemon-peel';

const ruleFormRef = ref<FormInstance>();

const checkAge = (rule: any, value: any, callback: any) => {
  if (!value) {
    return callback(new Error('Please input the age'));
  }
  setTimeout(() => {
    if (Number.isInteger(value)) {
      if (value < 18) {
        callback(new Error('Age must be greater than 18'));
      } else {
        callback();
      }
    } else {
      callback(new Error('Please input digits'));
    }
  }, 1000);
};

const ruleForm = reactive({
  pass: '',
  checkPass: '',
  age: '',
});

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the password'));
  } else {
    if (ruleForm.checkPass !== '') {
      if (!ruleFormRef.value) return;
      ruleFormRef.value.validateField('checkPass', () => null);
    }
    callback();
  }
};
const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the password again'));
  } else if (value === ruleForm.pass) {
    callback();
  } else {
    callback(new Error("Two inputs don't match!"));
  }
};

const rules = reactive({
  pass: [{ validator: validatePass, trigger: 'blur' }],
  checkPass: [{ validator: validatePass2, trigger: 'blur' }],
  age: [{ validator: checkAge, trigger: 'blur' }],
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
