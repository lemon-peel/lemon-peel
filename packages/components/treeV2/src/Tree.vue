<template>
  <div
    :class="[ns.b(), { [ns.m('highlight-current')]: highlightCurrent }]"
    role="tree"
  >
    <fixed-size-list
      v-if="isNotEmpty"
      :class-name="ns.b('virtual-list')"
      :data="flattenTree"
      :total="flattenTree.length"
      :height="height"
      :item-size="itemSize"
      :perf-mode="perfMode"
    >
      <template #default="{ data, index, style }">
        <lp-tree-node
          :key="data[index].key"
          :style="style"
          :node="data[index]"
          :expanded="isExpanded(data[index])"
          :show-checkbox="showCheckbox"
          :checked="isChecked(data[index])"
          :indeterminate="isIndeterminate(data[index])"
          :disabled="isDisabled(data[index])"
          :current="isCurrent(data[index])"
          :hidden-expand-icon="isForceHiddenExpandIcon(data[index])"
          @click="handleNodeClick"
          @toggle="toggleExpand"
          @check="handleNodeCheck"
        />
      </template>
    </fixed-size-list>
    <div v-else :class="ns.e('empty-block')">
      <span :class="ns.e('empty-text')">{{
        emptyText ?? t('lp.tree.emptyText')
      }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getCurrentInstance, provide, useSlots } from 'vue';
import { useLocale, useNamespace } from '@lemon-peel/hooks';
import { formItemContextKey } from '@lemon-peel/tokens';
import { FixedSizeList } from '@lemon-peel/components/virtualList';
import { useTree } from './composables/useTree';
import ElementTreeNode from './TreeNode.vue';
import { ROOT_TREE_INJECTION_KEY, treeEmits, treeProps } from './virtualTree';

defineOptions({
  name: 'LpTreeV2',
});

const props = defineProps(treeProps);
const emit = defineEmits(treeEmits);

const slots = useSlots();

const itemSize = 26;

provide(ROOT_TREE_INJECTION_KEY, {
  ctx: {
    emit,
    slots,
  },
  props,
  instance: getCurrentInstance()!,
});

// 阻止 injection 暴露到内部使用的组件
provide(formItemContextKey, null as any);

const { t } = useLocale();
const ns = useNamespace('tree');
const {
  flattenTree,
  isNotEmpty,
  toggleExpand,
  isExpanded,
  isIndeterminate,
  isChecked,
  isDisabled,
  isCurrent,
  isForceHiddenExpandIcon,
  handleNodeClick,
  handleNodeCheck,
  // expose
  toggleCheckbox,
  getCurrentNode,
  getCurrentKey,
  setCurrentKey,
  getCheckedKeys,
  getCheckedNodes,
  getHalfCheckedKeys,
  getHalfCheckedNodes,
  setChecked,
  setCheckedKeys,
  filter,
  setData,
  getNode,
  expandNode,
  collapseNode,
  setExpandedKeys,
} = useTree(props, emit);

defineExpose({
  toggleCheckbox,
  getCurrentNode,
  getCurrentKey,
  setCurrentKey,
  getCheckedKeys,
  getCheckedNodes,
  getHalfCheckedKeys,
  getHalfCheckedNodes,
  setChecked,
  setCheckedKeys,
  filter,
  setData,
  getNode,
  expandNode,
  collapseNode,
  setExpandedKeys,
});
</script>
