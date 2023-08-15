<template>
  <lp-select ref="selectRef" v-bind="unrefs(selectProps)">
    <lp-tree ref="treeRef" v-bind="unrefs(treeProps)" />
    <template v-for="(func, name) in noDefaultSlots" #[name]>
      <slot :name="name" />
    </template>
  </lp-select>
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance, onMounted, reactive, ref, useAttrs, useSlots } from 'vue';
import { omit, pick } from 'lodash';
import { forceType, unrefs } from '@lemon-peel/utils';
/* eslint-disable @typescript-eslint/consistent-type-imports */
import LpSelect from '@lemon-peel/components/select';
import LpTree from '@lemon-peel/components/tree';
/* eslint-enable @typescript-eslint/consistent-type-imports */

import { treeSelectEmits, treeSelectProps, useTree, useSelect } from './hooks';

const slots = useSlots();
const noDefaultSlots = omit(slots, 'default');

defineOptions({
  inheritAttrs: false,
  name: 'LpTreeSelect',
});

const instance = getCurrentInstance();

const attrs = useAttrs();
const props = defineProps(treeSelectProps);
const emit = defineEmits(treeSelectEmits);

const selectRef = ref<InstanceType<typeof LpSelect>>(null as any);
const treeRef = ref<InstanceType<typeof LpTree>>(null as any);
const key = computed(() => props.nodeKey || props.valueKey || 'value');

const selectProps = useSelect(props, forceType({ attrs, emit, slots }), { select: selectRef, tree: treeRef, key });
const treeProps = useTree(props, forceType({ attrs, emit, slots }), { select: selectRef, tree: treeRef, key });

// expose LpTree/LpSelect methods
//
const methods = reactive<
Pick<
InstanceType<typeof LpTree>,
'filter'
| 'updateKeyChildren'
| 'getCheckedNodes'
| 'setCheckedNodes'
| 'getCheckedKeys'
| 'setCheckedKeys'
| 'setChecked'
| 'getHalfCheckedNodes'
| 'getHalfCheckedKeys'
| 'getCurrentKey'
| 'getCurrentNode'
| 'setCurrentKey'
| 'setCurrentNode'
| 'getNode'
| 'remove'
| 'append'
| 'insertBefore'
| 'insertAfter'> &
Pick<InstanceType<typeof LpSelect>, 'focus' | 'blur'>
>({} as any);
defineExpose(methods);

onMounted(() => {
  const exposeMethods = {
    ...pick(treeRef.value, [
      'filter',
      'updateKeyChildren',
      'getCheckedNodes',
      'setCheckedNodes',
      'getCheckedKeys',
      'setCheckedKeys',
      'setChecked',
      'getHalfCheckedNodes',
      'getHalfCheckedKeys',
      'getCurrentKey',
      'getCurrentNode',
      'setCurrentKey',
      'setCurrentNode',
      'getNode',
      'remove',
      'append',
      'insertBefore',
      'insertAfter',
    ]),
    ...pick(selectRef.value, ['focus', 'blur']),
  };

  Object.assign(methods, exposeMethods);
  Object.assign(instance?.proxy || {}, exposeMethods);
});
</script>
