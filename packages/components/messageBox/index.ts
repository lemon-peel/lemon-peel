import MessageBox from './src/messageBox';

import type { App } from 'vue';
import type { SFCWithInstall } from '@lemon-peel/utils';

const withInstaller = MessageBox as SFCWithInstall<typeof MessageBox>;

withInstaller.install = (app: App) => {
  withInstaller._context = app._context;
  app.config.globalProperties.$msgbox = withInstaller;
  app.config.globalProperties.$messageBox = withInstaller;
  app.config.globalProperties.$alert = withInstaller.alert;
  app.config.globalProperties.$confirm = withInstaller.confirm;
  app.config.globalProperties.$prompt = withInstaller.prompt;
};

export default withInstaller;
export const LpMessageBox = withInstaller;

export * from './src/messageBox.type';
