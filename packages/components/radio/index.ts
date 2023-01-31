import { withInstall, withNoopInstall } from '@lemon-peel/utils';

import Radio from './src/Radio.vue';
import RadioButton from './src/RadioButton.vue';
import RadioGroup from './src/RadioGroup.vue';

export const LpRadio = withInstall(Radio, {
  RadioButton,
  RadioGroup,
});
export default LpRadio;
export const LpRadioGroup = withNoopInstall(RadioGroup);
export const LpRadioButton = withNoopInstall(RadioButton);

export * from './src/radio';
export * from './src/radioGroup';
export * from './src/radioButton';
