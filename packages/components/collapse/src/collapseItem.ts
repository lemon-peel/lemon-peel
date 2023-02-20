import { buildProps, generateId } from '@lemon-peel/utils';
import type { ExtractPropTypes, PropType } from 'vue';
import type { CollapseActiveName } from './collapse';

export const collapseItemProps = buildProps({
  title: {
    type: String,
    default: '',
  },
  name: {
    type: [String, Number] as PropType<CollapseActiveName>,
    default: () => generateId(),
  },
  disabled: Boolean,
} as const);
export type CollapseItemProps = ExtractPropTypes<typeof collapseItemProps>;
