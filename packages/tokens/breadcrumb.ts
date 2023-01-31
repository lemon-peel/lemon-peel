import type { InjectionKey } from 'vue';
import type { BreadcrumbProps } from '@lemon-peel/components/breadcrumb';

export const breadcrumbKey: InjectionKey<BreadcrumbProps> =
  Symbol('breadcrumbKey');
