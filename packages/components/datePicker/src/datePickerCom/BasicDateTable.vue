<template>
  <table
    role="grid"
    :aria-label="t('el.datepicker.dateTablePrompt')"
    cellspacing="0"
    cellpadding="0"
    :class="[ns.b(), { 'is-week-mode': selectionMode === 'week' }]"
    @click="handlePickDate"
    @mousemove="handleMouseMove"
    @mousedown="handleMouseDown"
    @mouseup="handleMouseUp"
  >
    <tbody ref="tbodyRef">
      <tr>
        <th v-if="showWeekNumber" scope="col">{{ t('lp.datepicker.week') }}</th>
        <th
          v-for="(week, key) in WEEKS"
          :key="key"
          scope="col"
          :aria-label="t('el.datepicker.weeksFull.' + week)"
        >
          {{ t('lp.datepicker.weeks.' + week) }}
        </th>
      </tr>
      <tr
        v-for="(row, rowKey) in rows"
        :key="rowKey"
        :class="[ns.e('row'), { current: isWeekActive(row[1]) }]"
      >
        <td
          v-for="(cell, columnKey) in row"
          :key="`${rowKey}.${columnKey}`"
          :ref="(el) => isSelectedCell(cell) && (currentCellRef = el as HTMLElement)"
          :class="getCellClasses(cell)"
          :aria-current="cell.isCurrent ? 'date' : undefined"
          :aria-selected="cell.isCurrent"
          :tabindex="isSelectedCell(cell) ? 0 : -1"
          @focus="handleFocus"
        >
          <lp-date-picker-cell :cell="cell" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref, unref, watch } from 'vue';
import dayjs from 'dayjs';
import { flatten } from 'lodash-es';
import { useLocale, useNamespace } from '@lemon-peel/hooks';
import { castArray } from '@lemon-peel/utils';
import { basicDateTableProps } from '../props/basicDateTable';
import { buildPickerTable } from '../utils';
import LpDatePickerCell from './BasicCellRender';

import type { Dayjs } from 'dayjs';
import type { DateCell } from '../datePicker.type';

const props = defineProps(basicDateTableProps);
const emit = defineEmits(['changerange', 'pick', 'select']);

const ns = useNamespace('date-table');

const { t, lang } = useLocale();

const tbodyRef = ref<HTMLElement>();
const currentCellRef = ref<HTMLElement>();
// data
const lastRow = ref<number>();
const lastColumn = ref<number>();
const tableRows = ref<DateCell[][]>([[], [], [], [], [], []]);

let focusWithClick = false;

// todo better way to get Day.js locale object
const firstDayOfWeek = (props.date as any).$locale().weekStart || 7;
const WEEKS_CONSTANT = props.date
  .locale('en')
  .localeData()
  .weekdaysShort()
  .map(_ => _.toLowerCase());

const offsetDay = computed(() => {
  // Sunday 7(0), cal the left and right offset days, 3217654, such as Monday is -1, the is to adjust the position of the first two rows of dates
  return firstDayOfWeek > 3 ? 7 - firstDayOfWeek : -firstDayOfWeek;
});

const startDate = computed(() => {
  const startDayOfMonth = props.date.startOf('month');
  return startDayOfMonth.subtract(startDayOfMonth.day() || 7, 'day');
});

const WEEKS = computed(() => {
  return WEEKS_CONSTANT.concat(WEEKS_CONSTANT).slice(
    firstDayOfWeek,
    firstDayOfWeek + 7,
  );
});

const days = computed(() => {
  const startOfMonth = props.date.startOf('month');
  const startOfMonthDay = startOfMonth.day() || 7; // day of first day
  const dateCountOfMonth = startOfMonth.daysInMonth();

  const dateCountOfLastMonth = startOfMonth.subtract(1, 'month').daysInMonth();

  return {
    startOfMonthDay,
    dateCountOfMonth,
    dateCountOfLastMonth,
  };
});

// Return value indicates should the counter be incremented
const setDateText = (
  cell: DateCell,
  { count, rowIndex, columnIndex }: { count: number, rowIndex: number, columnIndex: number },
): boolean => {
  const { startOfMonthDay, dateCountOfMonth, dateCountOfLastMonth } = unref(days);
  const offset = unref(offsetDay);
  if (rowIndex >= 0 && rowIndex <= 1) {
    const numberOfDaysFromPreviousMonth =
      startOfMonthDay + offset < 0
        ? 7 + startOfMonthDay + offset
        : startOfMonthDay + offset;

    if (columnIndex + rowIndex * 7 >= numberOfDaysFromPreviousMonth) {
      cell.text = count;
      return true;
    } else {
      cell.text =
        dateCountOfLastMonth -
        (numberOfDaysFromPreviousMonth - (columnIndex % 7)) +
        1 +
        rowIndex * 7;
      cell.type = 'prev-month';
    }
  } else {
    if (count <= dateCountOfMonth) {
      cell.text = count;
    } else {
      cell.text = count - dateCountOfMonth;
      cell.type = 'next-month';
    }
    return true;
  }
  return false;
};

