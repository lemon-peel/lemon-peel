<template>
  <label
    :class="[
      ns.b(),
      ns.is('disabled', disabled),
      ns.is('focus', focus),
      ns.is('bordered', border),
      ns.is('checked', isChecked),
      ns.m(size),
    ]"
  >
    <span
      :class="[
        ns.e('input'),
        ns.is('disabled', disabled),
        ns.is('checked', isChecked),
      ]"
    >
      <input
        ref="radioRef"
        type="radio"
        :class="ns.e('original')"
        :name="name || radioGroup?.name"
        :value="value"
        :disabled="disabled"
        :checked="isChecked"
        @focus="focus = true"
        @blur="focus = false"
        @change="onChange"
      >
      <span :class="ns.e('inner')" />
    </span>
    <span :class="ns.e('label')" @keydown.stop>
      <slot>
        {{ label }}
      </slot>
    </span>
  </label>
</template>

<script lang="ts" setup>
import { nextTick } from 'vue';
import { useNamespace } from '@lemon-peel/hooks';

import { radioEmits, radioProps } from './radio';
import { useRadio, wrappedGuard } from './useRadio';

defineOptions({
  name: 'LpRadio',
});

const props = defineProps(radioProps);
const emit = defineEmits(radioEmits);
const ns = useNamespace('radio');

const { radioRef, radioGroup, isChecked, focus, size, disabled, onChange } = useRadio(props, emit as any);
</script>
