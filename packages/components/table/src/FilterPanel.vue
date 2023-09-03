<template>
  <lp-tooltip
    ref="tooltip"
    :visible="tooltipVisible"
    :offset="0"
    :placement="placement"
    :show-arrow="false"
    :stop-popper-mouse-event="false"
    teleported
    effect="light"
    pure
    :popper-class="ns.b()"
    persistent
  >
    <template #content>
      <div v-if="multiple">
        <div :class="ns.e('content')">
          <lp-scrollbar :wrap-class="ns.e('wrap')">
            <lp-checkbox-group v-model:value="filteredValue" :class="ns.e('checkbox-group')">
              <lp-checkbox v-for="filter in filters" :key="filter.value" :value="filter.value">
                {{ filter.text }}
              </lp-checkbox>
            </lp-checkbox-group>
          </lp-scrollbar>
        </div>
        <div :class="ns.e('bottom')">
          <button :class="{ [ns.is('disabled')]: filteredValue.length === 0 }" :disabled="filteredValue.length === 0"
                  type="button" @click="handleConfirm"
          >
            {{ t('lp.table.confirmFilter') }}
          </button>
          <button type="button" @click="handleReset">
            {{ t('lp.table.resetFilter') }}
          </button>
        </div>
      </div>
      <ul v-else :class="ns.e('list')">
        <li
          :class="[ ns.e('list-item'), { [ns.is('active')]: filterValue === undefined || filterValue === null }]"
          @click="handleSelect()"
        >
          {{ t('lp.table.clearFilter') }}
        </li>
        <li
          v-for="filter in filters"
          :key="filter.value"
          :class="[ns.e('list-item'), ns.is('active', isActive(filter))]"
          :label="filter.value"
          @click="handleSelect(filter.value)"
        >
          {{ filter.text }}
        </li>
      </ul>
    </template>

    <template #default>
      <span
        v-click-outside:[popperPaneRef]="hideFilterPanel"
        :class="[
          `${ns.namespace.value}-table__column-filter-trigger`,
          `${ns.namespace.value}-none-outline`,
        ]"
        @click="showFilterPanel"
      >
        <lp-icon>
          <arrow-up v-if="column.filterOpened" />
          <arrow-down v-else />
        </lp-icon>
      </span>
    </template>
  </lp-tooltip>
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance, inject, ref, unref, watch } from 'vue';
import LpCheckbox, { LpCheckboxGroup } from '@lemon-peel/components/checkbox';
import { LpIcon } from '@lemon-peel/components/icon';
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';
import { ClickOutside as vClickOutside } from '@lemon-peel/directives';
import { useLocale, useNamespace } from '@lemon-peel/hooks';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import LpTooltip from '@lemon-peel/components/tooltip';
import LpScrollbar from '@lemon-peel/components/scrollbar';

import type { Placement } from '@lemon-peel/components/popper';
import type { PropType, WritableComputedRef } from 'vue';
import type { Filter, TableColumnCtx } from './tableColumn/defaults';
import type { TableHeaderInstance } from './tableHeader';
import { STORE_INJECTION_KEY } from './tokens';

const props = defineProps({
  placement: { type: String as PropType<Placement>, default: 'bottom-start' },
  column: { type: Object as PropType<TableColumnCtx>, required: true },
  upDataColumn: { type: Function, required: true },
});

const instance = getCurrentInstance()!;
const { t } = useLocale();
const ns = useNamespace('table-filter');
const parent = instance.parent as unknown as TableHeaderInstance;

if (!parent.filterPanels[props.column.id]) {
  unref(parent.filterPanels)[props.column.id] = instance as any;
}

const tooltipVisible = ref(false);
const tooltip = ref<InstanceType<typeof LpTooltip> | null>(null);
const filters = computed(() => {
  return props.column && props.column.filters;
});

const filteredValue: WritableComputedRef<string[]> = computed({
  get() {
    return props.column.filteredValue || [] as string[];
  },
  set(value: string[]) {
    props.upDataColumn('filteredValue', value);
  },
});

const filterValue = computed({
  get: () => (props.column?.filteredValue || [])[0],
  set: (value: string) => {
    if (filteredValue.value) {
      if (value !== undefined && value !== null) {
        filteredValue.value.splice(0, 1, value);
      } else {
        filteredValue.value.splice(0, 1);
      }
    }
  },
});

const multiple = computed(() => {
  if (props.column) {
    return props.column.filterMultiple;
  }
  return true;
});

const isActive = (filter: Filter) => {
  return filter.value === filterValue.value;
};

const hidden = () => {
  tooltipVisible.value = false;
};

const showFilterPanel = (e: MouseEvent) => {
  e.stopPropagation();
  tooltipVisible.value = !tooltipVisible.value;
};

const hideFilterPanel = () => {
  tooltipVisible.value = false;
};

const store = inject(STORE_INJECTION_KEY)!;

const confirmFilter = (filteredValue: string[]) => {
  store.actions.filterChange({ column: props.column, values: filteredValue, silent: false });
  store.watcher.updateAllSelected();
};

const handleConfirm = () => {
  confirmFilter(filteredValue.value);
  hidden();
};

const handleReset = () => {
  filteredValue.value = [];
  confirmFilter(filteredValue.value);
  hidden();
};

const handleSelect = (filter?: string) => {
  filterValue.value = filter || '';
  if (filter !== undefined && filter !== null) {
    confirmFilter(filteredValue.value);
  } else {
    confirmFilter([]);
  }
  hidden();
};


watch(
  tooltipVisible,
  value => {
    // todo
    if (props.column) {
      props.upDataColumn('filterOpened', value);
    }
  },
  {
    immediate: true,
  },
);

const popperPaneRef = computed(() => {
  return tooltip.value?.popperRef?.contentRef;
});
</script>
