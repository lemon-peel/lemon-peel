<template>
  <ul v-show="visible" :class="ns.be('group', 'wrap')">
    <li :class="ns.be('group', 'title')">{{ label }}</li>
    <li>
      <ul :class="ns.b('group')">
        <slot />
      </ul>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { getCurrentInstance, inject, onMounted, provide, reactive, ref, toRefs, watch } from 'vue';
import { useNamespace } from '@lemon-peel/hooks';
import { selectGroupKey, selectKey } from './token';

import type { OptionInstance } from './option';
import type { Component, VNode } from 'vue';

defineOptions({
  name: 'LpOptionGroup',
});

const props = defineProps({
  label: { type: String, default: undefined },
  disabled: { type: Boolean, default: false },
});

const ns = useNamespace('select');
const visible = ref(true);
const instance = getCurrentInstance()!;
const children = ref<any[]>([]);

provide(
  selectGroupKey,
  reactive({
    ...toRefs(props),
  }),
);

const select = inject(selectKey)!;

// get all instances of options
const flattedChildren = (node: VNode) => {
  const list: OptionInstance[] = [];
  if (Array.isArray(node.children)) {
    for (const child of (node.children as Array<VNode>)) {
      if (child
            && child.type
            && (child.type as Component).name === 'LpOption'
            && child.component
            && child.component.proxy
      ) {
        list.push(child.component as any);
      } else if (child.children?.length) {
        list.push(...flattedChildren(child));
      }
    }
  }

  return list;
};

onMounted(() => {
  children.value = flattedChildren(instance.subTree);
});

watch(
  () => select.groupQueryChange,
  () => {
    visible.value = children.value.some(option => option.isVisible());
  },
  { flush: 'post' },
);

defineExpose({
  visible,
});
</script>
