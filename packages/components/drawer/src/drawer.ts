import { buildProps } from '@lemon-peel/utils';
import {  dialogProps } from '@lemon-peel/components/dialog';
import type { ExtractPropTypes } from 'vue';

export const drawerProps = buildProps({
  ...dialogProps,
  direction: {
    type: String,
    default: 'rtl',
    values: ['ltr', 'rtl', 'ttb', 'btt'],
  },
  size: { type: [String, Number], default: '30%' },
  withHeader: { type: Boolean, default: true },
  modalFade: { type: Boolean, default: true },
} as const);

export type DrawerProps = ExtractPropTypes<typeof drawerProps>;

export { dialogEmits as drawerEmits } from '@lemon-peel/components/dialog';