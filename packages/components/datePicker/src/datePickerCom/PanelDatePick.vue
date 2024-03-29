<template>
  <div
    :class="[
      ppNs.b(),
      dpNs.b(),
      {
        'has-sidebar': $slots.sidebar || hasShortcuts,
        'has-time': showTime,
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
          @click="handleShortcutClick(shortcut as any)"
        >
          {{ shortcut.text }}
        </button>
      </div>
      <div :class="ppNs.e('body')">
        <div v-if="showTime" :class="dpNs.e('time-header')">
          <span :class="dpNs.e('editor-wrap')">
            <lp-input
              :placeholder="t('lp.datepicker.selectDate')"
              :value="visibleDate"
              size="small"
              :validate-event="false"
              @input="(val: any) => (userInputDate = val)"
              @change="handleVisibleDateChange"
            />
          </span>
          <span
            v-click-outside="handleTimePickClose"
            :class="dpNs.e('editor-wrap')"
          >
            <lp-input
              :placeholder="t('lp.datepicker.selectTime')"
              :value="visibleTime"
              size="small"
              :validate-event="false"
              @focus="onTimePickerInputFocus"
              @input="(val: any) => (userInputTime = val)"
              @change="handleVisibleTimeChange"
            />
            <time-pick-panel
              :visible="timePickerVisible"
              :format="timeFormat"
              :time-arrow-control="arrowControl"
              :parsed-value="innerDate"
              @pick="handleTimePick"
            />
          </span>
        </div>
        <div
          v-show="currentView !== 'time'"
          :class="[
            dpNs.e('header'),
            (currentView === 'year' || currentView === 'month') &&
              dpNs.e('header--bordered'),
          ]"
        >
          <span :class="dpNs.e('prev-btn')">
            <button
              type="button"
              :aria-label="t(`lp.datepicker.prevYear`)"
              class="d-arrow-left"
              :class="ppNs.e('icon-btn')"
              @click="moveByYear(false)"
            >
              <lp-icon><d-arrow-left /></lp-icon>
            </button>
            <button
              v-show="currentView === 'date'"
              type="button"
              :aria-label="t(`lp.datepicker.prevMonth`)"
              :class="ppNs.e('icon-btn')"
              class="arrow-left"
              @click="moveByMonth(false)"
            >
              <lp-icon><arrow-left /></lp-icon>
            </button>
          </span>
          <span
            role="button"
            :class="dpNs.e('header-label')"
            aria-live="polite"
            tabindex="0"
            @keydown.enter="showPicker('year')"
            @click="showPicker('year')"
          >{{ yearLabel }}</span>
          <span
            v-show="currentView === 'date'"
            role="button"
            aria-live="polite"
            tabindex="0"
            :class="[
              dpNs.e('header-label'),
              { active: currentView === 'month' },
            ]"
            @keydown.enter="showPicker('month')"
            @click="showPicker('month')"
          >{{ t(`lp.datepicker.month${month + 1}`) }}</span>
          <span :class="dpNs.e('next-btn')">
            <button
              v-show="currentView === 'date'"
              type="button"
              :aria-label="t(`lp.datepicker.nextMonth`)"
              :class="ppNs.e('icon-btn')"
              class="arrow-right"
              @click="moveByMonth(true)"
            >
              <lp-icon><arrow-right /></lp-icon>
            </button>
            <button
              type="button"
              :aria-label="t(`lp.datepicker.nextYear`)"
              :class="ppNs.e('icon-btn')"
              class="d-arrow-right"
              @click="moveByYear(true)"
            >
              <lp-icon><d-arrow-right /></lp-icon>
            </button>
          </span>
        </div>
        <div :class="ppNs.e('content')" @keydown="handleKeydownTable">
          <date-table
            v-if="currentView === 'date'"
            ref="currentViewRef"
            :selection-mode="selectionMode"
            :date="innerDate"
            :parsed-value="parsedValue"
            :disabled-date="disabledDate"
            :cell-class-name="cellClassName"
            @pick="handleDatePick"
          />
          <year-table
            v-if="currentView === 'year'"
            ref="currentViewRef"
            :date="innerDate"
            :disabled-date="disabledDate"
            :parsed-value="parsedValue"
            @pick="handleYearPick"
          />
          <month-table
            v-if="currentView === 'month'"
            ref="currentViewRef"
            :date="innerDate"
            :parsed-value="parsedValue"
            :disabled-date="disabledDate"
            @pick="handleMonthPick"
          />
        </div>
      </div>
    </div>
    <div
      v-show="footerVisible && currentView === 'date'"
      :class="ppNs.e('footer')"
    >
      <lp-button
        v-show="selectionMode !== 'dates'"
        text
        size="small"
        :class="ppNs.e('link-btn')"
        @click="changeToNow"
      >
        {{ t('lp.datepicker.now') }}
      </lp-button>
      <lp-button
        plain
        size="small"
        :class="ppNs.e('link-btn')"
        @click="onConfirm"
      >
        {{ t('lp.datepicker.confirm') }}
      </lp-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject, nextTick, ref, toRef, useAttrs, useSlots, watch } from 'vue';
