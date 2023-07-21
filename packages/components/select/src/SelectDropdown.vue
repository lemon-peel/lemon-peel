<template>
  <div
    :class="[ns.b('dropdown'), ns.is('multiple', isMultiple), popperClass]"
    :style="{ [isFitInputWidth ? 'width' : 'minWidth']: minWidth }"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, onMounted, ref, reactive } from 'vue';
import { useResizeObserver } from '@vueuse/core';
import { useNamespace } from '@lemon-peel/hooks';
import { selectKey } from './token';

defineOptions({
  name: 'LpSelectDropdown',
});

const select = inject(selectKey)!;
const ns = useNamespace('select');

// computed
const popperClass = computed(() => select.props.popperClass);
const isMultiple = computed(() => select.props.multiple);
const isFitInputWidth = computed(() => select.props.fitInputWidth);
const minWidth = ref('');

function updateMinWidth() {
  minWidth.value = `${select.selectWrapper?.offsetWidth}px`;
}

onMounted(() => {
  // TODO: updatePopper
  // popper.value.update()
  updateMinWidth();
  useResizeObserver(select.selectWrapper, updateMinWidth);
});

defineExpose(reactive({
  minWidth,
}));
</script>
