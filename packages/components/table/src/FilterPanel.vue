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
            <lp-checkbox-group
              v-model="filteredValue"
              :class="ns.e('checkbox-group')"
            >
              <lp-checkbox
                v-for="filter in filters"
                :key="filter.value"
                :label="filter.value"
              >
                {{ filter.text }}
              </lp-checkbox>
            </lp-checkbox-group>
          </lp-scrollbar>
        </div>
        <div :class="ns.e('bottom')">
          <button
            :class="{ [ns.is('disabled')]: filteredValue.length === 0 }"
            :disabled="filteredValue.length === 0"
            type="button"
            @click="handleConfirm"
          >
            {{ t('el.table.confirmFilter') }}
          </button>
          <button type="button" @click="handleReset">
            {{ t('el.table.resetFilter') }}
          </button>
        </div>
      </div>
      <ul v-else :class="ns.e('list')">
        <li
          :class="[
            ns.e('list-item'),
            {
              [ns.is('active')]:
                filterValue === undefined || filterValue === null,
            },
          ]"
          @click="handleSelect()"
        >
          {{ t('el.table.clearFilter') }}
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
import { computed, getCurrentInstance, ref, watch } from 'vue';
import LpCheckbox from '@lemon-peel/components/checkbox';
import { LpIcon } from '@lemon-peel/components/icon';
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';
import { ClickOutside as vClickOutside } from '@lemon-peel/directives';
import { useLocale, useNamespace } from '@lemon-peel/hooks';
import type LpTooltip from '@lemon-peel/components/tooltip';
import LpScrollbar from '@lemon-peel/components/scrollbar';
import type { Placement } from '@lemon-peel/components/popper';

import type { PropType, WritableComputedRef } from 'vue';
import type { TableColumnCtx } from './tableColumn/defaults';
import type { TableHeaderInstance } from './tableHeader';

const { CheckboxGroup: LpCheckboxGroup } = LpCheckbox;

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
  parent.filterPanels.value[props.column.id] = instance;
}

const tooltipVisible = ref(false);
const tooltip = ref<InstanceType<typeof LpTooltip> | null>(null);
const filters = computed(() => {
  return props.column && props.column.filters;
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
const filteredValue: WritableComputedRef<unknown[]> = computed({
  get() {
    if (props.column) {
      return props.column.filteredValue || [];
    }
    return [];
  },
  set(value: unknown[]) {
    if (props.column) {
      props.upDataColumn('filteredValue', value);
    }
  },
});

const multiple = computed(() => {
  if (props.column) {
    return props.column.filterMultiple;
  }
  return true;
});

const isActive = filter => {
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

const handleConfirm = () => {
  confirmFilter(filteredValue.value);
  hidden();
};

const handleReset = () => {
  filteredValue.value = [];
  confirmFilter(filteredValue.value);
  hidden();
};

const handleSelect = (_filterValue?: string) => {
  filterValue.value = _filterValue;
  if (_filterValue !== undefined && _filterValue !== null) {
    confirmFilter(filteredValue.value);
  } else {
    confirmFilter([]);
  }
  hidden();
};

const confirmFilter = (filteredValue: unknown[]) => {
  props.store.commit('filterChange', {
    column: props.column,
    values: filteredValue,
  });
  props.store.updateAllSelected();
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