import dayjs from 'dayjs';
import LpButton from '@lemon-peel/components/button';
import { ClickOutside as vClickOutside } from '@lemon-peel/directives';
import { useLocale, useNamespace } from '@lemon-peel/hooks';
import LpInput from '@lemon-peel/components/input';
import { TIME_PICKER_INJECTION_KEY, TimePickPanel, extractDateFormat, extractTimeFormat } from '@lemon-peel/components/timePicker';
import { LpIcon } from '@lemon-peel/components/icon';
import { isArray, isFunction } from '@lemon-peel/utils';
import { EVENT_CODE } from '@lemon-peel/constants';
import { ArrowLeft, ArrowRight, DArrowLeft, DArrowRight } from '@element-plus/icons-vue';
import { TOOLTIP_INJECTION_KEY } from '@lemon-peel/tokens';
import { panelDatePickProps } from '../props/panelDatePick';
import DateTable from './BasicDateTable.vue';
import MonthTable from './BasicMonthTable.vue';
import YearTable from './BasicYearTable.vue';

import type { SetupContext } from 'vue';
import type { ConfigType, Dayjs } from 'dayjs';
import type { PanelDatePickProps } from '../props/panelDatePick';
import type { DateTableEmits, DatesPickerEmits, WeekPickerEmits } from '../props/basicDateTable';
import type { Shortcut } from '../datePicker.type';

type DatePickType = PanelDatePickProps['type'];
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const timeWithinRange = (_: ConfigType, __: any, ___: string) => true;
const props = defineProps(panelDatePickProps);
const contextEmit = defineEmits(['pick', 'set-picker-option', 'panel-change']);
const ppNs = useNamespace('picker-panel');
const dpNs = useNamespace('date-picker');
const attrs = useAttrs();
const slots = useSlots();

const { t, lang } = useLocale();
const pickerBase = inject(TIME_PICKER_INJECTION_KEY)!;
const popper = inject(TOOLTIP_INJECTION_KEY);
const { shortcuts, disabledDate, cellClassName, defaultTime, arrowControl } =
  pickerBase.props;
const defaultValue = toRef(pickerBase.props, 'defaultValue');

const currentViewRef = ref<{ focus: () => void }>();

const innerDate = ref(dayjs().locale(lang.value));

const defaultTimeD = computed(() => {
  return dayjs(defaultTime as Date).locale(lang.value);
});

const month = computed(() => {
  return innerDate.value.month();
});

const year = computed(() => {
  return innerDate.value.year();
});

const selectableRange = ref([]);
const userInputDate = ref<string | null>(null);
const userInputTime = ref<string | null>(null);
// todo update to disableHour
const checkDateWithinRange = (date: ConfigType) => {
  return selectableRange.value.length > 0
    ? timeWithinRange(date, selectableRange.value, props.format || 'HH:mm:ss')
    : true;
};

const timeFormat = computed(() => {
  return extractTimeFormat(props.format);
});

const visibleTime = computed(() => {
  if (userInputTime.value) return userInputTime.value;
  if (!props.parsedValue && !defaultValue.value) return;
  return ((props.parsedValue || innerDate.value) as Dayjs).format(
    timeFormat.value,
  );
});

const showTime = computed(
  () => props.type === 'datetime' || props.type === 'datetimerange',
);

const selectionMode = computed<DatePickType>(() => {
  const { type } = props;
  if (['week', 'month', 'year', 'dates'].includes(type)) return type;
  return 'date' as DatePickType;
});

