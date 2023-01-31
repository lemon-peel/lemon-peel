import { withInstall, withInstallDirective } from '@lemon-peel/utils';

import Popover from './src/Popover.vue';
import PopoverDirective, { VPopover } from './src/directive';

export const LpPopoverDirective = withInstallDirective(
  PopoverDirective,
  VPopover,
);

export const LpPopover = withInstall(Popover, {
  directive: LpPopoverDirective,
});
export default LpPopover;

export * from './src/popover';
