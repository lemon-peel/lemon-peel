import { withInstall, withNoopInstall } from '@lemon-peel/utils';

import Checkbox from './src/Checkbox.vue';
import CheckboxButton from './src/CheckboxButton.vue';
import CheckboxGroup from './src/CheckboxGroup.vue';

export const LpCheckbox = withInstall(Checkbox, {
  CheckboxButton,
  CheckboxGroup,
});
export default LpCheckbox;

export const LpCheckboxButton = withNoopInstall(CheckboxButton);
export const LpCheckboxGroup = withNoopInstall(CheckboxGroup);

export * from './src/checkboxGroup';
export * from './src/checkbox';
