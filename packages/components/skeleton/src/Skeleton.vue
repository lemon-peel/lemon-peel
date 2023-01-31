<template>
  <template v-if="uiLoading">
    <div :class="[ns.b(), ns.is('animated', animated)]" v-bind="$attrs">
      <template v-for="i in count" :key="i">
        <slot v-if="loading" :key="i" name="template">
          <lp-skeleton-item :class="ns.is('first')" variant="p" />
          <lp-skeleton-item
            v-for="item in rows"
            :key="item"
            :class="[
              ns.e('paragraph'),
              ns.is('last', item === rows && rows > 1),
            ]"
            variant="p"
          />
        </slot>
      </template>
    </div>
  </template>
  <template v-else>
    <slot v-bind="$attrs" />
  </template>
</template>

<script lang="ts" setup>
import { toRef } from 'vue';
import { useNamespace, useThrottleRender } from '@lemon-peel/hooks';
import { skeletonProps } from './skeleton';
import LpSkeletonItem from './SkeletonItem.vue';

defineOptions({
  name: 'LpSkeleton',
});
const props = defineProps(skeletonProps);

const ns = useNamespace('skeleton');
const uiLoading = useThrottleRender(toRef(props, 'loading'), props.throttle);

defineExpose({
  /** @description loading state */
  uiLoading,
});
</script>
