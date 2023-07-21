<template>
  <lp-tooltip
    ref="refPopper"
    :visible="pickerVisible"
    effect="light"
    pure
    trigger="click"
    v-bind="$attrs"
    role="dialog"
    teleported
    :transition="`${nsDate.namespace.value}-zoom-in-top`"
    :popper-class="[`${nsDate.namespace.value}-picker__popper`, popperClass]"
    :popper-options="lpPopperOptions"
    :fallback-placements="['bottom', 'top', 'right', 'left']"
    :gpu-acceleration="false"
    :stop-popper-mouse-event="false"
    :hide-after="0"
    persistent
    @before-show="onBeforeShow"
    @show="onShow"
    @hide="onHide"
  >
    <template #default>
      <lp-input
        v-if="!isRangeInput"
        :id="(id as string | undefined)"
        ref="inputRef"
        container-role="combobox"
        :value="(displayValue as string)"
        :name="name"
        :size="pickerSize"
        :disabled="pickerDisabled"
        :placeholder="placeholder"
        :class="[nsDate.b('editor'), nsDate.bm('editor', type), $attrs.class]"
        :style="$attrs.style"
        :readonly="!editable || readonly || isDatesPicker || type === 'week'"
        :label="label"
        :tabindex="tabindex"
        :validate-event="false"
        @input="onUserInput"
        @focus="handleFocusInput"
        @blur="handleBlurInput"
        @keydown="
          //
          handleKeydownInput as any
        "
        @change="handleChange"
        @mousedown="onMouseDownInput"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
        @touchstart="onTouchStartInput"
        @click.stop
      >
        <template #prefix>
          <lp-icon
            v-if="triggerIcon"
            :class="nsInput.e('icon')"
            @mousedown.prevent="onMouseDownInput"
            @touchstart="onTouchStartInput"
          >
            <component :is="triggerIcon" />
          </lp-icon>
        </template>
        <template #suffix>
          <lp-icon
            v-if="showClose && clearIcon"
            :class="`${nsInput.e('icon')} clear-icon`"
            @click.stop="onClearIconClick"
          >
            <component :is="clearIcon" />
          </lp-icon>
        </template>
      </lp-input>
      <div
        v-else
        ref="inputRef"
        :class="[
          nsDate.b('editor'),
          nsDate.bm('editor', type),
          nsInput.e('wrapper'),
          nsDate.is('disabled', pickerDisabled),
          nsDate.is('active', pickerVisible),
          nsRange.b('editor'),
          pickerSize ? nsRange.bm('editor', pickerSize) : '',
          $attrs.class,
        ]"
        :style="($attrs.style as any)"
        @click="handleFocusInput"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
        @touchstart="onTouchStartInput"
        @keydown="handleKeydownInput"
      >
        <lp-icon
          v-if="triggerIcon"
          :class="[nsInput.e('icon'), nsRange.e('icon')]"
          @mousedown.prevent="onMouseDownInput"
          @touchstart="onTouchStartInput"
        >
          <component :is="triggerIcon" />
        </lp-icon>
        <input
          :id="id && id[0]"
          autocomplete="off"
          :name="name && name[0]"
          :placeholder="startPlaceholder"
          :value="displayValue && displayValue[0]"
          :disabled="pickerDisabled"
          :readonly="!editable || readonly"
          :class="nsRange.b('input')"
          @mousedown="onMouseDownInput"
          @input="handleStartInput"
          @change="handleStartChange"
          @focus="handleFocusInput"
          @blur="handleBlurInput"
        >
        <slot name="range-separator">
          <span :class="nsRange.b('separator')">{{ rangeSeparator }}</span>
        </slot>
        <input
          :id="id && id[1]"
          autocomplete="off"
          :name="name && name[1]"
          :placeholder="endPlaceholder"
          :value="displayValue && displayValue[1]"
          :disabled="pickerDisabled"
          :readonly="!editable || readonly"
          :class="nsRange.b('input')"
          @mousedown="onMouseDownInput"
          @focus="handleFocusInput"
          @blur="handleBlurInput"
          @input="handleEndInput"
          @change="handleEndChange"
        >
        <lp-icon
          v-if="clearIcon"
          :class="[
            nsInput.e('icon'),
            nsRange.e('close-icon'),
            {
              [nsRange.e('close-icon--hidden')]: !showClose,
            },
          ]"
          @click="onClearIconClick"
        >
          <component :is="clearIcon" />
        </lp-icon>
      </div>
    </template>
    <template #content>
      <slot
        :visible="pickerVisible"
        :actual-visible="pickerActualVisible"
        :parsed-value="parsedValue"
        :format="format"
        :unlink-panels="unlinkPanels"
        :type="type"
        :default-value="defaultValue"
        @pick="onPick"
        @select-range="setSelectionRange"
        @set-picker-option="onSetPickerOption"
        @calendar-change="onCalendarChange"
        @panel-change="onPanelChange"
        @keydown="onKeydownPopperContent"
        @mousedown.stop
      />
    </template>
  </lp-tooltip>
