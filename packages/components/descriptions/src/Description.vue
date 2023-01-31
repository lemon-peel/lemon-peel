<template>
  <div :class="descriptionKls">
    <div
      v-if="title || extra || $slots.title || $slots.extra"
      :class="ns.e('header')"
    >
      <div :class="ns.e('title')">
        <slot name="title">{{ title }}</slot>
      </div>
      <div :class="ns.e('extra')">
        <slot name="extra">{{ extra }}</slot>
      </div>
    </div>

    <div :class="ns.e('body')">
      <table :class="[ns.e('table'), ns.is('bordered', border)]">
        <tbody>
          <template v-for="(row, index) in getRows()" :key="index">
            <lp-descriptions-row :row="row" />
          </template>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, provide, useSlots } from 'vue';
import { flattedChildren } from '@lemon-peel/utils';
import { useNamespace, useSize } from '@lemon-peel/hooks';

import { descriptionsKey } from './token';
import { descriptionProps } from './description';
import LpDescriptionsRow from './DescriptionsRow.vue';

defineOptions({
  name: 'LpDescriptions',
});

const props = defineProps(descriptionProps);

const ns = useNamespace('descriptions');

const descriptionsSize = useSize();

const slots = useSlots();

provide(descriptionsKey, props);

const descriptionKls = computed(() => [ns.b(), ns.m(descriptionsSize.value)]);

const filledNode = (node, span, count, isLast = false) => {
  if (!node.props) {
    node.props = {};
  }
  if (span > count) {
    node.props.span = count;
  }
  if (isLast) {
    // set the last span
    node.props.span = span;
  }
  return node;
};

const getRows = () => {
  const children = flattedChildren(slots.default?.()).filter(
    node => node?.type?.name === 'LpDescriptionsItem',
  );
  const rows = [];
  let temporary = [];
  let count = props.column;
  let totalSpan = 0; // all spans number of item

  for (const [index, node] of children.entries()) {
    const span = node.props?.span || 1;

    if (index < children.length - 1) {
      totalSpan += span > count ? count : span;
    }

    if (index === children.length - 1) {
      // calculate the last item span
      const lastSpan = props.column - (totalSpan % props.column);
      temporary.push(filledNode(node, lastSpan, count, true));
      rows.push(temporary);
      continue;
    }

    if (span < count) {
      count -= span;
      temporary.push(node);
    } else {
      temporary.push(filledNode(node, span, count));
      rows.push(temporary);
      count = props.column;
      temporary = [];
    }
  }

  return rows;
};
</script>
