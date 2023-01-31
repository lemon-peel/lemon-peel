import { withInstallFunction } from '@lemon-peel/utils';

import Message from './src/method';

export const LpMessage = withInstallFunction(Message, '$message');
export default LpMessage;

export * from './src/message';
