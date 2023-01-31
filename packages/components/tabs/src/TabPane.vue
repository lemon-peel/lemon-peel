<template>
  <div
    v-if="shouldBeRender"
    v-show="active"
    :id="`pane-${paneName}`"
    :class="ns.b()"
    role="tabpanel"
    :aria-hidden="!active"
    :aria-labelledby="`tab-${paneName}`"
  >
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance, inject, onMounted, onUnmounted, reactive, ref, useSlots, watch } from 'vue';
import { eagerComputed } from '@vueuse/core';
import { tabsRootContextKey } from '@lemon-peel/tokens';
import { throwError } from '@lemon-peel/utils';
import { useNamespace } from '@lemon-peel/hooks';
import { tabPaneProps } from './tabPane';

const COMPONENT_NAME = 'LpTabPane';
defineOptions({
  name: COMPONENT_NAME,
});
const props = defineProps(tabPaneProps);

const instance = getCurrentInstance()!;
const slots = useSlots();

const tabsRoot = inject(tabsRootContextKey);
if (!tabsRoot)
  throwError(COMPONENT_NAME, 'usage: <lp-tabs><lp-tab-pane /></lp-tabs/>');

const ns = useNamespace('tab-pane');

const index = ref<string>();
const isClosable = computed(() => props.closable || tabsRoot.props.closable);
const active = eagerComputed(
  () => tabsRoot.currentName.value === (props.name ?? index.value),
);
const loaded = ref(active.value);
const paneName = computed(() => props.name ?? index.value);
const shouldBeRender = eagerComputed(
  () => !props.lazy || loaded.value || active.value,
);

watch(active, value => {
  if (value) loaded.value = true;
});

const pane = reactive({
  uid: instance.uid,
  slots,
  props,
  paneName,
  active,
  index,
  isClosable,
});

onMounted(() => {
  tabsRoot.registerPane(pane);
});

onUnmounted(() => {
  tabsRoot.unregisterPane(pane.uid);
});
</script>
