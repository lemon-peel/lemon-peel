<template>
  <li
    v-show="visible"
    :class="[
      ns.be('dropdown', 'item'),
      ns.is('disabled', isDisabled),
      {
        selected: itemSelected,
        hover,
      },
    ]"
    @mouseenter="hoverItem"
    @click.stop="selectOptionClick"
  >
    <slot>
      <span>{{ currentLabel }}</span>
    </slot>
  </li>
</template>

<script lang="ts" setup>
import { getCurrentInstance, nextTick, onBeforeUnmount, reactive, toRefs } from 'vue';
import { useNamespace } from '@lemon-peel/hooks';

import { useOption } from './useOption';
import type { SelectOptionProxy } from './token';
import { optionProps, OptionProps } from './option';

defineOptions({
  name: 'LpOption',
});

const props = defineProps(optionProps);

const ns = useNamespace('select');
const states = reactive({
  index: -1,
  groupDisabled: false,
  visible: true,
  hitState: false,
  hover: false,
});

const { currentLabel, itemSelected, isDisabled, select, hoverItem } = useOption(props, states);
const { visible, hover } = toRefs(states);
const vm = getCurrentInstance()!;

const sop: SelectOptionProxy = reactive({
  ...toRefs(props),
  ...toRefs(states),
  $el: vm.vnode.el as HTMLElement,
  currentLabel,
  itemSelected,
  isDisabled,
  select,
  hoverItem,
  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  selectOptionClick,
});

function selectOptionClick() {
  if (props.disabled !== true && states.groupDisabled !== true) {
    select.handleOptionSelect(sop, true);
  }
}

select.onOptionCreate(sop);

onBeforeUnmount(() => {
  const key = sop.value;
  const { selected } = select;
  const selectedOptions = select.props.multiple ? selected : [selected];
  const doesSelected = selectedOptions.some((item: SelectOptionProxy) => {
    return item.value === sop.value;
  });

  select.onOptionDestroy(key, sop);
});

defineExpose({
  visible,
});
</script>
