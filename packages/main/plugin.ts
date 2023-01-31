import { LpInfiniteScroll } from '@lemon-peel/components/infiniteScroll';
import { LpLoading } from '@lemon-peel/components/loading';
import { LpMessage } from '@lemon-peel/components/message';
import { LpMessageBox } from '@lemon-peel/components/messageBox';
import { LpNotification } from '@lemon-peel/components/notification';
import { LpPopoverDirective } from '@lemon-peel/components/popover';

import type { Plugin } from 'vue';

export default [
  LpInfiniteScroll,
  LpLoading,
  LpMessage,
  LpMessageBox,
  LpNotification,
  LpPopoverDirective,
] as Plugin[];
