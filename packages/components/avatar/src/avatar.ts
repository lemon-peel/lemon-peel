import { buildProps, iconPropType, isNumber } from '@lemon-peel/utils';
import { componentSizes } from '@lemon-peel/constants';
import type { ExtractPropTypes, PropType } from 'vue';
import type { ObjectFitProperty } from 'csstype';
import type Avatar from './Avatar.vue';

export const avatarProps = buildProps({
  size: {
    type: [Number, String],
    values: componentSizes,
    default: '',
    validator: (val: unknown): val is number => isNumber(val),
  },
  shape: { type: String, values: ['circle', 'square'], default: 'circle' },
  icon: { type: iconPropType },
  src: { type: String, default: '' },
  alt: String,
  srcSet: String,
  fit: { type: String as PropType<ObjectFitProperty>, default: 'cover' },
});

export type AvatarProps = ExtractPropTypes<typeof avatarProps>;

export const avatarEmits = {
  error: (evt: Event) => evt instanceof Event,
};
export type AvatarEmits = typeof avatarEmits;

export type AvatarInstance = InstanceType<typeof Avatar>;
