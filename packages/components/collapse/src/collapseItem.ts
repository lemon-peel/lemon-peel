import { buildProps, definePropType, generateId } from '@lemon-peel/utils';
import type { ExtractPropTypes } from 'vue';
import type { CollapseActiveName } from './Collapse.vue';

export const collapseItemProps = buildProps({
  title: {
    type: String,
    default: '',
  },
  name: {
    type: definePropType<CollapseActiveName>([String, Number]),
    default: () => generateId(),
  },
  disabled: Boolean,
} as const);
export type CollapseItemProps = ExtractPropTypes<typeof collapseItemProps>;