const selectedDate = computed(() => {
  return props.selectionMode === 'dates'
    ? (castArray(props.parsedValue) as Dayjs[])
    : ([] as Dayjs[]);
});

const isNormalDay = (type = '') => {
  return ['normal', 'today'].includes(type);
};

const cellMatchesDate = (cell: DateCell, date: Dayjs) => {
  if (!date) return false;
  return dayjs(date)
    .locale(lang.value)
    .isSame(props.date.date(Number(cell.text)), 'day');
};

const isCurrent = (cell: DateCell): boolean => {
  return (
    props.selectionMode === 'date' &&
    isNormalDay(cell.type) &&
    cellMatchesDate(cell, props.parsedValue as Dayjs)
  );
};

const setCellMetadata = (
  cell: DateCell,
  { columnIndex, rowIndex }: { columnIndex: number, rowIndex: number },
  count: number,
) => {
  const { disabledDate, cellClassName } = props;
  const shouldIncrement = setDateText(cell, { count, rowIndex, columnIndex });

  const cellDate = cell.dayjs!.toDate();
  cell.selected = selectedDate.value.find(
    d => d.valueOf() === cell.dayjs!.valueOf(),
  );
  cell.isSelected = !!cell.selected;
  cell.isCurrent = isCurrent(cell);
  cell.disabled = disabledDate?.(cellDate);
  cell.customClass = cellClassName?.(cellDate);
  return shouldIncrement;
};

const isWeekActive = (cell: DateCell) => {
  if (props.selectionMode !== 'week') return false;
  let newDate = props.date.startOf('day');

  if (cell.type === 'prev-month') {
    newDate = newDate.subtract(1, 'month');
  }

  if (cell.type === 'next-month') {
    newDate = newDate.add(1, 'month');
  }

  newDate = newDate.date(Number.parseInt(cell.text as any, 10));

  if (props.parsedValue && !Array.isArray(props.parsedValue)) {
    const dayOffset = ((props.parsedValue.day() - firstDayOfWeek + 7) % 7) - 1;
    const weekDate = props.parsedValue.subtract(dayOffset, 'day');
    return weekDate.isSame(newDate, 'day');
  }
  return false;
};

const setRowMetadata = (row: DateCell[]) => {
  if (props.selectionMode === 'week') {
    const [start, end] = props.showWeekNumber ? [1, 7] : [0, 6];
    const isActive = isWeekActive(row[start + 1]);
    row[start].inRange = isActive;
    row[start].start = isActive;
    row[end].inRange = isActive;
    row[end].end = isActive;
  }
};

const rows = computed(() => {
  const { minDate, maxDate, rangeState, showWeekNumber } = props;

  const offset = offsetDay.value;
  const val = tableRows.value;
  const dateUnit = 'day';
  let count = 1;

  if (showWeekNumber) {
    for (let rowIndex = 0; rowIndex < 6; rowIndex++) {
      if (!val[rowIndex][0]) {
        val[rowIndex][0] = {
          type: 'week',
          text: startDate.value.add(rowIndex * 7 + 1, dateUnit).week(),
        };
      }
    }
  }

  buildPickerTable({ row: 6, column: 7 }, val, {
    startDate: minDate,
    columnIndexOffset: showWeekNumber ? 1 : 0,
    nextEndDate:
      rangeState.endDate ||
      maxDate ||
      (rangeState.selecting && minDate) ||
      null,
    now: dayjs().locale(unref(lang)).startOf(dateUnit),
    unit: dateUnit,
    relativeDateGetter: (idx: number) =>
      startDate.value.add(idx - offset, dateUnit),
    setCellMetadata: (...args) => {
      if (setCellMetadata(...args, count)) {
        count += 1;
      }
    },

    setRowMetadata,
  });

  return val;
});

const hasCurrent = computed<boolean>(() => {
  return flatten(rows.value).some(row => {
    return row.isCurrent;
  });
});

watch(
  () => props.date,
  async () => {
    if (tbodyRef.value?.contains(document.activeElement)) {
      await nextTick();
      currentCellRef.value?.focus();
    }
  },
);

