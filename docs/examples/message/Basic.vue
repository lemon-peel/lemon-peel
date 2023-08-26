<template>
  <lp-button :plain="true" @click="open">Show message</lp-button>
  <lp-button :plain="true" @click="openVn">VNode</lp-button>
</template>

<script lang="ts" setup>
import { h } from 'vue';
import { LpMessage } from 'lemon-peel';

const open = () => {
  LpMessage('this is a message.');
};

const openVn = () => {
  LpMessage({
    message: h('p', null, [
      h('span', null, 'Message can be '),
      h('i', { style: 'color: teal' }, 'VNode'),
    ]),
  });
};
</script>
