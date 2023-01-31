import { buildProps } from '@lemon-peel/utils';
import type { ExtractPropTypes } from 'vue';
import type Thumb from './Thumb.vue';

export const thumbProps = buildProps({
  vertical: Boolean,
  size: String,
  move: Number,
  ratio: {
    type: Number,
    required: true,
  },
  always: Boolean,
} as const);
export type ThumbProps = ExtractPropTypes<typeof thumbProps>;

export type ThumbInstance = InstanceType<typeof Thumb>;