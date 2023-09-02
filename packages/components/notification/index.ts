import { withInstallFunction } from '@lemon-peel/utils';

import type NotifyView from './src/Notification.vue';
import Notify from './src/notify';

export const LpNotification = withInstallFunction(Notify, '$notify');
export default LpNotification;

export * from './src/notification';

export type NotificationInst = InstanceType<typeof NotifyView>;
