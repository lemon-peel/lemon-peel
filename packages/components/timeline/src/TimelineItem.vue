<template>
  <li :class="[ns.b(), { [ns.e('center')]: center }]">
    <div :class="ns.e('tail')" />
    <div
      v-if="!$slots.dot"
      :class="[
        ns.e('node'),
        ns.em('node', size || ''),
        ns.em('node', type || ''),
        ns.is('hollow', hollow),
      ]"
      :style="{
        backgroundColor: color,
      }"
    >
      <lp-icon v-if="icon" :class="ns.e('icon')">
        <component :is="icon" />
      </lp-icon>
    </div>
    <div v-if="$slots.dot" :class="ns.e('dot')">
      <slot name="dot" />
    </div>

    <div :class="ns.e('wrapper')">
      <div
        v-if="!hideTimestamp && placement === 'top'"
        :class="[ns.e('timestamp'), ns.is('top')]"
      >
        {{ timestamp }}
      </div>

      <div :class="ns.e('content')">
        <slot />
      </div>

      <div
        v-if="!hideTimestamp && placement === 'bottom'"
        :class="[ns.e('timestamp'), ns.is('bottom')]"
      >
        {{ timestamp }}
      </div>
    </div>
  </li>
</template>

<script lang="ts" setup>
import { LpIcon } from '@lemon-peel/components/icon';
import { useNamespace } from '@lemon-peel/hooks';
import { timelineItemProps } from './timelineItem';

defineOptions({
  name: 'LpTimelineItem',
});

defineProps(timelineItemProps);

const ns = useNamespace('timeline-item');
</script>
