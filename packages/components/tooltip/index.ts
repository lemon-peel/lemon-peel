import { withInstall } from '@lemon-peel/utils';
import Tooltip from './src/Tooltip.vue';

export const LpTooltip = withInstall(Tooltip);
export * from './src/tooltip';
export * from './src/trigger';
export * from './src/content';
export default LpTooltip;
