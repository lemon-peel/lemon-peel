import { buildProps } from '@lemon-peel/utils';
import type { ExtractPropTypes, PropType } from 'vue';
import type Divider from './divider.vue';

export type BorderStyle = CSSStyleDeclaration['borderStyle'];

export const dividerProps = buildProps({
  direction: { type: String, values: ['horizontal', 'vertical'], default: 'horizontal' },
  contentPosition: { type: String, values: ['left', 'center', 'right'], default: 'center' },
  borderStyle: { type: String as PropType<BorderStyle>, default: 'solid' },
} as const);
export type DividerProps = ExtractPropTypes<typeof dividerProps>;

export type DividerInstance = InstanceType<typeof Divider>;
