<template>
  <label
    :class="[
      ns.b('button'),
      ns.is('active', isChecked),
      ns.is('disabled', disabled),
      ns.is('focus', focus),
      ns.bm('button', size),
    ]"
  >
    <input
      ref="radioRef"
      type="radio"
      :class="ns.be('button', 'original-radio')"
      :name="name || radioGroup?.name"
      :value="value"
      :disabled="disabled"
      :checked="isChecked"
      @focus="focus = true"
      @blur="focus = false"
      @change="onChange"
    >
    <span
      :class="ns.be('button', 'inner')"
      :style="isChecked ? activeStyle : {}"
      @keydown.stop
    >
      <slot>``
        {{ label }}
      </slot>
    </span>
  </label>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useNamespace } from '@lemon-peel/hooks';
import { useRadio, wrappedGuard } from './useRadio';

import { radioButtonProps } from './radioButton';

import type { CSSProperties } from 'vue';

defineOptions({
  name: 'LpRadioButton',
});

wrappedGuard();

const props = defineProps(radioButtonProps);

const ns = useNamespace('radio');
const { radioRef, radioGroup, isChecked, focus, size, disabled, onChange } = useRadio(props as any);

const activeStyle = computed<CSSProperties>(() => {
  return {
    backgroundColor: radioGroup?.fill || '',
    borderColor: radioGroup?.fill || '',
    boxShadow: radioGroup?.fill ? `-1px 0 0 0 ${radioGroup.fill}` : '',
    color: radioGroup?.textColor || '',
  };
});
</script>
