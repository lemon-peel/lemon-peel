<template>
  <li
    v-if="divided"
    role="separator"
    :class="ns.bem('menu', 'item', 'divided')"
    v-bind="$attrs"
  />
  <li
    :ref="itemRef"
    v-bind="{ ...dataset, ...$attrs }"
    :aria-disabled="disabled"
    :class="[ns.be('menu', 'item'), ns.is('disabled', disabled)]"
    :tabindex="tabIndex"
    :role="role"
    @click="(e) => $emit('clickimpl', e)"
    @focus="handleFocus"
    @keydown="handleKeydown"
    @mousedown="handleMousedown"
    @pointermove="(e) => $emit('pointermove', e)"
    @pointerleave="(e) => $emit('pointerleave', e)"
  >
    <lp-icon v-if="icon"><component :is="icon" /></lp-icon>
    <slot />
  </li>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue';
import { ROVING_FOCUS_GROUP_ITEM_INJECTION_KEY, ROVING_FOCUS_ITEM_COLLECTION_INJECTION_KEY } from '@lemon-peel/components/rovingFocusGroup';
import { COLLECTION_ITEM_SIGN } from '@lemon-peel/components/collection';
import { LpIcon } from '@lemon-peel/components/icon';
import { useNamespace } from '@lemon-peel/hooks';
import { composeEventHandlers, composeRefs } from '@lemon-peel/utils';
import { EVENT_CODE } from '@lemon-peel/constants';
import { DROPDOWN_COLLECTION_ITEM_INJECTION_KEY, dropdownItemProps } from './dropdown';
import { DROPDOWN_INJECTION_KEY } from './tokens';

export default defineComponent({
  name: 'DropdownItemImpl',
  components: {
    LpIcon,
  },
  props: dropdownItemProps,
  emits: ['pointermove', 'pointerleave', 'click', 'clickimpl'],
  setup(_, { emit }) {
    const ns = useNamespace('dropdown');

    const { role: menuRole } = inject(DROPDOWN_INJECTION_KEY)!;

    const { collectionItemRef: dropdownCollectionItemRef } = inject(
      DROPDOWN_COLLECTION_ITEM_INJECTION_KEY,
    )!;

    const { collectionItemRef: rovingFocusCollectionItemRef } = inject(
      ROVING_FOCUS_ITEM_COLLECTION_INJECTION_KEY,
    )!;

    const {
      rovingFocusGroupItemRef,
      tabIndex,
      handleFocus,
      handleKeydown: handleItemKeydown,
      handleMousedown,
    } = inject(ROVING_FOCUS_GROUP_ITEM_INJECTION_KEY)!;

    const itemRef = composeRefs(
      dropdownCollectionItemRef,
      rovingFocusCollectionItemRef,
      rovingFocusGroupItemRef,
    );

    const role = computed<string>(() => {
      if (menuRole.value === 'menu') {
        return 'menuitem';
      } else if (menuRole.value === 'navigation') {
        return 'link';
      }
      return 'button';
    });

    const handleKeydown = composeEventHandlers((e: KeyboardEvent) => {
      const { code } = e;
      if (code === EVENT_CODE.enter || code === EVENT_CODE.space) {
        e.preventDefault();
        e.stopImmediatePropagation();
        emit('clickimpl', e);
        return true;
      }
    }, handleItemKeydown);

    return {
      ns,
      itemRef,
      dataset: {
        [COLLECTION_ITEM_SIGN]: '',
      },
      role,
      tabIndex,
      handleFocus,
      handleKeydown,
      handleMousedown,
    };
  },
});
</script>
