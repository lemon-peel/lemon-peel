import { withInstall } from '@lemon-peel/utils';

import Backtop from './src/Backtop.vue';

export const LpBacktop = withInstall(Backtop);
export default LpBacktop;

export * from './src/backtop';

export type BacktopInst = InstanceType<typeof Backtop>;

