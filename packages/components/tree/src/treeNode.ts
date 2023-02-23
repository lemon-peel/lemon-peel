import { buildProps } from '@lemon-peel/utils';
import Node from './model/node';

import type { PropType, ExtractPropTypes } from 'vue';
import type { TreeOptionProps } from './tree';

export const treeNodeProps = buildProps({
  node: { type: Node, default: () => ({}) },
  props: {
    type: Object as PropType<TreeOptionProps>,
    default: () => ({}),
  },
  accordion: Boolean,
  renderContent: {
    type: Function,
    default: undefined,
  },
  renderAfterExpand: Boolean,
  showCheckbox: {
    type: Boolean,
    default: false,
  },
});

export type TreeNodeProps = Readonly<ExtractPropTypes<typeof treeNodeProps>>;
