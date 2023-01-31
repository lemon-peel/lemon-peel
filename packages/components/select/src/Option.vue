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
import { optionProps } from './option';

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

const vm = getCurrentInstance()!.proxy;

select.onOptionCreate(vm as unknown as SelectOptionProxy);

onBeforeUnmount(() => {
  const key = (vm as unknown as SelectOptionProxy).value;
  const { selected } = select;
  const selectedOptions = select.props.multiple ? selected : [selected];
  const doesSelected = selectedOptions.some((item: SelectOptionProxy) => {
    return item.value === (vm as unknown as SelectOptionProxy).value;
  });
  // if option is not selected, remove it from cache
  nextTick(() => {
    if (select.cachedOptions.get(key) === vm && !doesSelected) {
      select.cachedOptions.delete(key);
    }
  });
  select.onOptionDestroy(key, vm as any);
});

function selectOptionClick() {
  if (props.disabled !== true && states.groupDisabled !== true) {
    select.handleOptionSelect(vm, true);
  }
}

defineExpose({
  currentLabel,
  value: props.value,
  isDisabled,
  created: true,
});
</script>