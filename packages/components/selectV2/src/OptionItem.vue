<template>
  <li
    :aria-selected="selected"
    :style="style"
    :class="[
      ns.be('dropdown', 'option-item'),
      ns.is('selected', selected),
      ns.is('disabled', disabled),
      ns.is('created', created),
      { hover: hovering },
    ]"
    @mouseenter="hoverItem"
    @click.stop="selectOptionClick"
  >
    <slot :item="item" :index="index" :disabled="disabled">
      <span>{{ item!.label }}</span>
    </slot>
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useNamespace } from '@lemon-peel/hooks';
import { useOption } from './useOption';
import { optionProps } from './defaults';

export default defineComponent({
  props: optionProps,
  emits: ['select', 'hover'],
  setup(props, { emit }) {
    const ns = useNamespace('select');
    const { hoverItem, selectOptionClick } = useOption(props, { emit: emit as any });
    return {
      ns,
      hoverItem,
      selectOptionClick,
    };
  },
});
</script>
