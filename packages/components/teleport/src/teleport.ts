import { buildProps } from '@lemon-peel/utils';
import type { ExtractPropTypes, PropType, StyleValue } from 'vue';
import type Teleport from './Teleport.vue';

export const teleportProps = buildProps({
  container: { type: String as PropType<string>, default: 'body' },
  disabled: { type: Boolean, default: false },
  style: { type: [String, Array, Object] as PropType<StyleValue> },
  zIndex: { type: String, default: '2000' },
} as const);

export type TeleportProps = ExtractPropTypes<typeof teleportProps>;
export type TeleportInstance = InstanceType<typeof Teleport>;
