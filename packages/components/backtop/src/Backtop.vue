<template>
  <transition :name="`${ns.namespace.value}-fade-in`">
    <div v-if="visible" :style="backTopStyle" :class="ns.b()" @click.stop="handleClick">
      <slot>
        <lp-icon :class="ns.e('icon')"><caret-top /></lp-icon>
      </slot>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { LpIcon } from '@lemon-peel/components/icon';
import { CaretTop } from '@element-plus/icons-vue';
import { useNamespace } from '@lemon-peel/hooks';
import { backtopEmits, backtopProps } from './backtop';
import { useBackTop } from './useBacktop';

const COMPONENT_NAME = 'LpBacktop';

defineOptions({
  name: COMPONENT_NAME,
});

const props = defineProps(backtopProps);
const emit = defineEmits(backtopEmits);

const ns = useNamespace('backtop');

const { handleClick, visible } = useBackTop(props, emit, COMPONENT_NAME);

const backTopStyle = computed(() => ({
  right: `${props.right}px`,
  bottom: `${props.bottom}px`,
}));
</script>
