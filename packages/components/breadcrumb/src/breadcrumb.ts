import { buildProps, iconPropType } from '@lemon-peel/utils';
import type { ExtractPropTypes } from 'vue';
import type Breadcrumb from './Breadcrumb.vue';

export const breadcrumbProps = buildProps({
  separator: {
    type: String,
    default: '/',
  },
  separatorIcon: {
    type: iconPropType,
  },
} as const);
export type BreadcrumbProps = ExtractPropTypes<typeof breadcrumbProps>;
export type BreadcrumbInstance = InstanceType<typeof Breadcrumb>;
