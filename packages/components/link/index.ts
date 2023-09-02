import { withInstall } from '@lemon-peel/utils';

import Link from './src/Link.vue';

export const LpLink = withInstall(Link);
export default LpLink;

export * from './src/link';

export type LinkInst = InstanceType<typeof Link>;
