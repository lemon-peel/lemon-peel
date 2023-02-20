import { buildProps } from '@lemon-peel/utils';
import type { ExtractPropTypes, PropType } from 'vue';
import type { RouteLocationRaw } from 'vue-router';
import type BreadcrumbItem from './BreadcrumbItem.vue';

export const breadcrumbItemProps = buildProps({
  to: { type: [String, Object] as PropType<RouteLocationRaw>, default: '' },
  replace: { type: Boolean, default: false },
});

export type BreadcrumbItemProps = ExtractPropTypes<typeof breadcrumbItemProps>;

export type BreadcrumbItemInstance = InstanceType<typeof BreadcrumbItem>;
