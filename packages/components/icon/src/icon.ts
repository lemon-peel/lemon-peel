import { buildProps } from '@lemon-peel/utils';
import type { ExtractPropTypes, PropType } from 'vue';
import type Icon from './Icon.vue';

export const iconProps = buildProps({
  size: {
    type: [Number, String] as PropType<number | string>,
  },
  color: {
    type: String,
  },
} as const);

export type IconProps = ExtractPropTypes<typeof iconProps>;
export type IconInstance = InstanceType<typeof Icon>;
