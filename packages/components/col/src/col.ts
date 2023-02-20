import { buildProps, mutable } from '@lemon-peel/utils';
import type { ExtractPropTypes, PropType } from 'vue';
import type Col from './Col.vue';

export type ColSizeObject = {
  span?: number;
  offset?: number;
  pull?: number;
  push?: number;
};
export type ColSize = number | ColSizeObject;

export const colProps = buildProps({
  tag: { type: String, default: 'div' },
  span: { type: Number, default: 24 },
  offset: { type: Number, default: 0 },
  pull: { type: Number, default: 0 },
  push: { type: Number, default: 0 },
  xs: {
    type: [Number, Object] as PropType<ColSize>,
    default: () => mutable({} as const),
  },
  sm: {
    type: [Number, Object] as PropType<ColSize>,
    default: () => mutable({} as const),
  },
  md: {
    type: [Number, Object] as PropType<ColSize>,
    default: () => mutable({} as const),
  },
  lg: {
    type: [Number, Object] as PropType<ColSize>,
    default: () => mutable({} as const),
  },
  xl: {
    type: [Number, Object] as PropType<ColSize>,
    default: () => mutable({} as const),
  },
} as const);
export type ColProps = ExtractPropTypes<typeof colProps>;
export type ColInstance = InstanceType<typeof Col>;
