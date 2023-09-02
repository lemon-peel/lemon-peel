import { withInstallFunction } from '@lemon-peel/utils';

import type MessageView from './src/Message.vue';
import Message from './src/method';

export const LpMessage = withInstallFunction(Message, '$message');
export default LpMessage;

export * from './src/message';

export type MessageInst = InstanceType<typeof MessageView>;
