<template>
  <lp-button plain @click="open">Common VNode</lp-button>
  <lp-button plain @click="open1">Dynamic props</lp-button>
</template>

<script lang="ts" setup>
import { h, ref } from 'vue';
import { LpMessageBox, LpSwitch } from 'lemon-peel';

const open = () => {
  LpMessageBox({
    title: 'Message',
    message: h('p', null, [
      h('span', null, 'Message can be '),
      h('i', { style: 'color: teal' }, 'VNode'),
    ]),
  });
};

const open1 = () => {
  const checked = ref<boolean | string | number>(false);
  LpMessageBox({
    title: 'Message',
    // Should pass a function if VNode contains dynamic props
    message: () =>
      h(LpSwitch, {
        modelValue: checked.value,
        'onUpdate:modelValue': (val: boolean | string | number) => {
          checked.value = val;
        },
      }),
  });
};
</script>
