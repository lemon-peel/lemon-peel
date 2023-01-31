import { computed, defineComponent, h, renderSlot } from 'vue';
import { buildProps } from '@lemon-peel/utils';
import { useNamespace } from '@lemon-peel/hooks';

import type { ExtractPropTypes } from 'vue';

const spaceItemProps = buildProps({
  prefixCls: {
    type: String,
  },
} as const);
export type SpaceItemProps = ExtractPropTypes<typeof spaceItemProps>;

const SpaceItem = defineComponent({
  name: 'LpSpaceItem',

  props: spaceItemProps,

  setup(props, { slots }) {
    const ns = useNamespace('space');

    const classes = computed(() => `${props.prefixCls || ns.b()}__item`);

    return () =>
      h('div', { class: classes.value }, renderSlot(slots, 'default'));
  },
});
export type SpaceItemInstance = InstanceType<typeof SpaceItem>;

export default SpaceItem;
