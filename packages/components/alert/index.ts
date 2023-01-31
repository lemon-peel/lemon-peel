import { withInstall } from '@lemon-peel/utils';

import Alert from './src/Alert.vue';

export const LpAlert = withInstall(Alert);
export default LpAlert;

export * from './src/alert';
export type { AlertInstance } from './src/instance';