const formatEmit = (emitDayjs: Dayjs) => {
  if (defaultTime && !visibleTime.value) {
    return defaultTimeD.value
      .year(emitDayjs.year())
      .month(emitDayjs.month())
      .date(emitDayjs.date());
  }
  if (showTime.value) return emitDayjs.millisecond(0);
  return emitDayjs.startOf('day');
};

const emit = (value: Dayjs | Dayjs[], ...args: any[]) => {
  if (!value) {
    contextEmit('pick', value, ...args);
  } else if (isArray(value)) {
    const dates = value.map(formatEmit);
    contextEmit('pick', dates, ...args);
  } else {
    contextEmit('pick', formatEmit(value), ...args);
  }
  userInputDate.value = null;
  userInputTime.value = null;
};

const handleDatePick = (value: DateTableEmits, keepOpen?: boolean) => {
  switch (selectionMode.value) {
    case 'date': {
      value = value as Dayjs;
      let newDate = props.parsedValue
        ? (props.parsedValue as Dayjs)
          .year(value.year())
          .month(value.month())
          .date(value.date())
        : value;
      // change default time while out of selectableRange
      if (!checkDateWithinRange(newDate)) {
        newDate = (selectableRange.value[0][0] as Dayjs)
          .year(value.year())
          .month(value.month())
          .date(value.date());
      }
      innerDate.value = newDate;
      emit(newDate, showTime.value || keepOpen);

      break;
    }
    case 'week': {
      emit((value as WeekPickerEmits).date);

      break;
    }
    case 'dates': {
      emit(value as DatesPickerEmits, true); // set true to keep panel open

      break;
    }
  // No default
  }
};

const currentView = ref('date');

const handlePanelChange = (mode: 'month' | 'year') => {
  contextEmit('panel-change', innerDate.value.toDate(), mode, currentView.value);
};

const moveByMonth = (forward: boolean) => {
  const action = forward ? 'add' : 'subtract';
  innerDate.value = innerDate.value[action](1, 'month');
  handlePanelChange('month');
};

const moveByYear = (forward: boolean) => {
  const currentDate = innerDate.value;
  const action = forward ? 'add' : 'subtract';

  innerDate.value =
    currentView.value === 'year'
      ? currentDate[action](10, 'year')
      : currentDate[action](1, 'year');

  handlePanelChange('year');
};

const yearLabel = computed(() => {
  const yearTranslation = t('lp.datepicker.year');
  if (currentView.value === 'year') {
    const startYear = Math.floor(year.value / 10) * 10;
    if (yearTranslation) {
      return `${startYear} ${yearTranslation} - ${
        startYear + 9
      } ${yearTranslation}`;
    }
    return `${startYear} - ${startYear + 9}`;
  }
  return `${year.value} ${yearTranslation}`;
});

const handleShortcutClick = (shortcut: Shortcut) => {
  const shortcutValue = isFunction(shortcut.value)
    ? shortcut.value()
    : shortcut.value;

  if (shortcutValue && !Array.isArray(shortcutValue)) {
    return emit(dayjs(shortcutValue).locale(lang.value));
  }

  shortcut.onClick?.({
    attrs,
    slots,
    emit: contextEmit as SetupContext['emit'],
  });
};

const keyboardMode = computed<string>(() => {
  return selectionMode.value === 'date'
    ? currentView.value
    : selectionMode.value;
});

const hasShortcuts = computed(() => !!shortcuts.length);