const focus = async () => {
  currentCellRef.value?.focus();
};

const getCellClasses = (cell: DateCell) => {
  const classes: string[] = [];
  if (isNormalDay(cell.type) && !cell.disabled) {
    classes.push('available');
    if (cell.type === 'today') {
      classes.push('today');
    }
  } else {
    classes.push(cell.type!);
  }

  if (isCurrent(cell)) {
    classes.push('current');
  }

  if (
    cell.inRange &&
    (isNormalDay(cell.type) || props.selectionMode === 'week')
  ) {
    classes.push('in-range');

    if (cell.start) {
      classes.push('start-date');
    }

    if (cell.end) {
      classes.push('end-date');
    }
  }

  if (cell.disabled) {
    classes.push('disabled');
  }

  if (cell.selected) {
    classes.push('selected');
  }

  if (cell.customClass) {
    classes.push(cell.customClass);
  }

  return classes.join(' ');
};

const getDateOfCell = (row: number, column: number) => {
  const offsetFromStart =
    row * 7 + (column - (props.showWeekNumber ? 1 : 0)) - offsetDay.value;
  return startDate.value.add(offsetFromStart, 'day');
};

const handleMouseMove = (event: MouseEvent) => {
  if (!props.rangeState.selecting) return;

  let target = event.target as HTMLElement;
  if (target.tagName === 'SPAN') {
    target = target.parentNode?.parentNode as HTMLElement;
  }
  if (target.tagName === 'DIV') {
    target = target.parentNode as HTMLElement;
  }
  if (target.tagName !== 'TD') return;

  const row = (target.parentNode as HTMLTableRowElement).rowIndex - 1;
  const column = (target as HTMLTableCellElement).cellIndex;

  // can not select disabled date
  if (rows.value[row][column].disabled) return;

  // only update rangeState when mouse moves to a new cell
  // this avoids frequent Date object creation and improves performance
  if (row !== lastRow.value || column !== lastColumn.value) {
    lastRow.value = row;
    lastColumn.value = column;
    emit('changerange', {
      selecting: true,
      endDate: getDateOfCell(row, column),
    });
  }
};

const isSelectedCell = (cell: DateCell) => {
  return (
    (!hasCurrent.value && cell?.text === 1 && cell.type === 'normal') ||
    cell.isCurrent
  );
};


const handlePickDate = (
  event: FocusEvent | MouseEvent,
  isKeyboardMovement = false,
) => {
  const target = (event.target as HTMLElement).closest('td');

  if (!target) return;

  const row = (target.parentNode as HTMLTableRowElement).rowIndex - 1;
  const column = (target as HTMLTableCellElement).cellIndex;
  const cell = rows.value[row][column];

  if (cell.disabled || cell.type === 'week') return;

  const newDate = getDateOfCell(row, column);

  switch (props.selectionMode) {
    case 'range': {
      if (!props.rangeState.selecting || !props.minDate) {
        emit('pick', { minDate: newDate, maxDate: null });
        emit('select', true);
      } else {
        if (newDate >= props.minDate) {
          emit('pick', { minDate: props.minDate, maxDate: newDate });
        } else {
          emit('pick', { minDate: newDate, maxDate: props.minDate });
        }
        emit('select', false);
      }

      break;
    }
    case 'date': {
      emit('pick', newDate, isKeyboardMovement);

      break;
    }
    case 'week': {
      const weekNumber = newDate.week();
      const value = `${newDate.year()}w${weekNumber}`;
      emit('pick', {
        year: newDate.year(),
        week: weekNumber,
        value,
        date: newDate.startOf('week'),
      });

      break;
    }
    case 'dates': {
      const newValue = cell.selected
        ? castArray(props.parsedValue).filter(
          d => d?.valueOf() !== newDate.valueOf(),
        )
        : castArray(props.parsedValue).concat([newDate]);
      emit('pick', newValue);

      break;
    }
  // No default
  }
};

const handleFocus = (event: FocusEvent) => {
  if (focusWithClick || hasCurrent.value || props.selectionMode !== 'date')
    return;
  handlePickDate(event, true);
};

const handleMouseDown = (event: MouseEvent) => {
  const target = (event.target as HTMLElement).closest('td');
  if (!target) return;
  focusWithClick = true;
};

const handleMouseUp = (event: MouseEvent) => {
  const target = (event.target as HTMLElement).closest('td');
  if (!target) return;
  focusWithClick = false;
};

defineExpose({
  /**
   * @description focus on current cell
   */
  focus,
});
</script>
