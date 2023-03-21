<template>
  <span :class="ns.e('item')">
    <span
      ref="link"
      :class="[ns.e('inner'), ns.is('link', !!to)]"
      role="link"
      @click="onClick"
    >
      <slot />
    </span>
    <lp-icon v-if="separatorIcon" :class="ns.e('separator')">
      <component :is="separatorIcon" />
    </lp-icon>
    <span v-else :class="ns.e('separator')" role="presentation">
      {{ separator }}
    </span>
  </span>
</template>

<script lang="ts" setup>
import { getCurrentInstance, inject, ref, toRefs } from 'vue';
import LpIcon from '@lemon-peel/components/icon';
import { breadcrumbKey } from '@lemon-peel/tokens';
import { useNamespace } from '@lemon-peel/hooks';
import { breadcrumbItemProps } from './breadcrumbItem';

import type { Router } from 'vue-router';

defineOptions({
  name: 'LpBreadcrumbItem',
});

const props = defineProps(breadcrumbItemProps);

const instance = getCurrentInstance()!;
const breadcrumbContext = inject(breadcrumbKey, null)!;
const ns = useNamespace('breadcrumb');

const { separator, separatorIcon } = toRefs(breadcrumbContext);
const router = instance.proxy?.$router as Router;

const link = ref<HTMLSpanElement>();

const onClick = () => {
  if (!props.to || !router) return;
  props.replace ? router.replace(props.to) : router.push(props.to);
};
</script>
