import { withInstall, withNoopInstall } from '@lemon-peel/utils';

import Breadcrumb from './src/Breadcrumb.vue';
import BreadcrumbItem from './src/BreadcrumbItem.vue';

export const LpBreadcrumb = withInstall(Breadcrumb, {
  BreadcrumbItem,
});
export const LpBreadcrumbItem = withNoopInstall(BreadcrumbItem);
export default LpBreadcrumb;

export * from './src/breadcrumb';
export * from './src/breadcrumbItem';
