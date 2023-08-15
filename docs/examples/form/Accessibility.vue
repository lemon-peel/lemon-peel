<template>
  <lp-form label-position="left" label-width="150px" style="max-width: 460px">
    <lp-space fill>
      <lp-alert type="info" show-icon :closable="false">
        <p>"Full Name" label is automatically attached to the input:</p>
      </lp-alert>
      <lp-form-item label="Full Name">
        <lp-input v-model="formAccessibility.fullName" />
      </lp-form-item>
    </lp-space>
    <lp-space fill>
      <lp-alert type="info" show-icon :closable="false">
        <p>
          "Your Information" serves as a label for the group of inputs. <br>
          You must specify labels on the individal inputs. Placeholders are not
          replacements for using the "label" attribute.
        </p>
      </lp-alert>
      <lp-form-item label="Your Information">
        <lp-row :gutter="20">
          <lp-col :span="12">
            <lp-input
              v-model="formAccessibility.firstName"
              label="First Name"
              placeholder="First Name"
            />
          </lp-col>
          <lp-col :span="12">
            <lp-input
              v-model="formAccessibility.lastName"
              label="Last Name"
              placeholder="Last Name"
            />
          </lp-col>
        </lp-row>
      </lp-form-item>
    </lp-space>
  </lp-form>
</template>

<script lang="ts" setup>
import { reactive } from 'vue';

const formAccessibility = reactive({
  fullName: '',
  firstName: '',
  lastName: '',
});
</script>
