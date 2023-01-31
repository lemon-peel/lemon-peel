import { defineComponent, provide, ref } from 'vue';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import { DEFAULT_FORMATS_TIME } from './constants';
import Picker from './common/Picker.vue';
import TimePickPanel from './timePickerCom/PanelTimePick.vue';
import TimeRangePanel from './timePickerCom/PanelTimeRange.vue';
import { timePickerDefaultProps } from './common/props';

dayjs.extend(customParseFormat);

export default defineComponent({
  name: 'LpTimePicker',
  install: null,
  props: {
    ...timePickerDefaultProps,
    isRange: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['update:modelValue'],
  setup(props, context) {
    const commonPicker = ref<InstanceType<typeof Picker>>();
    const [type, Panel] = props.isRange
      ? ['timerange', TimeRangePanel]
      : ['time', TimePickPanel];

    const modelUpdater = (value: any) => context.emit('update:modelValue', value);
    provide('LpPopperOptions', props.popperOptions);
    context.expose({
      /**
       * @description focus on the input element
       */
      focus: (e: FocusEvent | undefined) => {
        commonPicker.value?.handleFocusInput(e);
      },
      /**
       * @description blur from the input element
       */
      blur: (e: FocusEvent | undefined) => {
        commonPicker.value?.handleBlurInput(e);
      },
      /**
       * @description opens the picker element
       */
      handleOpen: () => {
        commonPicker.value?.handleOpen();
      },
      /**
       * @description closes the picker element
       */
      handleClose: () => {
        commonPicker.value?.handleClose();
      },
    });

    return () => {
      const format = props.format ?? DEFAULT_FORMATS_TIME;

      return (
        <Picker
          {...props}
          ref={commonPicker}
          type={type}
          format={format}
          onUpdate:modelValue={modelUpdater}
        >
          {{
            default: (attrs: any) => <Panel {...attrs} />,
          }}
        </Picker>
      );
    };
  },
});
