import { withInstall } from '@lemon-peel/utils';
import Avatar from './src/Avatar.vue';

export const LpAvatar = withInstall(Avatar);
export default LpAvatar;

export * from './src/avatar';

export type AvatarInst = InstanceType<typeof Avatar>;
