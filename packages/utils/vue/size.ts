import { ComponentSizeMap } from '@lemon-peel/constants';

import type { ComponentSize } from '@lemon-peel/constants';

export const getComponentSize = (size?: ComponentSize) => {
  return ComponentSizeMap[size || 'default'];
};
