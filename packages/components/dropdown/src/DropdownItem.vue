<template>
  <lp-dropdown-collection-item
    :disabled="disabled"
    :text-value="textValue ?? textContent"
  >
    <lp-roving-focus-item :focusable="!disabled">
      <lp-dropdown-item-impl
        v-bind="propsAndAttrs"
        @pointerleave="handlePointerLeave"
        @pointermove="handlePointerMove"
        @clickimpl="handleClick"
      >
        <slot />
      </lp-dropdown-item-impl>
    </lp-roving-focus-item>
  </lp-dropdown-collection-item>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, inject, ref, unref } from 'vue';
import { LpRovingFocusItem } from '@lemon-peel/components/rovingFocusGroup';
import { composeEventHandlers, whenMouse } from '@lemon-peel/utils';

import LpDropdownItemImpl from './DropdownItemImpl.vue';
import { useDropdown } from './useDropdown';
import { LpCollectionItem as LpDropdownCollectionItem, dropdownItemProps } from './dropdown';
import { DROPDOWN_INJECTION_KEY } from './tokens';

export default defineComponent({
  name: 'LpDropdownItem',
  components: {
    LpDropdownCollectionItem,
    LpRovingFocusItem,
    LpDropdownItemImpl,
  },
  inheritAttrs: false,
  props: dropdownItemProps,
  emits: ['pointermove', 'pointerleave', 'click'],
  setup(props, { emit, attrs }) {
    const { lpDropdown } = useDropdown();
    const inc = getCurrentInstance();
    const itemRef = ref<HTMLElement | null>(null);
    const textContent = computed(() => unref(itemRef)?.textContent ?? '');
    const { onItemEnter, onItemLeave } = inject(
      DROPDOWN_INJECTION_KEY,
    )!;

    const handlePointerMove = composeEventHandlers(
      (e: PointerEvent) => {
        emit('pointermove', e);
        return e.defaultPrevented;
      },
      whenMouse(e => {
        if (props.disabled) {
          onItemLeave(e);
        } else {
          onItemEnter(e);
          if (!e.defaultPrevented) {
            (e.currentTarget as HTMLElement)?.focus();
          }
        }
      }),
    );

    const handlePointerLeave = composeEventHandlers(
      (e: PointerEvent) => {
        emit('pointerleave', e);
        return e.defaultPrevented;
      },
      whenMouse(e => {
        onItemLeave(e);
      }),
    );

    const handleClick = composeEventHandlers(
      (e: PointerEvent) => {
        if (props.disabled) {
          return;
        }
        emit('click', e);
        return e.type !== 'keydown' && e.defaultPrevented;
      },
      e => {
        if (props.disabled) {
          e.stopImmediatePropagation();
          return;
        }
        if (lpDropdown?.hideOnClick?.value) {
          lpDropdown.handleClick?.();
        }
        lpDropdown.commandHandler?.(props.command, inc, e);
      },
    );

    // direct usage of v-bind={ ...$props, ...$attrs } causes type errors
    const propsAndAttrs = computed(() => {
      return { ...props, ...attrs };
    });

    return {
      handleClick,
      handlePointerMove,
      handlePointerLeave,
      textContent,
      propsAndAttrs,
    };
  },
});
</script>
