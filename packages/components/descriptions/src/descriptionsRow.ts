import { buildProps } from '@lemon-peel/utils';

export const descriptionsRowProps = buildProps({
  row: {
    type: Array,
    default: () => [],
  },
} as const);
