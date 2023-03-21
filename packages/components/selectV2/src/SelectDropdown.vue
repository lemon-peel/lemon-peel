<template>
  <div v-if="data.length" :class="[ns.b('dropdown'), ns.is('multiple', select.props.multiple)]">
    <component :is="ListCom"
               ref="{listRef}"
               v-bind="{...listProps}"
               v-slot="params"
               :class="ns.be('dropdown', 'list')"
               :scrollbar-always-on="select.props.scrollbarAlwaysOn"
               :data="data"
               :height="select.props.height"
               :width="width"
               :total="data.length"
               on-keydown="{onKeydown}"
    >
      <Item v-bind="params" />
    </component>
  </div>
  <div v-else
       class="ns.b('dropdown')"
       style="{ width: `${width}px` }"
  >
    <slot name="empty" />
  </div>
</template>

<script lang="tsx" setup>
import type { FunctionalComponent } from 'vue';
import { computed, inject, ref, unref, useSlots, watch } from 'vue';
import { get } from 'lodash-es';
import { isObject, isUndefined } from '@lemon-peel/utils';
import { DynamicSizeList, FixedSizeList } from '@lemon-peel/components/virtualList';
import { useNamespace } from '@lemon-peel/hooks';
import { EVENT_CODE } from '@lemon-peel/constants';
import GroupItem from './GroupItem.vue';
import OptionItem from './OptionItem.vue';

import { selectV2InjectionKey } from './token';

import type { ItemProps } from '@lemon-peel/components/virtualList';
import type { Option, OptionItemProps } from './select.types';

defineOptions({
  name: 'LpSelectDropdown',
});

const props = defineProps({
  data: { type: Array, required: true },
  hoveringIndex: { type: Number, default: 0 },
  width: { type: Number, default: 0 },
});

const slots = useSlots();

const select = inject(selectV2InjectionKey)!;
const ns = useNamespace('select');
const cachedHeights = ref<Array<number>>([]);

const listRef = ref();

const size = computed(() => props.data.length);

watch(
  () => size.value,
  () => {
    select.popper.value.updatePopper?.();
  },
);

const isSized = computed(() =>
  isUndefined(select.props.estimatedOptionHeight),
);

const listProps = computed(() => {
  if (isSized.value) {
    return {
      itemSize: select.props.itemHeight,
    };
  }

  return {
    estimatedSize: select.props.estimatedOptionHeight,
    itemSize: (idx: number) => cachedHeights.value[idx],
  };
});

const contains = (arr: Array<any>, target: any) => {
  const {
    props: { valueKey },
  } = select;

  if (!isObject(target)) {
    return arr.includes(target);
  }

  return (
    arr &&
        arr.some(item => {
          return get(item, valueKey) === get(target, valueKey);
        })
  );
};

const isEqual = (selected: unknown, target: unknown) => {
  if (isObject(target)) {
    const { valueKey } = select.props;
    return get(selected, valueKey) === get(target, valueKey);
  } else {
    return selected === target;
  }
};

const isItemSelected = (value: any[] | any, target: Option) => {
  const { valueKey } = select.props;
  if (select.props.multiple) {
    return contains(value, get(target, valueKey));
  }
  return isEqual(value, get(target, valueKey));
};

const isItemDisabled = (value: any[] | any, selected: boolean) => {
  const { disabled, multiple, multipleLimit } = select.props;
  return (
    disabled ||
        (!selected &&
          (multiple
            ? multipleLimit > 0 && value.length >= multipleLimit
            : false))
  );
};

const isItemHovering = (target: number) => props.hoveringIndex === target;

const scrollToItem = (index: number) => {
  const list = listRef.value as any;
  if (list) {
    list.scrollToItem(index);
  }
};

const resetScrollTop = () => {
  const list = listRef.value as any;
  if (list) {
    list.resetScrollTop();
  }
};

const Item: FunctionalComponent<ItemProps<any>> = props => {
  const { index, data, style } = props;
  const sized = unref(isSized);
  const { itemSize, estimatedSize } = unref(listProps);
  const { value } = select.props;
  const { onSelect, onHover } = select;
  const item = data[index];
  if (item.type === 'Group') {
    return (
          <GroupItem
            item={item}
            style={style}
            height={(sized ? itemSize : estimatedSize) as number}
          />
    );
  }

  const isSelected = isItemSelected(value, item);
  const isDisabled = isItemDisabled(value, isSelected);
  const isHovering = isItemHovering(index);
  return (<OptionItem
    {...props}
    selected={isSelected}
    disabled={item.disabled || isDisabled}
    created={!!item.created}
    hovering={isHovering}
    item={item}
    onSelect={onSelect}
    onHover={onHover}
  >
    {{
      default: (props: OptionItemProps) =>
        slots.default?.(props) || <span>{item.label}</span>,
    }}
  </OptionItem>);
};

// computed
const { onKeyboardNavigate, onKeyboardSelect } = select;

const onForward = () => {
  onKeyboardNavigate('forward');
};

const onBackward = () => {
  onKeyboardNavigate('backward');
};

const onEscOrTab = () => {
  select.expanded = false;
};

const onKeydown = (e: KeyboardEvent) => {
  const { code } = e;
  const { tab, esc, down, up, enter } = EVENT_CODE;
  if (code !== tab) {
    e.preventDefault();
    e.stopPropagation();
  }

  switch (code) {
    case tab:
    case esc: {
      onEscOrTab();
      break;
    }
    case down: {
      onForward();
      break;
    }
    case up: {
      onBackward();
      break;
    }
    case enter: {
      onKeyboardSelect();
      break;
    }
  }
};

const ListCom = unref(isSized) ? FixedSizeList : DynamicSizeList;

defineExpose({
  listRef,
  isSized,

  isItemDisabled,
  isItemHovering,
  isItemSelected,
  scrollToItem,
  resetScrollTop,
});
</script>