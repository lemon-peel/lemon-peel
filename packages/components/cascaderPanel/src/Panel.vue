<template>
  <div
    :class="[ns.b('panel'), ns.is('bordered', border)]"
    @keydown="handleKeyDown"
  >
    <lp-cascader-menu
      v-for="(menu, index) in menus"
      :key="index"
      :ref="(item) => (menuList[index] = item)"
      :index="index"
      :nodes="[...menu]"
    />
  </div>
</template>

<script lang="tsx" setup>
import { computed, Fragment, nextTick, onBeforeUpdate, onMounted, provide, reactive, ref, useSlots, watch } from 'vue';
import { cloneDeep, flattenDeep, isEqual } from 'lodash';
import { isClient } from '@vueuse/core';
import { castArray, focusNode, getSibling, isEmpty, scrollIntoView, unique } from '@lemon-peel/utils';
import { CHANGE_EVENT, EVENT_CODE, UPDATE_MODEL_EVENT } from '@lemon-peel/constants';
import { useNamespace } from '@lemon-peel/hooks';
import { LpRadioGroup } from '@lemon-peel/components/radio';

import LpCascaderMenu from './Menu.vue';
import Store from './store';
import Node from './node';
import { useCascaderConfig } from './config';
import { checkNode, getMenuIndex, sortByOriginalOrder } from './utils';
import { CASCADER_PANEL_INJECTION_KEY } from './types';

import type { FunctionalComponent } from 'vue';
import type { Nullable } from '@lemon-peel/utils';
import type { default as CascaderNode, CascaderNodeValue, CascaderOption, CascaderValue } from './node';

import type { LpCascaderPanelContext } from './types';
import { cascaderPanelEmits, cascaderPanelProps } from './panel';
import { render } from 'vue';

defineOptions({
  name: 'LpCascaderPanel',
});

const props = defineProps(cascaderPanelProps);
const emit = defineEmits(cascaderPanelEmits);
const slots = useSlots();


// for interrupt sync check status in lazy mode
let manualChecked = false;

const ns = useNamespace('cascader');
const config = useCascaderConfig(props);

let store: Nullable<Store> = null;
const initialLoaded = ref(true);
const menuList = ref<any[]>([]);
const checkedValue = ref<Nullable<CascaderValue>>(null);
const menus = ref<CascaderNode[][]>([]);
const expandingNode = ref<Nullable<CascaderNode>>(null);
const checkedNodes = ref<CascaderNode[]>([]);

const isHoverMenu = computed(() => config.value.expandTrigger === 'hover');
const renderLabelFn = computed(() => props.renderLabel || slots.default);

const lazyLoad: LpCascaderPanelContext['lazyLoad'] = (node, callback) => {
  const cfg = config.value;
  node = node ?? new Node({}, cfg, undefined, true);
  node!.loading = true;
  const oldIndeterminate = node!.indeterminate;
  node!.indeterminate = true;

  const resolve = (dataList: CascaderOption[]) => {
    const parent = node!.root ? null : node;
    dataList && store?.appendNodes(dataList, parent as any);
    node!.indeterminate = oldIndeterminate;
    node!.loading = false;
    node!.loaded = true;
    node!.childrenData ||= [];
    callback && callback(dataList);
  };

  cfg.lazyLoad(node, resolve as any);
};


const wrapComponent = computed<FunctionalComponent>(() => {
  return (localProps, { slots }) => config.value.checkStrictly
    ? (<LpRadioGroup {...localProps}>{slots.default?.()}</LpRadioGroup>)
    : <Fragment>{slots.default?.()}</Fragment>;
});

const expandNode: LpCascaderPanelContext['expandNode'] = (node, silent) => {
  const { level } = node;
  const newMenus = menus.value.slice(0, level);
  let newExpandingNode: Nullable<CascaderNode>;

  if (node.isLeaf) {
    newExpandingNode = node.pathNodes[level - 2];
  } else {
    newExpandingNode = node;
    newMenus.push(node.children);
  }

  if (expandingNode.value?.uid !== newExpandingNode?.uid) {
    expandingNode.value = node;
    menus.value = newMenus;
    !silent && emit('expand-change', node?.pathValues || []);
  }
};

const scrollToExpandingNode = () => {
  if (!isClient) return;

  for (const menu of menuList.value) {
    const menuElement = menu?.$el;
    if (menuElement) {
      const container = menuElement.querySelector(`.${ns.namespace.value}-scrollbar__wrap`);
      const activeNode =
            menuElement.querySelector(`.${ns.b('node')}.${ns.is('active')}`) ||
            menuElement.querySelector(`.${ns.b('node')}.in-active-path`);
      scrollIntoView(container, activeNode);
    }
  }
};

const syncMenuState = (
  newCheckedNodes: CascaderNode[],
  reserveExpandingState = true,
) => {
  const { checkStrictly } = config.value;
  const oldNodes = checkedNodes.value;
  const newNodes = newCheckedNodes.filter(
    node => !!node && (checkStrictly || node.isLeaf),
  );
  const oldExpandingNode = store?.getSameNode(expandingNode.value!);
  const newExpandingNode =
        (reserveExpandingState && oldExpandingNode) || newNodes[0];

  if (newExpandingNode) {
    for (const node of newExpandingNode.pathNodes) expandNode(node, true);
  } else {
    expandingNode.value = null;
  }

  for (const node of oldNodes) node.doCheck(false);
  for (const node of newNodes) node.doCheck(true);

  checkedNodes.value = newNodes;
  nextTick(scrollToExpandingNode);
};

