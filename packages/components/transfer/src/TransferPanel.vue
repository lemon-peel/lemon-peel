<template>
  <div :class="ns.b('panel')">
    <p :class="ns.be('panel', 'header')">
      <lp-checkbox
        v-model="allChecked"
        :indeterminate="isIndeterminate"
        :validate-event="false"
        @change="handleAllCheckedChange"
      >
        {{ title }}
        <span>{{ checkedSummary }}</span>
      </lp-checkbox>
    </p>

    <div :class="[ns.be('panel', 'body'), ns.is('with-footer', hasFooter)]">
      <lp-input
        v-if="filterable"
        v-model="query"
        :class="ns.be('panel', 'filter')"
        size="default"
        :placeholder="placeholder"
        :prefix-icon="Search"
        clearable
        :validate-event="false"
        @mouseenter="inputHover = true"
        @mouseleave="inputHover = false"
      />
      <lp-checkbox-group
        v-show="!hasNoMatch && !isEmpty(data)"
        v-model="checked"
        :validate-event="false"
        :class="[ns.is('filterable', filterable), ns.be('panel', 'list')]"
      >
        <lp-checkbox
          v-for="item in filteredData"
          :key="item[propsAlias.key]"
          :class="ns.be('panel', 'item')"
          :label="item[propsAlias.key]"
          :disabled="item[propsAlias.disabled]"
          :validate-event="false"
        >
          <option-content :option="optionRender?.(item)" />
        </lp-checkbox>
      </lp-checkbox-group>
      <p v-show="hasNoMatch || isEmpty(data)" :class="ns.be('panel', 'empty')">
        {{ hasNoMatch ? t('el.transfer.noMatch') : t('el.transfer.noData') }}
      </p>
    </div>
    <p v-if="hasFooter" :class="ns.be('panel', 'footer')">
      <slot />
    </p>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, toRefs, useSlots } from 'vue';
import { isEmpty } from '@lemon-peel/utils';
import { useLocale, useNamespace } from '@lemon-peel/hooks';
import { LpCheckbox, LpCheckboxGroup } from '@lemon-peel/components/checkbox';
import { LpInput } from '@lemon-peel/components/input';
import { Search } from '@element-plus/icons-vue';
import { transferPanelEmits, transferPanelProps } from './TransferPanel.vue';
import { useCheck, usePropsAlias } from './composables';

import type { VNode } from 'vue';
import type { TransferPanelState } from './TransferPanel.vue';

defineOptions({
  name: 'LpTransferPanel',
});

const props = defineProps(transferPanelProps);
const emit = defineEmits(transferPanelEmits);
const slots = useSlots();

const OptionContent = ({ option }: { option: VNode | VNode[] }) => option;

const { t } = useLocale();
const ns = useNamespace('transfer');

const panelState = reactive<TransferPanelState>({
  checked: [],
  allChecked: false,
  query: '',
  inputHover: false,
  checkChangeByUser: true,
});

const propsAlias = usePropsAlias(props);

const {
  filteredData,
  checkedSummary,
  isIndeterminate,
  handleAllCheckedChange,
} = useCheck(props, panelState, emit);

const hasNoMatch = computed(
  () => !isEmpty(panelState.query) && isEmpty(filteredData.value),
);

const hasFooter = computed(() => !isEmpty(slots.default!()[0].children));

const { checked, allChecked, query, inputHover } = toRefs(panelState);

defineExpose({
  /** @description filter keyword */
  query,
});
</script>
