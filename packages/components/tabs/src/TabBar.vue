<template>
  <div
    ref="barRef"
    :class="[ns.e('active-bar'), ns.is(rootTabs.props.tabPosition)]"
    :style="barStyle"
  />
</template>

<script lang="ts" setup>
import { getCurrentInstance, inject, nextTick, ref, watch } from 'vue';
import { useResizeObserver } from '@vueuse/core';
import { capitalize, throwError } from '@lemon-peel/utils';
import { tabsRootContextKey } from '@lemon-peel/tokens';
import { useNamespace } from '@lemon-peel/hooks';
import { tabBarProps } from './tabBar';

import type { CSSProperties } from 'vue';

const COMPONENT_NAME = 'LpTabBar';
defineOptions({
  name: COMPONENT_NAME,
});
const props = defineProps(tabBarProps);

const instance = getCurrentInstance()!;
const rootTabs = inject(tabsRootContextKey);
if (!rootTabs) throwError(COMPONENT_NAME, '<lp-tabs><lp-tab-bar /></lp-tabs>');

const ns = useNamespace('tabs');

const barRef = ref<HTMLDivElement>();
const barStyle = ref<CSSProperties>();

const getBarStyle = (): CSSProperties => {
  let offset = 0;
  let tabSize = 0;

  const sizeName = ['top', 'bottom'].includes(rootTabs.props.tabPosition)
    ? 'width'
    : 'height';
  const sizeDir = sizeName === 'width' ? 'x' : 'y';

  props.tabs.every(tab => {
    const $element = instance.parent?.refs?.[`tab-${tab.uid}`] as HTMLElement;
    if (!$element) return false;

    if (!tab.active) {
      return true;
    }

    tabSize = $element[`client${capitalize(sizeName)}`];
    const position = sizeDir === 'x' ? 'left' : 'top';

    offset =
      $element[`offset${capitalize(position)}`] -
      ($element.parentElement?.[`offset${capitalize(position)}`] ?? 0);

    const scrollwrapElement = $element.closest('.is-scrollable');
    if (scrollwrapElement) {
      const scrollWrapStyle = window.getComputedStyle(scrollwrapElement);
      offset += Number.parseFloat(
        scrollWrapStyle[`padding${capitalize(position)}`],
      );
    }

    const tabStyles = window.getComputedStyle($element);

    if (sizeName === 'width') {
      if (props.tabs.length > 1) {
        tabSize -=
          Number.parseFloat(tabStyles.paddingLeft) +
          Number.parseFloat(tabStyles.paddingRight);
      }
      offset += Number.parseFloat(tabStyles.paddingLeft);
    }
    return false;
  });

  return {
    [sizeName]: `${tabSize}px`,
    transform: `translate${capitalize(sizeDir)}(${offset}px)`,
  };
};

const update = () => (barStyle.value = getBarStyle());

watch(
  () => props.tabs,
  async () => {
    await nextTick();
    update();
  },
  { immediate: true },
);
useResizeObserver(barRef, () => update());

defineExpose({
  /** @description tab root html element */
  ref: barRef,
  /** @description method to manually update tab bar style */
  update,
});
</script>
