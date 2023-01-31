<template>
  <span :class="[ns.b(), ns.is('checked', checked)]" @click="handleChange">
    <slot />
  </span>
</template>

<script lang="ts" setup>
import { CHANGE_EVENT } from '@lemon-peel/constants';
import { useNamespace } from '@lemon-peel/hooks';
import { checkTagEmits, checkTagProps } from './checkTag';

defineOptions({
  name: 'LpCheckTag',
});
const props = defineProps(checkTagProps);
const emit = defineEmits(checkTagEmits);

const ns = useNamespace('check-tag');

const handleChange = () => {
  const checked = !props.checked;
  emit(CHANGE_EVENT, checked);
  emit('update:checked', checked);
};
</script>
