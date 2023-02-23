import { buildProps } from '@lemon-peel/utils';
import type { PropType, StyleValue } from 'vue';

export const visualHiddenProps = buildProps({
  style: {
    type: [String, Object, Array] as PropType<StyleValue>,
    default: () => ({}),
  },
} as const);
