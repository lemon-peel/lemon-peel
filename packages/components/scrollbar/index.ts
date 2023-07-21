import { withInstall } from '@lemon-peel/utils';

import Scrollbar from './src/Scrollbar.vue';

export const LpScrollBar = withInstall(Scrollbar);
export default LpScrollBar;

export * from './src/util';
export * from './src/scrollbar';
export * from './src/thumb';
