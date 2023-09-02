import { withInstall } from '@lemon-peel/utils';

import Badge from './src/Badge.vue';

export const LpBadge = withInstall(Badge);
export default LpBadge;

export * from './src/badge';

export type BadgeInst = InstanceType<typeof Badge>;