</template>

<script lang="ts" setup>
import { computed, inject, nextTick, provide, ref, unref, useAttrs, watch } from 'vue';
import { isEqual } from 'lodash-es';
import { onClickOutside } from '@vueuse/core';
import { useFormItem, useLocale, useNamespace, useSize } from '@lemon-peel/hooks';
import LpInput from '@lemon-peel/components/input';
import LpIcon from '@lemon-peel/components/icon';
import LpTooltip from '@lemon-peel/components/tooltip';
import { debugWarn, isArray } from '@lemon-peel/utils';
import { EVENT_CODE, UPDATE_MODEL_EVENT } from '@lemon-peel/constants';
import { Calendar, Clock } from '@element-plus/icons-vue';

import { formatter, parseDate, valueEquals } from '../utils';
import { timePickerDefaultProps, TIME_PICKER_INJECTION_KEY } from './props';

import type { ComponentPublicInstance } from 'vue';
import type { Dayjs } from 'dayjs';
import type { Options } from '@popperjs/core';
import type { TooltipInstance } from '@lemon-peel/components/tooltip';
import type { DateModelType, DateOrDates, DayOrDays, PickerOptions, SingleOrRange, TimePickerDefaultProps, UserInput } from './props';

// Date object and string
defineOptions({
  name: 'Picker',
});

const props = defineProps(timePickerDefaultProps);
const attrs = useAttrs();
const emit = defineEmits([
  UPDATE_MODEL_EVENT,
  'change',
  'focus',
  'blur',
  'calendar-change',
  'panel-change',
  'visible-change',
  'keydown',
]);

const { lang } = useLocale();

const nsDate = useNamespace('date');
const nsInput = useNamespace('input');
const nsRange = useNamespace('range');

const { form, formItem } = useFormItem();
const lpPopperOptions = inject('LpPopperOptions', {} as Options);

const refPopper = ref<TooltipInstance>();
const inputRef = ref<HTMLElement | ComponentPublicInstance>();
const pickerVisible = ref(false);
const pickerActualVisible = ref(false);
const valueOnOpen = ref<TimePickerDefaultProps['value'] | null>(null);

let hasJustTabExitedInput = false;
let ignoreFocusEvent = false;

const isRangeInput = computed(() => {
  return props.type.includes('range');
});

const userInput = ref<UserInput>(isRangeInput.value ? [null, null] : null);

const emitChange = (
  val: TimePickerDefaultProps['value'] | null,
  isClear?: boolean,
) => {
  // determine user real change only
  if (isClear || !valueEquals(val, valueOnOpen.value)) {
    emit('change', val);
    props.validateEvent &&
      formItem?.validate('change').catch(error => debugWarn(error));
  }
};

watch(pickerVisible, val => {
  if (val) {
    nextTick(() => {
      if (val) {
        valueOnOpen.value = props.value;
      }
    });
  } else {
    userInput.value = isRangeInput.value ? [null, null] : null;

    nextTick(() => {
      emitChange(props.value);
    });
  }
});

const emitInput = (input: SingleOrRange<DateModelType | Dayjs> | null) => {
  if (!valueEquals(props.value, input)) {
    let formatted;
    if (isArray(input)) {
      formatted = input.map(item =>
        formatter(item, props.valueFormat, lang.value),
      );
    } else if (input) {
      formatted = formatter(input, props.valueFormat, lang.value);
    }
    emit(UPDATE_MODEL_EVENT, input ? formatted : input, lang.value);
  }
};

const emitKeydown = (e: KeyboardEvent) => {
  emit('keydown', e);
};

