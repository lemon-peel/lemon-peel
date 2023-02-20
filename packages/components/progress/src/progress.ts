import { buildProps } from '@lemon-peel/utils';
import type { ExtractPropTypes, PropType, SVGAttributes } from 'vue';
import type Progress from './Progress.vue';

export type ProgressColor = { color: string, percentage: number };
export type ProgressFn = (percentage: number) => string;

export const progressProps = buildProps({
  type: { type: String, default: 'line', values: ['line', 'circle', 'dashboard'] },
  percentage: { type: Number, default: 0, validator: (val: number): boolean => val >= 0 && val <= 100 },
  status: { type: String, default: '', values: ['', 'success', 'exception', 'warning'] },
  indeterminate: { type: Boolean, default: false },
  duration: { type: Number, default: 3 },
  strokeWidth: { type: Number, default: 6 },
  strokeLinecap: { type: String as PropType<NonNullable<SVGAttributes['stroke-linecap']>>, default: 'round' },
  textInside: { type: Boolean, default: false },
  width: { type: Number, default: 126 },
  showText: { type: Boolean, default: true },
  color: { type: [String, Array, Function] as PropType<string | ProgressColor[] | ProgressFn>, default: '' },
  format: { type: Function as PropType<ProgressFn>, default: (percentage: number): string => `${percentage}%` },
} as const);

export type ProgressProps = ExtractPropTypes<typeof progressProps>;
export type ProgressInstance = InstanceType<typeof Progress>;
