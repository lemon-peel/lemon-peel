import { buildProps } from '@lemon-peel/utils';
import type { PropType } from 'vue';

export const descriptionsRowProps = buildProps({
  row: { type: Array as PropType<Record<string, any>[]>, default: () => [] },
} as const);
