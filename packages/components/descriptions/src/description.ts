import { buildProps } from '@lemon-peel/utils';
import { useSizeProp } from '@lemon-peel/hooks';

import type Description from './Description.vue';

export const descriptionProps = buildProps({
  border: {
    type: Boolean,
    default: false,
  },
  column: {
    type: Number,
    default: 3,
  },
  direction: {
    type: String,
    values: ['horizontal', 'vertical'],
    default: 'horizontal',
  },
  size: useSizeProp,
  title: {
    type: String,
    default: '',
  },
  extra: {
    type: String,
    default: '',
  },
} as const);

export type DescriptionInstance = InstanceType<typeof Description>;
