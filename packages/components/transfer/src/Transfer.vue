<template>
  <div :class="ns.b()">
    <transfer-panel
      ref="leftPanel"
      :data="sourceData"
      :option-render="optionRender"
      :placeholder="panelFilterPlaceholder"
      :title="leftPanelTitle"
      :filterable="filterable"
      :format="format"
      :filter-method="filterMethod"
      :default-checked="leftDefaultChecked"
      :props="props.props"
      @checked-change="onSourceCheckedChange"
    >
      <slot name="left-footer" />
    </transfer-panel>
    <div :class="ns.e('buttons')">
      <lp-button
        type="primary"
        :class="[ns.e('button'), ns.is('with-texts', hasButtonTexts)]"
        :disabled="isEmpty(checkedState.rightChecked)"
        @click="addToLeft"
      >
        <lp-icon><arrow-left /></lp-icon>
        <span v-if="!isUndefined(buttonTexts[0])">{{ buttonTexts[0] }}</span>
      </lp-button>
      <lp-button
        type="primary"
        :class="[ns.e('button'), ns.is('with-texts', hasButtonTexts)]"
        :disabled="isEmpty(checkedState.leftChecked)"
        @click="addToRight"
      >
        <span v-if="!isUndefined(buttonTexts[1])">{{ buttonTexts[1] }}</span>
        <lp-icon><arrow-right /></lp-icon>
      </lp-button>
    </div>
    <transfer-panel
      ref="rightPanel"
      :data="targetData"
      :option-render="optionRender"
      :placeholder="panelFilterPlaceholder"
      :filterable="filterable"
      :format="format"
      :filter-method="filterMethod"
      :title="rightPanelTitle"
      :default-checked="rightDefaultChecked"
      :props="props.props"
      @checked-change="onTargetCheckedChange"
    >
      <slot name="right-footer" />
    </transfer-panel>
  </div>
</template>

<script lang="ts" setup>
import { computed, h, reactive, ref, useSlots, watch } from 'vue';
import { debugWarn, isEmpty, isUndefined } from '@lemon-peel/utils';
import { useFormItem, useLocale, useNamespace } from '@lemon-peel/hooks';
import { LpButton } from '@lemon-peel/components/button';
import { LpIcon } from '@lemon-peel/components/icon';
import { ArrowLeft, ArrowRight } from '@element-plus/icons-vue';

import { transferEmits, transferProps } from './transfer';
import { useCheckedChange, useComputedData, useMove, usePropsAlias } from './composables';
import TransferPanel from './TransferPanel.vue';

import type { TransferCheckedState, TransferDataItem, TransferDirection } from './transfer';
import type { TransferPanelInstance } from './transferPanel';

defineOptions({
  name: 'LpTransfer',
});

const props = defineProps(transferProps);
const emit = defineEmits(transferEmits);
const slots = useSlots();

const { t } = useLocale();
const ns = useNamespace('transfer');
const { formItem } = useFormItem();

const checkedState = reactive<TransferCheckedState>({
  leftChecked: [],
  rightChecked: [],
});

const propsAlias = usePropsAlias(props);

const { sourceData, targetData } = useComputedData(props);

const { onSourceCheckedChange, onTargetCheckedChange } = useCheckedChange(checkedState, emit);

const { addToLeft, addToRight } = useMove(props, checkedState, emit);

const leftPanel = ref<TransferPanelInstance>();
const rightPanel = ref<TransferPanelInstance>();

const clearQuery = (which: TransferDirection) => {
  switch (which) {
    case 'left': {
      leftPanel.value!.query = '';
      break;
    }
    case 'right': {
      rightPanel.value!.query = '';
      break;
    }
  }
};

const hasButtonTexts = computed(() => props.buttonTexts.length === 2);

const leftPanelTitle = computed(
  () => props.titles[0] || t('lp.transfer.titles.0'),
);

const rightPanelTitle = computed(
  () => props.titles[1] || t('lp.transfer.titles.1'),
);

const panelFilterPlaceholder = computed(
  () => props.filterPlaceholder || t('lp.transfer.filterPlaceholder'),
);

watch(
  () => props.value,
  () => {
    if (props.validateEvent) {
      formItem?.validate?.('change').catch(error => debugWarn(error));
    }
  },
);

// eslint-disable-next-line unicorn/consistent-function-scoping
const optionRender = computed(() => (option: TransferDataItem) => {
  if (props.renderContent) return props.renderContent(h, option);

  if (slots.default) return slots.default({ option });

  return h(
    'span',
    option[propsAlias.value.label] || option[propsAlias.value.key],
  );
});

defineExpose({
  /** @description clear the filter keyword of a certain panel */
  clearQuery,
  /** @description left panel ref */
  leftPanel,
  /** @description left panel ref */
  rightPanel,
});
</script>