const refInput = computed<HTMLInputElement[]>(() => {
  if (inputRef.value) {
    const el = isRangeInput.value
      ? inputRef.value
      : (inputRef.value as any as ComponentPublicInstance).$el;
    return [...el.querySelectorAll('input')];
  }
  return [];
});

const setSelectionRange = (start: number, end: number, pos?: 'min' | 'max') => {
  const inputVal = refInput.value;
  if (inputVal.length === 0) return;
  if (!pos || pos === 'min') {
    inputVal[0].setSelectionRange(start, end);
    inputVal[0].focus();
  } else if (pos === 'max') {
    inputVal[1].setSelectionRange(start, end);
    inputVal[1].focus();
  }
};

const focus = (focusStartInput = true, isIgnoreFocusEvent = false) => {
  ignoreFocusEvent = isIgnoreFocusEvent;
  const [leftInput, rightInput] = unref(refInput);
  let input = leftInput;
  if (!focusStartInput && isRangeInput.value) {
    input = rightInput;
  }
  if (input) {
    input.focus();
  }
};

const focusOnInputBox = () => {
  focus(true, true);
  nextTick(() => {
    ignoreFocusEvent = false;
  });
};

const onPick = (date: any = '', visible = false) => {
  if (!visible) {
    ignoreFocusEvent = true;
  }
  pickerVisible.value = visible;
  let result;
  if (isArray(date)) {
    result = date.map(_ => _.toDate());
    userInput.value = [null, null];
  } else {
    // clear btn emit null
    result = date ? date.toDate() : date;
    userInput.value = null;
  }

  emitInput(result);
};

const onBeforeShow = () => {
  pickerActualVisible.value = true;
};

const onShow = () => {
  emit('visible-change', true);
};

const onKeydownPopperContent = (event: KeyboardEvent) => {
  if ((event as KeyboardEvent)?.key === EVENT_CODE.esc) {
    focus(true, true);
  }
};

const onHide = () => {
  pickerActualVisible.value = false;
  pickerVisible.value = false;
  ignoreFocusEvent = false;
  emit('visible-change', false);
};

const handleOpen = () => {
  pickerVisible.value = true;
};

const handleClose = () => {
  pickerVisible.value = false;
};


const pickerDisabled = computed(() => {
  return props.disabled || form?.disabled;
});

const handleFocusInput = (e?: FocusEvent) => {
  if (
    props.readonly ||
    pickerDisabled.value ||
    pickerVisible.value ||
    ignoreFocusEvent
  ) {
    return;
  }
  pickerVisible.value = true;
  emit('focus', e);
};

let currentHandleBlurDeferCallback:
| (() => Promise<void> | undefined)
| undefined;

const pickerOptions = ref<Partial<PickerOptions>>({});

const parseUserInputToDayjs = (value: UserInput) => {
  if (!value) return null;
  return pickerOptions.value.parseUserInput?.(value);
};

const formatDayjsToString = (value: DayOrDays) => {
  if (!value) return null;
  return pickerOptions.value.formatToString?.(value);
};

const valueIsEmpty = computed(() => {
  const { value } = props;
  return (
    !value || (isArray(value) && value.filter(Boolean).length === 0)
  );
});

const parsedValue = computed(() => {
  let dayOrDays: DayOrDays;
  if (valueIsEmpty.value) {
    if (pickerOptions.value.getDefaultValue) {
      dayOrDays = pickerOptions.value.getDefaultValue();
    }
  } else {
    dayOrDays = isArray(props.value) ? props.value.map(d =>
      parseDate(d, props.valueFormat, lang.value),
    ) as [Dayjs, Dayjs] : parseDate(props.value, props.valueFormat, lang.value)!;
  }

  if (pickerOptions.value.getRangeAvailableTime) {
    const availableResult = pickerOptions.value.getRangeAvailableTime(
      dayOrDays!,
    );
    if (!isEqual(availableResult, dayOrDays!)) {
      dayOrDays = availableResult;
      emitInput(
        (isArray(dayOrDays)
          ? dayOrDays.map(_ => _.toDate())
          : dayOrDays.toDate()) as SingleOrRange<Date>,
      );
    }
  }
  if (isArray(dayOrDays!) && dayOrDays.some(day => !day)) {
    dayOrDays = [] as unknown as DayOrDays;
  }
  return dayOrDays!;
});

const isTimePicker = computed(() => props.type.startsWith('time'));
const isDatesPicker = computed(() => props.type === 'dates');

