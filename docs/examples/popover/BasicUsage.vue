<template>
  <lp-popover
    placement="top-start"
    title="Title"
    :width="200"
    trigger="hover"
    content="this is content, this is content, this is content"
  >
    <template #reference>
      <lp-button>Hover to activate</lp-button>
    </template>
  </lp-popover>

  <lp-popover
    placement="bottom"
    title="Title"
    :width="200"
    trigger="click"
    content="this is content, this is content, this is content"
  >
    <template #reference>
      <lp-button>Click to activate</lp-button>
    </template>
  </lp-popover>

  <lp-popover
    ref="popover"
    placement="right"
    title="Title"
    :width="200"
    trigger="focus"
    content="this is content, this is content, this is content"
  >
    <template #reference>
      <lp-button>Focus to activate</lp-button>
    </template>
  </lp-popover>

  <lp-popover
    ref="popover"
    title="Title"
    :width="200"
    trigger="contextmenu"
    content="this is content, this is content, this is content"
  >
    <template #reference>
      <lp-button>contextmenu to activate</lp-button>
    </template>
  </lp-popover>

  <lp-popover
    :visible="visible"
    placement="bottom"
    title="Title"
    :width="200"
    content="this is content, this is content, this is content"
  >
    <template #reference>
      <lp-button @click="visible = !visible">Manual to activate</lp-button>
    </template>
  </lp-popover>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const visible = ref(false);
</script>
