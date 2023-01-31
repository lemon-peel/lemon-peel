<template>
  <main :class="ns.b()">
    <slot />
  </main>
</template>
<script lang="ts" setup>
import { useNamespace } from '@lemon-peel/hooks';

defineOptions({
  name: 'LpMain',
});

const ns = useNamespace('main');
</script>
