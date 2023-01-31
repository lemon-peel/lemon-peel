<template>
  <a
    :class="[
      ns.b(),
      ns.m(type),
      ns.is('disabled', disabled),
      ns.is('underline', underline && !disabled),
    ]"
    :href="disabled || !href ? undefined : href"
    @click="handleClick"
  >
    <lp-icon v-if="icon"><component :is="icon" /></lp-icon>
    <span v-if="$slots.default" :class="ns.e('inner')">
      <slot />
    </span>
    <slot v-if="$slots.icon" name="icon" />
  </a>
</template>

<script lang="ts" setup>
import { LpIcon } from '@lemon-peel/components/icon';
import { useNamespace } from '@lemon-peel/hooks';
import { linkEmits, linkProps } from './link';

defineOptions({
  name: 'LpLink',
});
const props = defineProps(linkProps);
const emit = defineEmits(linkEmits);

const ns = useNamespace('link');

function handleClick(event: MouseEvent) {
  if (!props.disabled) emit('click', event);
}
</script>
