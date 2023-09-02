import { withInstall, withNoopInstall } from '@lemon-peel/utils';
import Button from './src/Button.vue';
import ButtonGroup from './src/ButtonGroup.vue';

export const LpButton = withInstall(Button, {
  ButtonGroup,
});
export const LpButtonGroup = withNoopInstall(ButtonGroup);
export default LpButton;

export * from './src/button';
export * from './src/buttonGroup';

export type ButtonInst = InstanceType<typeof Button>;
export type ButtonGroupInst = InstanceType<typeof ButtonGroup>;
