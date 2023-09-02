import { withInstall } from '@lemon-peel/utils';

import Input from './src/Input.vue';

export const LpInput = withInstall(Input);
export default LpInput;

export * from './src/input';

export type InputInst = InstanceType<typeof Input>;
