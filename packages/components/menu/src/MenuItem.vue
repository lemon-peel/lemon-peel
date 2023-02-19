<template>
  <li
    :class="[
      nsMenuItem.b(),
      nsMenuItem.is('active', active),
      nsMenuItem.is('disabled', disabled),
    ]"
    role="menuitem"
    tabindex="-1"
    @click="handleClick"
  >
    <lp-tooltip
      v-if="
        parentMenu.type.name === 'LpMenu' &&
          rootMenu.props.collapse &&
          $slots.title
      "
      :effect="Effect.DARK"
      placement="right"
      :fallback-placements="['left']"
      persistent
    >
      <template #content>
        <slot name="title" />
      </template>
      <div :class="nsMenu.be('tooltip', 'trigger')">
        <slot />
      </div>
    </lp-tooltip>
    <template v-else>
      <slot />
      <slot name="title" />
    </template>
  </li>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, inject, onBeforeUnmount, onMounted, reactive, toRef } from 'vue';
import { Effect } from '@lemon-peel/components/popper';
import { throwError } from '@lemon-peel/utils';
import { useNamespace } from '@lemon-peel/hooks';
import LpTooltip from '@lemon-peel/components/tooltip';

import { menuItemEmits, menuItemProps } from './menuItem';
import useMenu from './useMenu';

import type { Ref } from 'vue';
import type { MenuItemRegistered, MenuProvider, SubMenuProvider } from './types';

const COMPONENT_NAME = 'LpMenuItem';
export default defineComponent({
  name: COMPONENT_NAME,
  components: {
    LpTooltip,
  },

  props: menuItemProps,
  emits: menuItemEmits,

  setup(props, { emit }) {
    const instance = getCurrentInstance()!;
    const rootMenu = inject<MenuProvider>('rootMenu');
    const nsMenu = useNamespace('menu');
    const nsMenuItem = useNamespace('menu-item');
    if (!rootMenu) throwError(COMPONENT_NAME, 'can not inject root menu');

    const { parentMenu, indexPath } = useMenu(instance, toRef(props, 'index') as Ref<string>);

    const subMenu = inject<SubMenuProvider>(`subMenu:${parentMenu.value.uid}`);
    if (!subMenu) throwError(COMPONENT_NAME, 'can not inject sub menu');

    const active = computed(() => props.index === rootMenu.activeIndex);
    const item: MenuItemRegistered = reactive({
      index: props.index,
      indexPath,
      active,
    });

    const handleClick = () => {
      if (!props.disabled) {
        rootMenu.handleMenuItemClick({
          index: props.index,
          indexPath: indexPath.value,
          route: props.route,
        });
        emit('click', item);
      }
    };

    onMounted(() => {
      subMenu.addSubMenu(item);
      rootMenu.addMenuItem(item);
    });

    onBeforeUnmount(() => {
      subMenu.removeSubMenu(item);
      rootMenu.removeMenuItem(item);
    });

    return {
      Effect,
      parentMenu,
      rootMenu,
      active,
      nsMenu,
      nsMenuItem,
      handleClick,
    };
  },
});
</script>
