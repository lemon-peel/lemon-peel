import { buildProps } from '@lemon-peel/utils';
import { componentSizes } from '@lemon-peel/constants';
import type Tag from './Tag.vue';

import type { ExtractPropTypes } from 'vue';

export const tagProps = buildProps({
  closable: Boolean,
  type: {
    type: String,
    values: ['success', 'info', 'warning', 'danger', ''],
    default: '',
  },
  hit: Boolean,
  disableTransitions: Boolean,
  color: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    values: componentSizes,
    default: '',
  },
  effect: {
    type: String,
    values: ['dark', 'light', 'plain'],
    default: 'light',
  },
  round: Boolean,
} as const);
export type TagProps = ExtractPropTypes<typeof tagProps>;

export const tagEmits = {
  close: (event_: MouseEvent) => event_ instanceof MouseEvent,
  click: (event_: MouseEvent) => event_ instanceof MouseEvent,
};
export type TagEmits = typeof tagEmits;

export type TagInstance = InstanceType<typeof Tag>;
