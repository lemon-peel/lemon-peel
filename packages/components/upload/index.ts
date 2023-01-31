import { withInstall } from '@lemon-peel/utils';
import Upload from './src/Upload.vue';

export const LpUpload = withInstall(Upload);
export default LpUpload;

export * from './src/upload';
export * from './src/uploadContent';
export * from './src/uploadList';
export * from './src/uploadDragger';