const handleKeyControl = (code: string) => {
  type KeyControlMappingCallableOffset = (date: Date, step?: number) => number;
  type KeyControl = {
    [key: string]:
    | number
    | KeyControlMappingCallableOffset
    | ((date: Date, step: number) => any);
    offset: (date: Date, step: number) => any;
  };
  interface KeyControlMapping {
    [key: string]: KeyControl;
  }

  const { up, down, left, right, home, end, pageUp, pageDown } = EVENT_CODE;
  const mapping: KeyControlMapping = {
    year: {
      [up]: -4,
      [down]: 4,
      [left]: -1,
      [right]: 1,
      offset: (date: Date, step: number) =>
        date.setFullYear(date.getFullYear() + step),
    },
    month: {
      [up]: -4,
      [down]: 4,
      [left]: -1,
      [right]: 1,
      offset: (date: Date, step: number) =>
        date.setMonth(date.getMonth() + step),
    },
    week: {
      [up]: -1,
      [down]: 1,
      [left]: -1,
      [right]: 1,
      offset: (date: Date, step: number) =>
        date.setDate(date.getDate() + step * 7),
    },
    date: {
      [up]: -7,
      [down]: 7,
      [left]: -1,
      [right]: 1,
      [home]: (date: Date) => -date.getDay(),
      [end]: (date: Date) => -date.getDay() + 6,
      [pageUp]: (date: Date) =>
        -new Date(date.getFullYear(), date.getMonth(), 0).getDate(),
      [pageDown]: (date: Date) =>
        new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
      offset: (date: Date, step: number) => date.setDate(date.getDate() + step),
    },
  };

  const newDate = innerDate.value.toDate();
  while (Math.abs(innerDate.value.diff(newDate, 'year', true)) < 1) {
    const map = mapping[keyboardMode.value];
    if (!map) return;
    map.offset(
      newDate,
      isFunction(map[code])
        ? (map[code] as unknown as KeyControlMappingCallableOffset)(newDate)
        : (map[code] as number) ?? 0,
    );
    if (disabledDate && disabledDate(newDate)) {
      break;
    }
    const result = dayjs(newDate).locale(lang.value);
    innerDate.value = result;
    contextEmit('pick', result, true);
    break;
  }
};

const handleFocusPicker = async () => {
  if (['week', 'month', 'year', 'date'].includes(selectionMode.value)) {
    currentViewRef.value?.focus();
    if (selectionMode.value === 'week') {
      handleKeyControl(EVENT_CODE.down);
    }
  }
};

const handleMonthPick = async (month: number) => {
  innerDate.value = innerDate.value.startOf('month').month(month);
  if (selectionMode.value === 'month') {
    emit(innerDate.value, false);
  } else {
    currentView.value = 'date';
    if (['month', 'year', 'date', 'week'].includes(selectionMode.value)) {
      emit(innerDate.value, true);
      await nextTick();
      handleFocusPicker();
    }
  }
  handlePanelChange('month');
};

const handleYearPick = async (year: number) => {
  if (selectionMode.value === 'year') {
    innerDate.value = innerDate.value.startOf('year').year(year);
    emit(innerDate.value, false);
  } else {
    innerDate.value = innerDate.value.year(year);
    currentView.value = 'month';
    if (['month', 'year', 'date', 'week'].includes(selectionMode.value)) {
      emit(innerDate.value, true);
      await nextTick();
      handleFocusPicker();
    }
  }
  handlePanelChange('year');
};

const showPicker = async (view: 'month' | 'year') => {
  currentView.value = view;
  await nextTick();
  handleFocusPicker();
};

const footerVisible = computed(() => {
  return showTime.value || selectionMode.value === 'dates';
});

const getDefaultValue = () => {
  const parseDate = dayjs(defaultValue.value as Date).locale(lang.value);
  if (!defaultValue.value) {
    const defaultTimeDValue = defaultTimeD.value;
    return dayjs()
      .hour(defaultTimeDValue.hour())
      .minute(defaultTimeDValue.minute())
      .second(defaultTimeDValue.second())
      .locale(lang.value);
  }
  return parseDate;
};

const onConfirm = () => {
  if (selectionMode.value === 'dates') {
    emit(props.parsedValue as Dayjs[]);
  } else {
    // deal with the scenario where: user opens the date time picker, then confirm without doing anything
    let result = props.parsedValue as Dayjs;
    if (!result) {
      const defaultTimeD = dayjs(defaultTime as Date).locale(lang.value);
      const defaultValueD = getDefaultValue();
      result = defaultTimeD
        .year(defaultValueD.year())
        .month(defaultValueD.month())
        .date(defaultValueD.date());
    }
    innerDate.value = result;
    emit(result);
  }
};

const changeToNow = () => {
  // NOTE: not a permanent solution
  //       consider disable "now" button in the future
  const now = dayjs().locale(lang.value);
  const nowDate = now.toDate();
  if (
    (!disabledDate || !disabledDate(nowDate)) &&
    checkDateWithinRange(nowDate)
  ) {
    innerDate.value = dayjs().locale(lang.value);
    emit(innerDate.value);
  }
};

const dateFormat = computed(() => {
  return extractDateFormat(props.format);
});