const displayValue = computed<UserInput>(() => {
  if (!pickerOptions.value.panelReady) return '';
  const formattedValue = formatDayjsToString(parsedValue.value);
  if (isArray(userInput.value)) {
    return [
      userInput.value[0] || (!valueIsEmpty.value && formattedValue && formattedValue[0]) || '',
      userInput.value[1] || (!valueIsEmpty.value && formattedValue && formattedValue[1]) || '',
    ];
  } else if (userInput.value !== null) {
    return userInput.value;
  } else if (!isTimePicker.value && valueIsEmpty.value) {
    return '';
  } else if (!pickerVisible.value && valueIsEmpty.value) {
    return '';
  } else if (formattedValue) {
    return isDatesPicker.value
      ? (formattedValue as Array<string>).join(', ')
      : formattedValue.toString();
  } else {
    return '';
  }
});

const isValidValue = (value: DayOrDays) => {
  return pickerOptions.value.isValidValue!(value);
};

const handleChange = () => {
  if (userInput.value) {
    const value = parseUserInputToDayjs(displayValue.value);
    if (value && isValidValue(value)) {
      emitInput(
        (isArray(value)
          ? value.map(_ => _.toDate())
          : value.toDate()) as DateOrDates,
      );
      userInput.value = isRangeInput.value ? [null, null] : null;
    }
  }

  if (userInput.value === '') {
    emitInput(null);
    emitChange(null);
    userInput.value = null;
  }
};

// Check if document.activeElement is inside popper or any input before popper close
const handleBlurInput = (e?: FocusEvent) => {
  const handleBlurDefer = async () => {
    setTimeout(() => {
      if (currentHandleBlurDeferCallback === handleBlurDefer) {
        if (
          !(
            refPopper.value?.isFocusInsideContent() && !hasJustTabExitedInput
          ) &&
          refInput.value.filter(input => {
            return input.contains(document.activeElement);
          }).length === 0
        ) {
          handleChange();
          pickerVisible.value = false;
          emit('blur', e);
          props.validateEvent &&
            formItem?.validate('blur').catch(error => debugWarn(error));
        }
        hasJustTabExitedInput = false;
      }
    }, 0);
  };
  currentHandleBlurDeferCallback = handleBlurDefer;
  handleBlurDefer();
};

const isTimeLikePicker = computed(() => props.type.includes('time'));

const triggerIcon = computed(
  () => props.prefixIcon || (isTimeLikePicker.value ? Clock : Calendar),
);

const showClose = ref(false);

const onClearIconClick = (event: MouseEvent) => {
  if (props.readonly || pickerDisabled.value) return;
  if (showClose.value) {
    event.stopPropagation();
    focusOnInputBox();
    emitInput(null);
    emitChange(null, true);
    showClose.value = false;
    pickerVisible.value = false;
    pickerOptions.value.handleClear && pickerOptions.value.handleClear();
  }
};

const onMouseDownInput = async (event: MouseEvent) => {
  if (props.readonly || pickerDisabled.value) return;
  if (
    (event.target as HTMLElement)?.tagName !== 'INPUT' ||
    refInput.value.includes(document.activeElement as HTMLInputElement)
  ) {
    pickerVisible.value = true;
  }
};

const onMouseEnter = () => {
  if (props.readonly || pickerDisabled.value) return;
  if (!valueIsEmpty.value && props.clearable) {
    showClose.value = true;
  }
};

const onMouseLeave = () => {
  showClose.value = false;
};

const onTouchStartInput = (event: TouchEvent) => {
  if (props.readonly || pickerDisabled.value) return;
  if (
    (event.touches[0].target as HTMLElement)?.tagName !== 'INPUT' ||
    refInput.value.includes(document.activeElement as HTMLInputElement)
  ) {
    pickerVisible.value = true;
  }
};

const pickerSize = useSize();

const popperEl = computed(() => unref(refPopper)?.popperRef?.contentRef);
const actualInputRef = computed(() => {
  if (unref(isRangeInput)) {
    return unref(inputRef);
  }

  return (unref(inputRef) as ComponentPublicInstance)?.$el;
});

