import { buildProps } from '@lemon-peel/utils';

import type { ExtractPropTypes, PropType, StyleValue } from 'vue';
import type Card from './Card.vue';

export const cardProps = buildProps({
  header: { type: String, default: '' },
  bodyStyle: { type: [String, Object, Array] as PropType<StyleValue>, default: '' },
  shadow: { type: String, values: ['always', 'hover', 'never'], default: 'always' },
});
export type CardProps = ExtractPropTypes<typeof cardProps>;
export type CardInstance = InstanceType<typeof Card>;
