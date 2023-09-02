import { withInstall } from '@lemon-peel/utils';

import Affix from './src/Affix.vue';

export const LpAffix = withInstall(Affix);
export default LpAffix;

export * from './src/affix';

export type AffixInst = InstanceType<typeof Affix>;
