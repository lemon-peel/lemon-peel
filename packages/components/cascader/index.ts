import { withInstall } from '@lemon-peel/utils';
import Cascader from './src/Cascader.vue';

export const LpCascader = withInstall(Cascader);

export default LpCascader;
export * from './src/cascader';

export type CascaderInst = InstanceType<typeof Cascader>;
