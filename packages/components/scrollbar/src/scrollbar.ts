import { buildProps, isNumber } from '@lemon-peel/utils';
import type { ExtractPropTypes, PropType, StyleValue } from 'vue';
import type Scrollbar from './Scrollbar.vue';

export const scrollbarProps = buildProps({
  height: { type: [String, Number], default: '' },
  maxHeight: { type: [String, Number], default: '' },
  native: Boolean,
  wrapStyle: { type: [String, Object, Array] as PropType<StyleValue>, default: '' },
  wrapClass: { type: [String, Array], default: '' },
  viewClass: { type: [String, Array], default: '' },
  viewStyle: { type: [String, Array, Object], default: '' },
  noresize: Boolean, // 如果 container 尺寸不会发生变化，最好设置它可以优化性能
  tag: { type: String, default: 'div' },
  always: Boolean,
  minSize: { type: Number, default: 20 },
} as const);
export type ScrollbarProps = ExtractPropTypes<typeof scrollbarProps>;

export const scrollbarEmits = {
  scroll: ({
    scrollTop,
    scrollLeft,
  }: {
    scrollTop: number;
    scrollLeft: number;
  }) => [scrollTop, scrollLeft].every(isNumber),
};

export type ScrollbarEmits = typeof scrollbarEmits;

export type ScrollbarInstance = InstanceType<typeof Scrollbar>;
