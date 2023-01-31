<template>
  <li :class="ns.b()">
    <div :class="ns.e('title')">
      <template v-if="!$slots.title">{{ title }}</template>
      <slot v-else name="title" />
    </div>
    <ul>
      <slot />
    </ul>
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useNamespace } from '@lemon-peel/hooks';
import { menuItemGroupProps } from './menuItemGroup';

const COMPONENT_NAME = 'LpMenuItemGroup';

export default defineComponent({
  name: COMPONENT_NAME,

  props: menuItemGroupProps,

  setup() {
    const ns = useNamespace('menu-item-group');

    return {
      ns,
    };
  },
});
</script>
