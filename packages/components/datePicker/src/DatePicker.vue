<template>
  <CommonPicker
    ref="commonPicker"
    v-bind="{...$attrs, ...unrefs(props)}"
    :format="format"
    @change="$emit('change', $event)"
    @focus="$emit('focus', $event)"
    @blur="$emit('blur', $event)"
    @keydown="$emit('keydown', $event)"
    @panel-change="(d, m) => $emit('panel-change', d, m)"
    @calendar-change="$emit('calendar-change', $event)"
    @update:value="onModelValueUpdated"
  >
    <template #range-separator>
      <slot name="range-separator" />
    </template>
    <template #default="scopedProps">
      <Component :is="realPanel" v-bind="(scopedProps as any)" />
    </template>
  </CommonPicker>
</template>

<script lang="ts" setup>
import { computed, provide, reactive, ref, toRef } from 'vue';
import { unrefs } from '@lemon-peel/utils';
import dayjs from 'dayjs';

import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import advancedFormat from 'dayjs/plugin/advancedFormat.js';
import localeData from 'dayjs/plugin/localeData.js';
import weekOfYear from 'dayjs/plugin/weekOfYear.js';
import weekYear from 'dayjs/plugin/weekYear.js';
import dayOfYear from 'dayjs/plugin/dayOfYear.js';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter.js';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore.js';

import { useNamespace } from '@lemon-peel/hooks';
import { ROOT_PICKER_INJECTION_KEY } from '@lemon-peel/tokens';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { CommonPicker, DEFAULT_FORMATS_DATE, DEFAULT_FORMATS_DATEPICKER, timePickerDefaultProps } from '@lemon-peel/components/timePicker';

import { datePickerProps } from './props/datePicker';
import { getPanel } from './panelUtils';
import { UPDATE_MODEL_EVENT } from '@lemon-peel/constants';

dayjs.extend(localeData);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
dayjs.extend(dayOfYear);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

defineOptions({
  name: 'LpDatePicker',
  install: null,
});

const props = defineProps({
  ...timePickerDefaultProps,
  ...datePickerProps,
});

const emit = defineEmits([
  UPDATE_MODEL_EVENT,
  'panelChange',
  'panel-change',
  'calendarChange',
  'calendar-change',
  'focus',
  'change',
  'blur',
  'keydown',
]);

const slots = defineSlots();
const ns = useNamespace('picker-panel');

provide('LpPopperOptions', reactive(toRef(props, 'popperOptions')));
provide(ROOT_PICKER_INJECTION_KEY, {
  slots: slots as any,
  pickerNs: ns,
});

const commonPicker = ref<InstanceType<typeof CommonPicker>>();

const onModelValueUpdated = (value: any) => {
  emit(UPDATE_MODEL_EVENT, value);
};

// since props always have all defined keys on it, {format, ...props} will always overwrite format
// pick props.format or provide default value here before spreading
const format = computed(() => {
  return props.format ?? (DEFAULT_FORMATS_DATEPICKER[props.type] || DEFAULT_FORMATS_DATE);
});

const realPanel = computed(() => getPanel(props.type));

const focus = (focusStartInput = true) => {
  commonPicker.value?.focus(focusStartInput);
};

const handleOpen = () => {
  commonPicker.value?.handleOpen();
};

const handleClose = () => {
  commonPicker.value?.handleClose();
};

defineExpose({
  focus,
  handleOpen,
  handleClose,
});
</script>