const syncCheckedValue = (loaded = false, forced = false) => {
  const { value } = props;
  const { lazy, multiple, checkStrictly } = config.value;
  const leafOnly = !checkStrictly;

  if (
    !initialLoaded.value
        || manualChecked
        || (!forced && isEqual(value, checkedValue.value))
  )
    return;

  if (!lazy || loaded) {
    const values = multiple ? castArray(value) : [value];
    const nodes = unique(
      values.map(value => store?.getNodeByValue(value as any, leafOnly)),
    ) as Node[];
    syncMenuState(nodes, forced);
    checkedValue.value = cloneDeep(value) as any;
    return;
  }

  const values: CascaderNodeValue[] = unique(flattenDeep(castArray(value) as CascaderNodeValue[]));

  const nodes = values
    .map(value => store?.getNodeByValue(value))
    .filter(node => !!node && !(node as Node).loaded && !node.loading) as Node[];

  if (nodes.length > 0) {
    for (const node of nodes) {
      lazyLoad(node, () => syncCheckedValue(false, forced));
    }
  } else {
    syncCheckedValue(true, forced);
  }
};

const initStore = () => {
  const { options } = props;
  const cfg = config.value;

  manualChecked = false;
  store = new Store(options, cfg);
  menus.value = [store.getNodes()];

  if (cfg.lazy && isEmpty(props.options)) {
    initialLoaded.value = false;
    lazyLoad(null, list => {
      if (list) {
        store = new Store(list, cfg);
        menus.value = [store.getNodes()];
      }
      initialLoaded.value = true;
      syncCheckedValue(false, true);
    });
  } else {
    syncCheckedValue(false, true);
  }
};

const getFlattedNodes = (leafOnly: boolean) => {
  return store?.getFlattedNodes(leafOnly);
};

const getCheckedNodes = (leafOnly: boolean) => {
  return getFlattedNodes(leafOnly)?.filter(node => node.checked !== false);
};

const calculateCheckedValue = () => {
  const { checkStrictly, multiple } = config.value;
  const oldNodes = checkedNodes.value;
  const newNodes = getCheckedNodes(!checkStrictly)!;
  // ensure the original order
  const nodes = sortByOriginalOrder(oldNodes, newNodes);
  const values = nodes.map(node => node.valueByOption);
  checkedNodes.value = nodes;
  checkedValue.value = multiple ? values : values[0] ?? null;
};

const expandParentNode = (node: Node) => {
  if (!node) return;
  node = node.parent!;
  expandParentNode(node);
  node && expandNode(node);
};

const handleCheckChange: LpCascaderPanelContext['handleCheckChange'] = (
  node,
  checked,
  emitClose = true,
) => {
  const { checkStrictly, multiple } = config.value;
  const oldNode = checkedNodes.value[0];
  manualChecked = true;

  !multiple && oldNode?.doCheck(false);
  node.doCheck(checked);
  calculateCheckedValue();
  emitClose && !multiple && !checkStrictly && emit('close');
  !emitClose && !multiple && !checkStrictly && expandParentNode(node);
};

const clearCheckedNodes = () => {
  for (const node of checkedNodes.value) node.doCheck(false);
  calculateCheckedValue();
};

const handleKeyDown = (e: KeyboardEvent) => {
  const target = e.target as HTMLElement;
  const { code } = e;

  switch (code) {
    case EVENT_CODE.up:
    case EVENT_CODE.down: {
      e.preventDefault();
      const distance = code === EVENT_CODE.up ? -1 : 1;
      focusNode(
        getSibling(target, distance, `.${ns.b('node')}[tabindex="-1"]`) as HTMLElement,
      );
      break;
    }
    case EVENT_CODE.left: {
      e.preventDefault();
      const preMenu = menuList.value[getMenuIndex(target) - 1];
      const expandedNode = preMenu?.$el.querySelector(
        `.${ns.b('node')}[aria-expanded="true"]`,
      );
      focusNode(expandedNode);
      break;
    }
    case EVENT_CODE.right: {
      e.preventDefault();
      const nextMenu = menuList.value[getMenuIndex(target) + 1];
      const firstNode = nextMenu?.$el.querySelector(
        `.${ns.b('node')}[tabindex="-1"]`,
      );
      focusNode(firstNode);
      break;
    }
    case EVENT_CODE.enter: {
      checkNode(target);
      break;
    }
  }
};

provide(
  CASCADER_PANEL_INJECTION_KEY,
  reactive({
    config,
    expandingNode,
    checkedNodes,
    isHoverMenu,
    initialLoaded,
    renderLabelFn: renderLabelFn.value as any,
    lazyLoad,
    expandNode,
    handleCheckChange,
  }),
);

watch([config, () => props.options], initStore, {
  deep: true,
  immediate: true,
});

watch(
  () => props.value,
  () => {
    manualChecked = false;
    syncCheckedValue();
  },
  {
    deep: true,
  },
);

watch(
  () => checkedValue.value,
  value => {
    if (!isEqual(value, props.value)) {
      emit(UPDATE_MODEL_EVENT, value);
      emit(CHANGE_EVENT, value);
    }
  },
);

onBeforeUpdate(() => (menuList.value = []));

onMounted(() => !isEmpty(props.value) && syncCheckedValue());

defineExpose({
  checkedNodes,
  getCheckedNodes,
  calculateCheckedValue,
  clearCheckedNodes,
  handleCheckChange,
  getFlattedNodes,
  scrollToExpandingNode,
});
</script>
