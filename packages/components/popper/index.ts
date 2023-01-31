import { withInstall } from '@lemon-peel/utils';
import Popper from './src/Popper.vue';


export const LpPopper = withInstall(Popper);
export default LpPopper;

export * from './src/popper';
export * from './src/trigger';
export * from './src/content';
export * from './src/arrow';

export type { Placement, Options } from '@popperjs/core';

export { default as LpPopperArrow } from './src/Arrow.vue';
export { default as LpPopperTrigger } from './src/Trigger.vue';
export { default as LpPopperContent } from './src/Content.vue';