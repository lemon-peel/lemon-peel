import { withInstall, withNoopInstall } from '@lemon-peel/utils';

import Descriptions from './src/Description.vue';
import DescriptionsItem from './src/DescriptionItem';

export const LpDescriptions = withInstall(Descriptions, {
  DescriptionsItem,
});

export const LpDescriptionsItem = withNoopInstall(DescriptionsItem);

export default LpDescriptions;

export * from './src/description';
