<template>
  <lp-tooltip
    v-model:visible="visible"
    content="Bottom center"
    placement="bottom"
    effect="light"
    trigger="click"
    virtual-triggering
    :virtual-ref="triggerRef"
  />
  <lp-button @click="visible = !visible">test</lp-button>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';

const visible = ref(false);

const position = ref({
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
});

const triggerRef = ref({
  getBoundingClientRect() {
    return position.value;
  },
});

onMounted(() => {
  document.addEventListener('mousemove', e => {
    position.value = DOMRect.fromRect({
      width: 0,
      height: 0,
      x: e.clientX,
      y: e.clientY,
    });
  });
});
</script>
