<template>
  <div
    :class="[
      ppNs.b(),
      drpNs.b(),
      {
        'has-sidebar': Boolean($slots.sidebar) || hasShortcuts,
      },
    ]"
  >
    <div :class="ppNs.e('body-wrapper')">
      <slot name="sidebar" :class="ppNs.e('sidebar')" />
      <div v-if="hasShortcuts" :class="ppNs.e('sidebar')">
        <button
          v-for="(shortcut, key) in shortcuts"
          :key="key"
          type="button"
          :class="ppNs.e('shortcut')"
          @click="handleShortcutClick(shortcut)"
        >
          {{ shortcut.text }}
        </button>
      </div>
      <div :class="ppNs.e('body')">
        <div :class="[ppNs.e('content'), drpNs.e('content')]" class="is-left">
          <div :class="drpNs.e('header')">
            <button
              type="button"
              :class="ppNs.e('icon-btn')"
              class="d-arrow-left"
              @click="leftPrevYear"
            >
              <lp-icon><d-arrow-left /></lp-icon>
            </button>
            <button
              v-if="unlinkPanels"
              type="button"
              :disabled="!enableYearArrow"
              :class="[
                ppNs.e('icon-btn'),
                { [ppNs.is('disabled')]: !enableYearArrow },
              ]"
              class="d-arrow-right"
              @click="leftNextYear"
            >
              <lp-icon><d-arrow-right /></lp-icon>
            </button>
            <div>{{ leftLabel }}</div>
          </div>
          <month-table
            selection-mode="range"
            :date="leftDate"
            :min-date="minDate"
            :max-date="maxDate"
            :range-state="rangeState"
            :disabled-date="disabledDate"
            @changerange="handleChangeRange"
            @pick="handleRangePick"
            @select="onSelect"
          />
        </div>
        <div :class="[ppNs.e('content'), drpNs.e('content')]" class="is-right">
          <div :class="drpNs.e('header')">
            <button
              v-if="unlinkPanels"
              type="button"
              :disabled="!enableYearArrow"
              :class="[ppNs.e('icon-btn'), { 'is-disabled': !enableYearArrow }]"
              class="d-arrow-left"
              @click="rightPrevYear"
            >
              <lp-icon><d-arrow-left /></lp-icon>
            </button>
            <button
              type="button"
              :class="ppNs.e('icon-btn')"
              class="d-arrow-right"
              @click="rightNextYear"
            >
              <lp-icon><d-arrow-right /></lp-icon>
            </button>
            <div>{{ rightLabel }}</div>
          </div>
          <month-table
            selection-mode="range"
            :date="rightDate"
            :min-date="minDate"
            :max-date="maxDate"
            :range-state="rangeState"
            :disabled-date="disabledDate"
            @changerange="handleChangeRange"
            @pick="handleRangePick"
            @select="onSelect"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, ref, toRef } from 'vue';
import dayjs from 'dayjs';
import LpIcon from '@lemon-peel/components/icon';
import { TIME_PICKER_INJECTION_KEY } from '@lemon-peel/components/timePicker';
import { useLocale } from '@lemon-peel/hooks';
import { DArrowLeft, DArrowRight } from '@element-plus/icons-vue';
import { panelMonthRangeEmits, panelMonthRangeProps } from '../props/panelMonthRange';
import { useMonthRangeHeader } from '../composables/useMonthRangeJeader';
import { useRangePicker } from '../composables/useRangePicker';
import MonthTable from './BasicMonthTable.vue';

import type { Dayjs } from 'dayjs';

defineOptions({
  name: 'DatePickerMonthRange',
});

const props = defineProps(panelMonthRangeProps);
const emit = defineEmits(panelMonthRangeEmits);
const unit = 'year';

const { lang } = useLocale();
const pickerBase = inject(TIME_PICKER_INJECTION_KEY)!;
const { shortcuts, disabledDate, format } = pickerBase.props;
const defaultValue = toRef(pickerBase.props, 'defaultValue');
const leftDate = ref(dayjs().locale(lang.value));
const rightDate = ref(dayjs().locale(lang.value).add(1, unit));

function onParsedValueChanged(
  minDate: Dayjs | undefined,
  maxDate: Dayjs | undefined,
) {
  if (props.unlinkPanels && maxDate) {
    const minDateYear = minDate?.year() || 0;
    const maxDateYear = maxDate.year();
    rightDate.value =
      minDateYear === maxDateYear ? maxDate.add(1, unit) : maxDate;
  } else {
    rightDate.value = leftDate.value.add(1, unit);
  }
}

const {
  minDate,
  maxDate,
  rangeState,
  ppNs,
  drpNs,

  handleChangeRange,
  handleRangeConfirm,
  handleShortcutClick,
  onSelect,
} = useRangePicker(props, {
  defaultValue,
  leftDate,
  rightDate,
  unit,
  onParsedValueChanged,
});

const hasShortcuts = computed(() => !!shortcuts.length);

const {
  leftPrevYear,
  rightNextYear,
  leftNextYear,
  rightPrevYear,
  leftLabel,
  rightLabel,
  leftYear,
  rightYear,
} = useMonthRangeHeader({
  unlinkPanels: toRef(props, 'unlinkPanels'),
  leftDate,
  rightDate,
});

const enableYearArrow = computed(() => {
  return props.unlinkPanels && rightYear.value > leftYear.value + 1;
});

type RangePickValue = {
  minDate: Dayjs;
  maxDate: Dayjs;
};

const handleRangePick = (val: RangePickValue, close = true) => {
  // const defaultTime = props.defaultTime || []
  // const minDate_ = modifyWithTimeString(val.minDate, defaultTime[0])
  // const maxDate_ = modifyWithTimeString(val.maxDate, defaultTime[1])
  // todo
  const min = val.minDate;
  const max = val.maxDate;
  if (maxDate.value === max && minDate.value === min) {
    return;
  }
  maxDate.value = max;
  minDate.value = min;

  if (!close) return;
  handleRangeConfirm();
};

const formatToString = (days: Dayjs[]) => {
  return days.map(day => day.format(format));
};

emit('set-picker-option', ['formatToString', formatToString]);
</script>
