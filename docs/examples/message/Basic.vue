<template>
  <lp-button :plain="true" @click="open">Show message</lp-button>
  <lp-button :plain="true" @click="openVn">VNode</lp-button>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import { ElMessage } from 'element-plus';

const open = () => {
  ElMessage('this is a message.');
};

const openVn = () => {
  ElMessage({
    message: h('p', null, [
      h('span', null, 'Message can be '),
      h('i', { style: 'color: teal' }, 'VNode'),
    ]),
  });
};
</script>
