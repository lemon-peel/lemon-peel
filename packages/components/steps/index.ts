import { withInstall, withNoopInstall } from '@lemon-peel/utils';

import Steps from './src/Steps.vue';
import Step from './src/Item.vue';

export const LpSteps = withInstall(Steps, {
  Step,
});
export default LpSteps;
export const LpStep = withNoopInstall(Step);

export * from './src/item';
export * from './src/steps';
