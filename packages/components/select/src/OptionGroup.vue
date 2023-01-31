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

<script lang="ts">
import { defineComponent, getCurrentInstance, inject, onMounted, provide, reactive, ref, toRaw, toRefs, watch } from 'vue';
import { useNamespace } from '@lemon-peel/hooks';
import { selectGroupKey, selectKey } from './token';
import type { OptionInstance } from './option';

export default defineComponent({
  name: 'ElOptionGroup',
  componentName: 'ElOptionGroup',
  props: {
    label: String,
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const ns = useNamespace('select');
    const visible = ref(true);
    const instance = getCurrentInstance();
    const children = ref<OptionInstance[]>([]);

    provide(
      selectGroupKey,
      reactive({
        ...toRefs(props),
      }),
    );

    const select = inject(selectKey)!;

    // get all instances of options
    const flattedChildren = node => {
      const children: OptionInstance[] = [];
      if (Array.isArray(node.children)) {
        for (const child of node.children) {
          if (
            child.type &&
            child.type.name === 'ElOption' &&
            child.component &&
            child.component.proxy
          ) {
            children.push(child.component.proxy as any);
          } else if (child.children?.length) {
            children.push(...flattedChildren(child));
          }
        }
      }
      return children;
    };

    onMounted(() => {
      children.value = flattedChildren(instance.subTree);
    });

    const { groupQueryChange } = toRaw(select);

    watch(
      groupQueryChange,
      () => {
        visible.value = children.value.some(option => option.visible === true);
      },
      { flush: 'post' },
    );

    return {
      visible,
      ns,
    };
  },
});
</script>
