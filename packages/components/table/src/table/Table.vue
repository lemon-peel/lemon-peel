<template>
  <div
    ref="tableWrapper"
    :class="[
      {
        [ns.m('fit')]: fit,
        [ns.m('striped')]: stripe,
        [ns.m('border')]: border || isGroup,
        [ns.m('hidden')]: isHidden,
        [ns.m('group')]: isGroup,
        [ns.m('fluid-height')]: maxHeight,
        [ns.m('scrollable-x')]: layout.scrollX.value,
        [ns.m('scrollable-y')]: layout.scrollY.value,
        [ns.m('enable-row-hover')]: !store.states.isComplex.value,
        [ns.m('enable-row-transition')]:
          (store.states.data.value || []).length > 0 &&
          (store.states.data.value || []).length < 100,
        'has-footer': showSummary,
      },
      ns.m(tableSize),
      className,
      ns.b(),
      ns.m(`layout-${tableLayout}`),
    ]"
    :style="style"
    :data-prefix="ns.namespace.value"
    @mouseleave="handleMouseLeave()"
  >
    <div :class="ns.e('inner-wrapper')" :style="tableInnerStyle">
      <div ref="hiddenColumns" class="hidden-columns">
        <slot />
      </div>
      <div
        v-if="showHeader && tableLayout === 'fixed'"
        ref="headerWrapper"
        v-mousewheel="handleHeaderFooterMousewheel"
        :class="ns.e('header-wrapper')"
      >
        <table
          ref="tableHeader"
          :class="ns.e('header')"
          :style="tableBodyStyles"
          border="0"
          cellpadding="0"
          cellspacing="0"
        >
          <h-col-group
            :columns="store.states.columns.value"
            :table-layout="tableLayout"
          />
          <table-header
            ref="tableHeaderRef"
            :border="border"
            :default-sort="defaultSort"
            @set-drag-visible="setDragVisible"
          />
        </table>
      </div>
      <div ref="bodyWrapper" :class="ns.e('body-wrapper')">
        <lp-scrollbar
          ref="scrollBarRef"
          :view-style="scrollbarViewStyle"
          :wrap-style="scrollbarStyle"
          :always="scrollbarAlwaysOn"
        >
          <table
            ref="tableBody"
            :class="ns.e('body')"
            cellspacing="0"
            cellpadding="0"
            border="0"
            :style="{
              width: bodyWidth,
              tableLayout,
            }"
          >
            <h-col-group
              :columns="store.states.columns.value"
              :table-layout="tableLayout"
            />
            <table-header
              v-if="showHeader && tableLayout === 'auto'"
              ref="tableHeaderRef"
              :border="border"
              :default-sort="defaultSort"
              @set-drag-visible="setDragVisible"
            />
            <table-body
              :highlight="highlightCurrentRow"
              :row-class-name="rowClassName"
              :tooltip-effect="tooltipEffect"
              :row-style="rowStyle"
              :stripe="stripe"
            />
          </table>
          <div
            v-if="isEmpty"
            ref="emptyBlock"
            :style="emptyBlockStyle"
            :class="ns.e('empty-block')"
          >
            <span :class="ns.e('empty-text')">
              <slot name="empty">{{ computedEmptyText }}</slot>
            </span>
          </div>
          <div
            v-if="$slots.append"
            ref="appendWrapper"
            :class="ns.e('append-wrapper')"
          >
            <slot name="append" />
          </div>
        </lp-scrollbar>
      </div>
      <div
        v-if="showSummary"
        v-show="!isEmpty"
        ref="footerWrapper"
        v-mousewheel="handleHeaderFooterMousewheel"
        :class="ns.e('footer-wrapper')"
      >
        <table-footer
          :border="border"
          :default-sort="defaultSort"
          :style="tableBodyStyles"
          :sum-text="computedSumText"
          :summary-method="summaryMethod"
        />
      </div>
      <div v-if="border || isGroup" :class="ns.e('border-left-patch')" />
    </div>
    <div
      v-show="resizeProxyVisible"
      ref="resizeProxy"
      :class="ns.e('column-resize-proxy')"
    />
  </div>
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance, nextTick, onBeforeUnmount, provide } from 'vue';
import { Mousewheel as vMousewheel } from '@lemon-peel/directives';
import { useLocale, useNamespace } from '@lemon-peel/hooks';
import { debounce } from 'lodash';
import LpScrollbar from '@lemon-peel/components/scrollbar';

