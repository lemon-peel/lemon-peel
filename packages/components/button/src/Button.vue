<template>
  <button
    ref="_ref"
    :class="[
      ns.b(),
      ns.m(_type),
      ns.m(_size),
      ns.is('disabled', _disabled),
      ns.is('loading', loading),
      ns.is('plain', plain),
      ns.is('round', round),
      ns.is('circle', circle),
      ns.is('text', text),
      ns.is('link', link),
      ns.is('has-bg', bg),
    ]"
    :aria-disabled="_disabled || loading"
    :disabled="_disabled || loading"
    :autofocus="autofocus"
    :type="nativeType"
    :style="buttonStyle"
    @click="handleClick"
  >
    <template v-if="loading">
      <slot v-if="$slots.loading" name="loading" />
      <lp-icon v-else :class="ns.is('loading')">
        <component :is="loadingIcon" />
      </lp-icon>
    </template>
    <lp-icon v-else-if="icon || $slots.icon">
      <component :is="icon" v-if="icon" />
      <slot v-else name="icon" />
    </lp-icon>
    <span
      v-if="$slots.default"
      :class="{ [ns.em('text', 'expand')]: shouldAddSpace }"
    >
      <slot />
    </span>
  </button>
</template>

<script lang="ts" setup>
import { LpIcon } from '@lemon-peel/components/icon';
import { useNamespace } from '@lemon-peel/hooks';
import { useButton } from './useButton';
import { buttonEmits, buttonProps } from './button';
import { useButtonCustomStyle } from './buttonCustom';

defineOptions({
  name: 'LpButton',
});

const props = defineProps(buttonProps);
const emit = defineEmits(buttonEmits);

const buttonStyle = useButtonCustomStyle(props);
const ns = useNamespace('button');
// eslint-disable-next-line @typescript-eslint/naming-convention
const { _ref, _size, _type, _disabled, shouldAddSpace, handleClick } =
  useButton(props, emit);

defineExpose({
  ref: _ref,
  size: _size,
  type: _type,
  disabled: _disabled,
  shouldAddSpace,
});
</script>
