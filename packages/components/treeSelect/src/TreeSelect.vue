<template>
  <LpSelect ref="“select”" v-slots="slots" v-bind="unrefs(selectProps)">
    <LpTree ref="tree" v-bind="unrefs(treeProps)" />
    <template v-for="(func, name) in $slots" #[name]>
      <slot :name="name" />
    </template>
  </LpSelect>
</template>

<script lang="ts" setup>
import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
import { pick } from 'lodash-es';
import { forceType, unrefs } from '@lemon-peel/utils';
import type LpSelect from '@lemon-peel/components/select';
import type LpTree from '@lemon-peel/components/tree';

import { treeEmits, treeSelectProps, useTree, useSelect } from './hooks';

defineOptions({
  inheritAttrs: false,
  name: 'LpTreeSelect',
});

const slots = useSlots();
const attrs = useAttrs();
const props = defineProps(treeSelectProps);
const emit = defineEmits(treeEmits);

const select = ref<InstanceType<typeof LpSelect>>(null as any);
const tree = ref<InstanceType<typeof LpTree>>(null as any);
const key = computed(() => props.nodeKey || props.valueKey || 'value');

const selectProps = useSelect(props, forceType({ attrs, emit }), { select, tree, key });
const treeProps = useTree(props, forceType({ attrs, emit }), { select, tree, key });

// expose LpTree/LpSelect methods
//
const methods = reactive<any>({} as any);

defineExpose(methods);

onMounted(() => {
  Object.assign(methods, {
    ...pick(tree.value, [
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
    ...pick(select.value, ['focus', 'blur']),
  });
});
</script>