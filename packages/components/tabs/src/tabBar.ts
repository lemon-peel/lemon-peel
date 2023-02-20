import { buildProps, mutable } from '@lemon-peel/utils';
import type { ExtractPropTypes, PropType } from 'vue';
import type { TabsPaneContext } from '@lemon-peel/tokens';
import type TabBar from './TabBar.vue';

export const tabBarProps = buildProps({
  tabs: {
    type: Array as PropType<TabsPaneContext[]>,
    default: () => mutable([] as const),
  },
} as const);

export type TabBarProps = ExtractPropTypes<typeof tabBarProps>;
export type TabBarInstance = InstanceType<typeof TabBar>;
