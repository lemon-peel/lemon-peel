import { withInstallFunction } from '@lemon-peel/utils';

import Notify from './src/notify';

export const LpNotification = withInstallFunction(Notify, '$notify');
export default LpNotification;

export * from './src/notification';
