import { iconPropType } from '@lemon-peel/utils';
import type { ExtractPropTypes, PropType } from 'vue';
import type { ObjectFitProperty } from 'csstype';
import type Avatar from './Avatar.vue';

export const avatarProps = {
  size: { type: [Number, String], default: '' },
  shape: { type: String, values: ['circle', 'square'], default: 'circle' },
  icon: { type: iconPropType },
  src: { type: String, default: '' },
  alt: { type: String, default: '' },
  srcSet: String,
  fit: { type: String as PropType<ObjectFitProperty>, default: 'cover' },
};

export type AvatarProps = ExtractPropTypes<typeof avatarProps>;

export const avatarEmits = {
  error: (evt: Event) => evt instanceof Event,
};
export type AvatarEmits = typeof avatarEmits;

export type AvatarInstance = InstanceType<typeof Avatar>;
