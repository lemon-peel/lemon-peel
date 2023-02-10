import { withInstall, withNoopInstall } from '@lemon-peel/utils';
import type { SFCWithInstall } from '@lemon-peel/utils';

import Select from './src/Select.vue';
import Option from './src/Option.vue';
import OptionGroup from './src/OptionGroup.vue';
export const LpSelect = withNoopInstall(Select);
export const LpOption = withNoopInstall(Option);
export const LpOptionGroup = withNoopInstall(OptionGroup);

const withInstaller: SFCWithInstall<typeof Select> = withInstall(Select, {
  Option,
  OptionGroup,
});
export default withInstaller;

export * from './src/token';
export * from './src/select';
