<template>
  <Picker
    v-bind="props"
    ref="commonPicker"
    :type="type"
    :format="format"
    @update:value="modelUpdater"
  >
    <template #default="scopedSlots">
      <Component :is="Panel" v-bind="(scopedSlots as any)" />
    </template>
  </Picker>
</template>

<script setup lang="ts">
import { provide, ref } from 'vue';
import dayjs from 'dayjs';
import { UPDATE_MODEL_EVENT } from '@lemon-peel/constants';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import { DEFAULT_FORMATS_TIME } from './constants';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import Picker from './common/Picker.vue';
import TimePickPanel from './timePickerCom/PanelTimePick.vue';
import TimeRangePanel from './timePickerCom/PanelTimeRange.vue';
import { timePickerDefaultProps } from './common/props';
import { computed } from 'vue';

dayjs.extend(customParseFormat);

defineOptions({
  name: 'LpTimePicker',
  install: null,
});


const props = defineProps({
  ...timePickerDefaultProps,
  isRange: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([UPDATE_MODEL_EVENT]);

const commonPicker = ref<InstanceType<typeof Picker>>();
const [type, Panel] = props.isRange
  ? ['timerange', TimeRangePanel]
  : ['time', TimePickPanel];

const modelUpdater = (value: any) => emit(UPDATE_MODEL_EVENT, value);
const format = computed(() => (props.format ?? DEFAULT_FORMATS_TIME));

provide('LpPopperOptions', props.popperOptions);

/**
 * @description focus on the input element
 */
const focus = (e: FocusEvent | undefined) => {
  commonPicker.value?.handleFocusInput(e);
};
/**
 * @description blur from the input element
 */
const  blur = (e: FocusEvent | undefined) => {
  commonPicker.value?.handleBlurInput(e);
};
/**
 * @description opens the picker element
 */
const handleOpen = () => {
  commonPicker.value?.handleOpen();
};
/**
 * @description closes the picker element
 */
const handleClose = () => {
  commonPicker.value?.handleClose();
};

defineExpose({
  focus,
  blur,
  handleOpen,
  handleClose,
});
</script>
