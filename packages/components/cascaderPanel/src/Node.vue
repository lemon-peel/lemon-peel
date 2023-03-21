<template>
  <li
    :id="`${menuId}-${node.uid}`"
    role="menuitem"
    :aria-haspopup="!isLeaf"
    :aria-owns="isLeaf ? undefined : menuId"
    :aria-expanded="inExpandingPath"
    :tabindex="expandable ? -1 : undefined"
    :class="[
      ns.b(),
      ns.is('selectable', checkStrictly),
      ns.is('active', node.checked),
      ns.is('disabled', !expandable),
      inExpandingPath && 'in-active-path',
      inCheckedPath && 'in-checked-path',
    ]"
    @mouseenter="onHoverExpand"
    @focus="onHoverExpand"
    @click="onClick"
  >
    <!-- prefix -->
    <lp-checkbox
      v-if="multiple"
      :value="node.uid"
      :checked="node.checked"
      :indeterminate="node.indeterminate"
      :disabled="isDisabled"
      @click.stop
      @update:checked="(onSelectCheck as any)"
    />

    <lp-radio
      v-else-if="checkStrictly"
      :checked="checkedNodeId === node.uid"
      :value="node.uid"
      :label="node.uid"
      :disabled="isDisabled"
      @update:checked="(onSelectCheck as any)"
      @click.stop
    >
      <!--
        Add an empty element to avoid render label,
        do not use empty fragment here for https://github.com/vuejs/vue-next/pull/2485
      -->
      <span />
    </lp-radio>
    <lp-icon v-else-if="isLeaf && node.checked" :class="ns.e('prefix')">
      <check />
    </lp-icon>

    <!-- content -->
    <node-content />

    <!-- postfix -->
    <template v-if="!isLeaf">
      <lp-icon v-if="node.loading" :class="[ns.is('loading'), ns.e('postfix')]">
        <loading />
      </lp-icon>
      <lp-icon v-else :class="['arrow-right', ns.e('postfix')]">
        <arrow-right />
      </lp-icon>
    </template>
  </li>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from 'vue';
import LpCheckbox from '@lemon-peel/components/checkbox';
import LpRadio from '@lemon-peel/components/radio';
import LpIcon from '@lemon-peel/components/icon';
import { useNamespace } from '@lemon-peel/hooks';
import { ArrowRight, Check, Loading } from '@element-plus/icons-vue';

import type { PropType } from 'vue';
import type { default as CascaderNode } from './node';

import { CASCADER_PANEL_INJECTION_KEY } from './types';
import NodeContent from './NodeContent';

export default defineComponent({
  name: 'LpCascaderNode',
  components: {
    LpCheckbox,
    LpRadio,
    NodeContent,
    LpIcon,
    Check,
    Loading,
    ArrowRight,
  },
  props: {
    node: { type: Object as PropType<CascaderNode>, required: true },
    menuId: { type: String, required: true },
  },
  emits: ['expand'],
  setup(props, { emit }) {
    const panel = inject(CASCADER_PANEL_INJECTION_KEY)!;

    const ns = useNamespace('cascader-node');
    const isHoverMenu = computed(() => panel.isHoverMenu);
    const multiple = computed(() => panel.config.multiple);
    const checkStrictly = computed(() => panel.config.checkStrictly);
    const checkedNodeId = computed(() => panel.checkedNodes[0]?.uid);
    const isDisabled = computed(() => props.node.isDisabled);
    const isLeaf = computed(() => props.node.isLeaf);
    const expandable = computed(
      () => (checkStrictly.value && !isLeaf.value) || !isDisabled.value,
    );

    const isInPath = (node: CascaderNode) => {
      const { level, uid } = props.node;
      return node?.pathNodes[level - 1]?.uid === uid;
    };

    const inExpandingPath = computed(() => isInPath(panel.expandingNode!));
    // only useful in check-strictly mode
    const inCheckedPath = computed(
      () => checkStrictly.value && panel.checkedNodes.some(isInPath),
    );

    const doExpand = () => {
      if (inExpandingPath.value) return;
      panel.expandNode(props.node);
    };

    const doCheck = (checked: boolean) => {
      const { node } = props;
      if (checked === node.checked) return;
      panel.handleCheckChange(node, checked);
    };

    const doLoad = () => {
      panel.lazyLoad(props.node, () => {
        if (!isLeaf.value) doExpand();
      });
    };

    const onExpand = () => {
      const { node } = props;
      // do not exclude leaf node because the menus expanded might have to reset
      if (!expandable.value || node.loading) return;
      node.loaded ? doExpand() : doLoad();
    };

    const onHoverExpand = (e: Event) => {
      if (!isHoverMenu.value) return;
      onExpand();
      !isLeaf.value && emit('expand', e);
    };

    const onCheck = (checked: boolean) => {
      if (props.node.loaded) {
        doCheck(checked);
        !checkStrictly.value && doExpand();
      } else {
        doLoad();
      }
    };

    const onClick = () => {
      if (isHoverMenu.value && !isLeaf.value) return;

      if (
        isLeaf.value &&
        !isDisabled.value &&
        !checkStrictly.value &&
        !multiple.value
      ) {
        onCheck(true);
      } else {
        onExpand();
      }
    };

    const onSelectCheck = (checked: boolean) => {
      if (checkStrictly.value) {
        doCheck(checked);
        if (props.node.loaded) {
          doExpand();
        }
      } else {
        onCheck(checked);
      }
    };

    return {
      panel,
      isHoverMenu,
      multiple,
      checkStrictly,
      checkedNodeId,
      isDisabled,
      isLeaf,
      expandable,
      inExpandingPath,
      inCheckedPath,
      ns,

      onHoverExpand,
      onExpand,
      onClick,
      onCheck,
      onSelectCheck,
    };
  },
});
</script>
