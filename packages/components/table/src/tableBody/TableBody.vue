<template>
  <tbody><component :is="renderBody" /></tbody>
</template>

<script lang="ts" setup>
import { getCurrentInstance, inject, onUnmounted, watch } from 'vue';
import { isClient } from '@vueuse/core';
import { useNamespace } from '@lemon-peel/hooks';
import { addClass, removeClass } from '@lemon-peel/utils';

import { STORE_INJECTION_KEY, TABLE_INJECTION_KEY } from '../tokens';
import { removePopper } from '../util';
import { tableBodyProps } from './defaults';
import useLayoutObserver from '../layout/layoutObserver';
import useRender from './renderHelper';

import type { VNode } from 'vue';

const props = defineProps(tableBodyProps);

defineOptions({
  name: 'LpTableBody',
});

const instance = getCurrentInstance();
const parent = inject(TABLE_INJECTION_KEY)!;
const store = inject(STORE_INJECTION_KEY)!;
const ns = useNamespace('table');

const { renderWrappedRow } = useRender(props);

const {
  onColumnsChange,
  onScrollableChange,
} = useLayoutObserver(parent!);

watch(store.states.hoverRow, (newVal: any, oldVal: any) => {
  if (!store.states.isComplex.value || !isClient) return;
  let raf = window.requestAnimationFrame;
  if (!raf) {
    raf = fn => window.setTimeout(fn, 16);
  }
  raf(() => {
    // just get first level children; fix #9723
    const el = instance?.vnode.el as HTMLElement;
    const rows = Array.from(el?.children || []).filter(e =>
      e?.classList.contains(`${ns.e('row')}`),
    );
    const oldRow = rows[oldVal];
    const newRow = rows[newVal];
    if (oldRow) {
      removeClass(oldRow, 'hover-row');
    }
    if (newRow) {
      addClass(newRow, 'hover-row');
    }
  });
});

const renderBody = () => {
  const data = store.states.data.value || [];
  return data.reduce((all, row) => {
    return all.concat(renderWrappedRow(row, all.length));
  }, [] as VNode[]);
};

onUnmounted(() => {
  removePopper?.();
});
</script>