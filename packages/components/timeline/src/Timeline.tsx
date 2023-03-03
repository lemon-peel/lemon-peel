import { defineComponent, provide, renderSlot } from 'vue';
import { useNamespace } from '@lemon-peel/hooks/src';

const Timeline = defineComponent({
  name: 'LpTimeline',
  setup(_, { slots }) {
    const ns = useNamespace('timeline');

    provide('timeline', slots);

    /**
     *  Maybe ,this component will not support prop 'reverse', why ?
     *
     *  Example 1:
     *   <component-a>
     *     <div>1</div>
     *     <div>2</div>
     *   </component-a>
     *
     *  Example 2:
     *   <component-a>
     *     <div v-for="i in 2" :key="i">{{ i }}</div>
     *   </component-a>
     *
     *  'slots.default()' value in example 1 just like [Vnode, Vnode]
     *  'slots.default()' value in example 2 just like [Vnode]
     *
     *   so i can't reverse the slots, when i use 'v-for' directive.
     */

    return () => {
      return <ul class={[ns.b()]}>{renderSlot(slots, 'default')}</ul>;
    };
  },
});

export default Timeline;
export type TimelineInstance = InstanceType<typeof Timeline>;
