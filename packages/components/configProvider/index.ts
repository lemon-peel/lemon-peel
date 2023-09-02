import { withInstall } from '@lemon-peel/utils';

import ConfigProvider from './src/configProvider';

export const LpConfigProvider = withInstall(ConfigProvider);
export default LpConfigProvider;

export * from './src/configProvider';

export type ConfigProviderInst = InstanceType<typeof ConfigProvider>;
