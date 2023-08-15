<template>
  <aside :class="ns.b()" :style="style">
    <slot />
  </aside>
</template>
<script lang="ts" setup>
import { computed } from 'vue';
import { useNamespace } from '@lemon-peel/hooks';

import type { CSSProperties } from 'vue';

defineOptions({
  name: 'LpAside',
});
const props = defineProps({
  width: {
    type: String,
    default: null,
  },
});

const ns = useNamespace('aside');
const style = computed(
  () =>
    (props.width ? ns.cssVarBlock({ width: props.width }) : {}) as CSSProperties,
);
</script>
