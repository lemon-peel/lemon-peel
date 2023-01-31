import { buildProps, definePropType } from '@lemon-peel/utils';
import type { StyleValue } from 'vue';

export const visualHiddenProps = buildProps({
  style: {
    type: definePropType<StyleValue>([String, Object, Array]),
    default: () => ({}),
  },
} as const);
