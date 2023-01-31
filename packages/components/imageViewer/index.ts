import { withInstall } from '@lemon-peel/utils';

import ImageViewer from './src/ImageViewer.vue';

export const LpImageViewer = withInstall(ImageViewer);
export default LpImageViewer;

export * from './src/imageViewer';
