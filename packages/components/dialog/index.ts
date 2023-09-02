import { withInstall } from '@lemon-peel/utils';
import Dialog from './src/Dialog.vue';

export const LpDialog = withInstall(Dialog);
export default LpDialog;

export * from './src/useDialog';
export * from './src/dialog';

export type DialogInst = InstanceType<typeof Dialog>;
