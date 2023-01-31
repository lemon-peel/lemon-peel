<template>
  <div :class="rootKls">
    <div
      role="tab"
      :aria-expanded="isActive"
      :aria-controls="scopedContentId"
      :aria-describedby="scopedContentId"
    >
      <div
        :id="scopedHeadId"
        :class="headKls"
        role="button"
        :tabindex="disabled ? -1 : 0"
        @click="handleHeaderClick"
        @keypress.space.enter.stop.prevent="handleEnterClick"
        @focus="handleFocus"
        @blur="focusing = false"
      >
        <slot name="title">{{ title }}</slot>
        <lp-icon :class="arrowKls">
          <arrow-right />
        </lp-icon>
      </div>
    </div>
    <lp-collapse-transition>
      <div
        v-show="isActive"
        :id="scopedContentId"
        :class="itemWrapperKls"
        role="tabpanel"
        :aria-hidden="!isActive"
        :aria-labelledby="scopedHeadId"
      >
        <div :class="itemContentKls">
          <slot />
        </div>
      </div>
    </lp-collapse-transition>
  </div>
</template>

<script lang="ts" setup>
import LpCollapseTransition from '@lemon-peel/components/collapseTransition';
import LpIcon from '@lemon-peel/components/icon';
import { ArrowRight } from '@element-plus/icons-vue';
import { collapseItemProps } from './collapseItem';
import { useCollapseItem, useCollapseItemDOM } from './useCollapseItem';

defineOptions({
  name: 'LpCollapseItem',
});

const props = defineProps(collapseItemProps);
const {
  focusing,
  id,
  isActive,
  handleFocus,
  handleHeaderClick,
  handleEnterClick,
} = useCollapseItem(props);

const {
  arrowKls,
  headKls,
  rootKls,
  itemWrapperKls,
  itemContentKls,
  scopedContentId,
  scopedHeadId,
} = useCollapseItemDOM(props, { focusing, isActive, id });

defineExpose({
  /** @description current collapse-item whether active */
  isActive,
});
</script>
