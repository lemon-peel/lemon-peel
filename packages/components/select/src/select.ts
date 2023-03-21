import { placements } from '@popperjs/core';
import { tagProps } from '@lemon-peel/components/tag';
import { CircleClose, ArrowDown } from '@element-plus/icons-vue';
import { isValidComponentSize, iconPropType, buildProps } from '@lemon-peel/utils';
import { useTooltipContentProps } from '@lemon-peel/components/tooltip';
import { CHANGE_EVENT, UPDATE_MODEL_EVENT_OLD } from '@lemon-peel/constants';

import type { PropType } from 'vue';
import type { ComponentSize } from '@lemon-peel/constants/size';

export const selectProps = buildProps({
  name: String,
  id: String,
  modelValue: {
    type: [Array, String, Number, Boolean, Object],
    default: undefined,
  },
  autocomplete: {
    type: String,
    default: 'off',
  },
  automaticDropdown: Boolean,
  size: {
    type: String as PropType<ComponentSize>,
    validator: isValidComponentSize,
  },
  effect: {
    type: String as PropType<'light' | 'dark' | string>,
    default: 'light',
  },
  disabled: Boolean,
  clearable: Boolean,
  filterable: Boolean,
  loading: Boolean,
  popperClass: {
    type: String,
    default: '',
  },
  remote: Boolean,
  loadingText: String,
  noMatchText: String,
  noDataText: String,
  remoteMethod: Function,
  filterMethod: Function,
  multiple: Boolean,
  multipleLimit: {
    type: Number,
    default: 0,
  },
  placeholder: {
    type: String,
  },
  defaultFirstOption: Boolean,
  reserveKeyword: {
    type: Boolean,
    default: true,
  },
  valueKey: {
    type: String,
    default: 'value',
  },
  collapseTags: Boolean,
  collapseTagsTooltip: {
    type: Boolean,
    default: false,
  },
  teleported: useTooltipContentProps.teleported,
  persistent: {
    type: Boolean,
    default: true,
  },
  clearIcon: {
    type: iconPropType,
    default: CircleClose,
  },
  fitInputWidth: {
    type: Boolean,
    default: false,
  },
  suffixIcon: {
    type: iconPropType,
    default: ArrowDown,
  },
  // eslint-disable-next-line vue/require-prop-types
  tagType: { ...tagProps.type, default: 'info' },
  validateEvent: {
    type: Boolean,
    default: true,
  },
  remoteShowSuffix: {
    type: Boolean,
    default: false,
  },
  suffixTransition: {
    type: Boolean,
    default: true,
  },
  placement: {
    type: String,
    values: placements,
    default: 'bottom-start',
  },
});

export const selectEmits = [
  UPDATE_MODEL_EVENT_OLD,
  CHANGE_EVENT,
  'remove-tag',
  'clear',
  'visible-change',
  'focus',
  'blur',
];
