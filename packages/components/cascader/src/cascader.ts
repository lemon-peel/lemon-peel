import { commonProps } from '@lemon-peel/components/cascaderPanel';
import { buildProps, isValidComponentSize } from '@lemon-peel/utils';
import { useTooltipContentProps } from '@lemon-peel/components/tooltip';
import { tagProps } from '@lemon-peel/components/tag';

import type { CascaderNode } from '@lemon-peel/components/cascaderPanel';
import type { ComponentSize } from '@lemon-peel/constants';
import { CHANGE_EVENT } from '@lemon-peel/constants';
import { UPDATE_MODEL_EVENT } from '@lemon-peel/constants';
import type { PropType, ExtractPropTypes } from 'vue';

export const cascaderProps = buildProps({
  ...commonProps,
  size: {
    type: String as PropType<ComponentSize>,
    validator: isValidComponentSize,
    default: () => '',
  },
  placeholder: { type: String, default: undefined },
  disabled: Boolean,
  clearable: Boolean,
  filterable: Boolean,
  filterMethod: {
    type: Function as PropType<(node: CascaderNode, keyword: string) => boolean>,
    default: (node: CascaderNode, keyword: string) => node.text.includes(keyword),
  },
  separator: { type: String, default: ' / ' },
  showAllLevels: { type: Boolean, default: true },
  collapseTags: Boolean,
  collapseTagsTooltip: { type: Boolean, default: false },
  debounce: { type: Number, default: 300 },
  beforeFilter: {
    type: Function as PropType<(value: string) => boolean | Promise<any>>,
    default: () => true,
  },
  popperClass: { type: String, default: '' },
  teleported: useTooltipContentProps.teleported,
  // eslint-disable-next-line vue/require-prop-types
  tagType: { ...tagProps.type, default: 'info' },
  validateEvent: { type: Boolean, default: true },
});

export const cascaderEmits = [
  UPDATE_MODEL_EVENT,
  CHANGE_EVENT,
  'focus',
  'blur',
  'visible-change',
  'expand-change',
  'remove-tag',
];

export type CascaderProps = Readonly<ExtractPropTypes<typeof cascaderProps>>;