import { tableProps, tableEmits } from './defaults';
import TableLayout from '../layout/TableLayout';
import TableHeader from '../tableHeader/TableHeader.vue';
import TableBody from '../tableBody';
import TableFooter from '../tableFooter';
import HColGroup from '../HColGroup.vue';
import useUtils from './utilsHelper';
import useStyle from './styleHelper';

import { useScrollbar } from '../composables/useScrollbar';
import { STORE_INJECTION_KEY, TABLE_INJECTION_KEY } from '../tokens';

import type { TableVM } from './defaults';
import useStore from '../store';

let tableIdSeed = 1;

defineOptions({ name: 'LpTable' });

const props = defineProps(tableProps);
const emit = defineEmits(tableEmits);

const { t } = useLocale();
const ns = useNamespace('table');
const tableProxy = getCurrentInstance()! as unknown as TableVM;

const store = useStore(tableProxy);
provide(STORE_INJECTION_KEY, store);

const layout = new TableLayout({
  table: tableProxy,
  store,
  fit: props.fit,
  showHeader: props.showHeader,
});

const updateTableScrollY = () => {
  nextTick(() => layout.updateScrollY.apply(layout));
};

tableProxy.updateTableScrollY = updateTableScrollY;

tableProxy.layout = layout;

const isEmpty = computed(() => (store.states.data.value || []).length === 0);

/**
     * open functions
     */
const {
  setCurrentRow,
  getSelectionRows,
  toggleRowSelection,
  clearSelection,
  clearFilter,
  toggleAllSelection,
  toggleRowExpansion,
  clearSort,
  sort,
} = useUtils(store);

const {
  isHidden,
  renderExpanded,
  setDragVisible,
  isGroup,
  handleMouseLeave,
  handleHeaderFooterMousewheel,
  handleFixedMousewheel,
  tableSize,
  emptyBlockStyle,
  resizeProxyVisible,
  bodyWidth,
  resizeState,
  doLayout,
  tableBodyStyles,
  tableLayout,
  scrollbarViewStyle,
  tableInnerStyle,
  scrollbarStyle,
} = useStyle(props, layout, store, tableProxy);

const { scrollBarRef, scrollTo, setScrollLeft, setScrollTop } =
      useScrollbar();

const debouncedUpdateLayout = debounce(doLayout, 50);

const computedSumText = computed(
  () => props.sumText || t('lp.table.sumText'),
);

const computedEmptyText = computed(() => {
  return props.emptyText || t('lp.table.emptyText');
});

const tableId = `${ns.namespace.value}-table_${tableIdSeed++}`;

tableProxy.tableId = tableId;
tableProxy.state = {
  isGroup,
  resizeState,
  doLayout,
  debouncedUpdateLayout,
};
provide(TABLE_INJECTION_KEY, tableProxy);

onBeforeUnmount(() => {
  store.clear();
});

defineExpose({
  updateTableScrollY,
  $ready: false,
  state: {
    isGroup,
    resizeState,
    doLayout,
    debouncedUpdateLayout,
  },

  layout,
  store,
  handleHeaderFooterMousewheel,
  handleMouseLeave,
  tableId,
  tableSize,
  isHidden,
  isEmpty,
  renderExpanded,
  resizeProxyVisible,
  resizeState,
  isGroup,
  bodyWidth,
  tableBodyStyles,
  emptyBlockStyle,
  debouncedUpdateLayout,
  handleFixedMousewheel,
  setCurrentRow,
  getSelectionRows,
  toggleRowSelection,
  clearSelection,
  clearFilter,
  toggleAllSelection,
  toggleRowExpansion,
  clearSort,
  doLayout,
  sort,
  t,
  setDragVisible,
  context: tableProxy,
  computedSumText,
  computedEmptyText,
  tableLayout,
  scrollbarViewStyle,
  tableInnerStyle,
  scrollbarStyle,
  scrollBarRef,
  scrollTo,
  setScrollLeft,
  setScrollTop,
});
</script>