onClickOutside(actualInputRef, (e: PointerEvent) => {
  const unrefedPopperEl = unref(popperEl);
  const inputEl = unref(actualInputRef);
  if (
    (unrefedPopperEl &&
      (e.target === unrefedPopperEl ||
        e.composedPath().includes(unrefedPopperEl))) ||
    e.target === inputEl ||
    e.composedPath().includes(inputEl)
  )
    return;
  pickerVisible.value = false;
});

const handleKeydownInput = async (event: KeyboardEvent) => {
  if (props.readonly || pickerDisabled.value) return;

  const { code } = event;
  emitKeydown(event);
  if (code === EVENT_CODE.esc) {
    if (pickerVisible.value === true) {
      pickerVisible.value = false;
      event.preventDefault();
      event.stopPropagation();
    }
    return;
  }

  if (code === EVENT_CODE.down) {
    if (pickerOptions.value.handleFocusPicker) {
      event.preventDefault();
      event.stopPropagation();
    }
    if (pickerVisible.value === false) {
      pickerVisible.value = true;
      await nextTick();
    }
    if (pickerOptions.value.handleFocusPicker) {
      pickerOptions.value.handleFocusPicker();
      return;
    }
  }

  if (code === EVENT_CODE.tab) {
    hasJustTabExitedInput = true;
    return;
  }

  if (code === EVENT_CODE.enter || code === EVENT_CODE.numpadEnter) {
    if (
      userInput.value === null ||
      userInput.value === '' ||
      isValidValue(parseUserInputToDayjs(displayValue.value) as DayOrDays)
    ) {
      handleChange();
      pickerVisible.value = false;
    }
    event.stopPropagation();
    return;
  }

  // if user is typing, do not let picker handle key input
  if (userInput.value) {
    event.stopPropagation();
    return;
  }
  if (pickerOptions.value.handleKeydownInput) {
    pickerOptions.value.handleKeydownInput(event);
  }
};

const onUserInput = (e: string) => {
  userInput.value = e;
  // Temporary fix when the picker is dismissed and the input box
  // is focused, just mimic the behavior of antdesign.
  if (!pickerVisible.value) {
    pickerVisible.value = true;
  }
};

const handleStartInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  userInput.value = userInput.value ? [target.value, userInput.value[1]] : [target.value, null];
};

const handleEndInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  userInput.value = userInput.value ? [userInput.value[0], target.value] : [null, target.value];
};

const handleStartChange = () => {
  const values = userInput.value as string[];
  const value = parseUserInputToDayjs(values && values[0]) as Dayjs;
  const parsedVal = unref(parsedValue) as [Dayjs, Dayjs];
  if (value && value.isValid()) {
    userInput.value = [
      formatDayjsToString(value) as string,
      displayValue.value?.[1] || null,
    ];
    const newValue = [value, parsedVal && (parsedVal[1] || null)] as DayOrDays;
    if (isValidValue(newValue)) {
      emitInput(newValue);
      userInput.value = null;
    }
  }
};

const handleEndChange = () => {
  const values = unref(userInput) as string[];
  const value = parseUserInputToDayjs(values && values[1]) as Dayjs;
  const parsedVal = unref(parsedValue) as [Dayjs, Dayjs];
  if (value && value.isValid()) {
    userInput.value = [
      unref(displayValue)?.[0] || null,
      formatDayjsToString(value) as string,
    ];
    const newValue = [parsedVal && parsedVal[0], value] as DayOrDays;
    if (isValidValue(newValue)) {
      emitInput(newValue);
      userInput.value = null;
    }
  }
};

const onSetPickerOption = <T extends keyof PickerOptions>(
  e: [T, PickerOptions[T]],
) => {
  pickerOptions.value[e[0]] = e[1];
  pickerOptions.value.panelReady = true;
};

const onCalendarChange = (e: [Date, false | Date]) => {
  emit('calendar-change', e);
};

const onPanelChange = (
  value: [Dayjs, Dayjs],
  mode: 'month' | 'year',
  view: unknown,
) => {
  emit('panel-change', value, mode, view);
};

provide(TIME_PICKER_INJECTION_KEY, { props });

defineExpose({
  /**
   * @description focus input box.
   */
  focus,
  /**
   * @description emit focus event
   */
  handleFocusInput,
  /**
   * @description emit blur event
   */
  handleBlurInput,
  /**
   * @description opens picker
   */
  handleOpen,
  /**
   * @description closes picker
   */
  handleClose,
  /**
   * @description pick item manually
   */
  onPick,
});
</script>
