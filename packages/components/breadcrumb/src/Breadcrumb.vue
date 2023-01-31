<template>
  <div
    ref="breadcrumb"
    :class="ns.b()"
    aria-label="Breadcrumb"
    role="navigation"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, provide, ref } from 'vue';
import { breadcrumbKey } from '@lemon-peel/tokens';

import { useNamespace } from '@lemon-peel/hooks';
import { breadcrumbProps } from './breadcrumb';

defineOptions({
  name: 'LpBreadcrumb',
});

const props = defineProps(breadcrumbProps);

const ns = useNamespace('breadcrumb');
const breadcrumb = ref<HTMLDivElement>();

provide(breadcrumbKey, props);

onMounted(() => {
  const items = breadcrumb.value!.querySelectorAll(`.${ns.e('item')}`);
  if (items.length > 0) {
    items[items.length - 1].setAttribute('aria-current', 'page');
  }
});
</script>
