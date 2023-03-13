import { defineComponent, provide, reactive, ref, toRef } from 'vue';
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
import { CommonPicker, DEFAULT_FORMATS_DATE, DEFAULT_FORMATS_DATEPICKER, timePickerDefaultProps } from '@lemon-peel/components/timePicker';

import { datePickerProps } from './props/datePicker';
import { getPanel } from './panelUtils';

dayjs.extend(localeData);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
dayjs.extend(dayOfYear);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export default defineComponent({
  name: 'LpDatePicker',
  install: null,
  props: {
    // FIXME: move this to date-picker.ts
    ...timePickerDefaultProps,
    ...datePickerProps,
  },
  emits: ['update:modelValue'],
  setup(props, { expose, emit, slots }) {
    const ns = useNamespace('picker-panel');

    provide('LpPopperOptions', reactive(toRef(props, 'popperOptions')));
    provide(ROOT_PICKER_INJECTION_KEY, {
      slots,
      pickerNs: ns,
    });

    const commonPicker = ref<InstanceType<typeof CommonPicker>>();
    const refProps = {
      focus: (focusStartInput = true) => {
        commonPicker.value?.focus(focusStartInput);
      },
      handleOpen: () => {
        commonPicker.value?.handleOpen();
      },
      handleClose: () => {
        commonPicker.value?.handleClose();
      },
    };

    expose(refProps);

    const onModelValueUpdated = (value: any) => {
      emit('update:modelValue', value);
    };

    return () => {
      // since props always have all defined keys on it, {format, ...props} will always overwrite format
      // pick props.format or provide default value here before spreading
      const format =
        props.format ??
        (DEFAULT_FORMATS_DATEPICKER[props.type] || DEFAULT_FORMATS_DATE);

      const Component = getPanel(props.type);

      return (
        <CommonPicker
          {...props}
          format={format}
          type={props.type}
          ref={commonPicker}
          onUpdate:modelValue={onModelValueUpdated}
        >
          {{
            default: (scopedProps: /**FIXME: remove any type */ any) => (
              <Component {...scopedProps} />
            ),
            'range-separator': slots['range-separator'],
          }}
        </CommonPicker>
      );
    };
  },
});