const visibleDate = computed(() => {
  if (userInputDate.value) return userInputDate.value;
  if (!props.parsedValue && !defaultValue.value) return;
  return ((props.parsedValue || innerDate.value) as Dayjs).format(
    dateFormat.value,
  );
});

const timePickerVisible = ref(false);
const onTimePickerInputFocus = () => {
  timePickerVisible.value = true;
};
const handleTimePickClose = () => {
  timePickerVisible.value = false;
};

const getUnits = (date: Dayjs) => {
  return {
    hour: date.hour(),
    minute: date.minute(),
    second: date.second(),
    year: date.year(),
    month: date.month(),
    date: date.date(),
  };
};

const handleTimePick = (value: Dayjs, visible: boolean, first: boolean) => {
  const { hour, minute, second } = getUnits(value);
  const newDate = props.parsedValue
    ? (props.parsedValue as Dayjs).hour(hour).minute(minute).second(second)
    : value;
  innerDate.value = newDate;
  emit(innerDate.value, true);
  if (!first) {
    timePickerVisible.value = visible;
  }
};

const handleVisibleTimeChange = (value: string) => {
  const newDate = dayjs(value, timeFormat.value).locale(lang.value);
  if (newDate.isValid() && checkDateWithinRange(newDate)) {
    const { year, month, date } = getUnits(innerDate.value);
    innerDate.value = newDate.year(year).month(month).date(date);
    userInputTime.value = null;
    timePickerVisible.value = false;
    emit(innerDate.value, true);
  }
};

const handleVisibleDateChange = (value: string) => {
  const newDate = dayjs(value, dateFormat.value).locale(lang.value);
  if (newDate.isValid()) {
    if (disabledDate && disabledDate(newDate.toDate())) {
      return;
    }
    const { hour, minute, second } = getUnits(innerDate.value);
    innerDate.value = newDate.hour(hour).minute(minute).second(second);
    userInputDate.value = null;
    emit(innerDate.value, true);
  }
};

const isValidValue = (date: unknown) => {
  return (
    dayjs.isDayjs(date) &&
    date.isValid() &&
    (disabledDate ? !disabledDate(date.toDate()) : true)
  );
};

const formatToString = (value: Dayjs | Dayjs[]) => {
  if (selectionMode.value === 'dates') {
    return (value as Dayjs[]).map(_ => _.format(props.format));
  }
  return (value as Dayjs).format(props.format);
};

const parseUserInput = (value: Dayjs) => {
  return dayjs(value, props.format).locale(lang.value);
};

const handleKeydownTable = (event: KeyboardEvent) => {
  const { code } = event;
  const validCode = [
    EVENT_CODE.up,
    EVENT_CODE.down,
    EVENT_CODE.left,
    EVENT_CODE.right,
    EVENT_CODE.home,
    EVENT_CODE.end,
    EVENT_CODE.pageUp,
    EVENT_CODE.pageDown,
  ];
  if (validCode.includes(code)) {
    handleKeyControl(code);
    event.stopPropagation();
    event.preventDefault();
  }
  if (
    [EVENT_CODE.enter, EVENT_CODE.space].includes(code) &&
    userInputDate.value === null &&
    userInputTime.value === null
  ) {
    event.preventDefault();
    emit(innerDate.value, false);
  }
};

watch(
  () => selectionMode.value,
  val => {
    if (['month', 'year'].includes(val)) {
      currentView.value = val;
      return;
    }
    currentView.value = 'date';
  },
  { immediate: true },
);

watch(
  () => currentView.value,
  () => {
    popper?.updatePopper();
  },
);

watch(
  () => defaultValue.value,
  val => {
    if (val) {
      innerDate.value = getDefaultValue();
    }
  },
  { immediate: true },
);

watch(
  () => props.parsedValue,
  val => {
    if (val) {
      if (selectionMode.value === 'dates') return;
      if (Array.isArray(val)) return;
      innerDate.value = val;
    } else {
      innerDate.value = getDefaultValue();
    }
  },
  { immediate: true },
);

contextEmit('set-picker-option', ['isValidValue', isValidValue]);
contextEmit('set-picker-option', ['formatToString', formatToString]);
contextEmit('set-picker-option', ['parseUserInput', parseUserInput]);
contextEmit('set-picker-option', ['handleFocusPicker', handleFocusPicker]);
</script>
