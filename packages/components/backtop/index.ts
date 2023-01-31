import { withInstall } from '@lemon-peel/utils';

import Backtop from './src/Backtop.vue';

export const LpBacktop = withInstall(Backtop);
export default LpBacktop;

export type { BacktopInstance } from './src/instance';
export * from './src/backtop';
