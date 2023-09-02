import { withInstall } from '@lemon-peel/utils';
import InputNumber from './src/InputNumber.vue';

export const LpInputNumber = withInstall(InputNumber);

export default LpInputNumber;

export * from './src/inputNumber';

export type InputNumberInst = InstanceType<typeof InputNumber>;
