<script lang="ts">
import { defineComponent, h, inject } from 'vue';
import { useNamespace } from '@lemon-peel/hooks';

import type { ComponentInternalInstance } from 'vue';
import type { RootTreeType } from './tree.type';

export default defineComponent({
  name: 'LpTreeNodeContent',
  props: {
    node: {
      type: Object,
      required: true,
    },
    renderContent: {
      type: Function,
      default: undefined,
    },
  },
  setup(props) {
    const ns = useNamespace('tree');
    const nodeInstance = inject<ComponentInternalInstance>('NodeInstance');
    const tree = inject<RootTreeType>('RootTree');
    return () => {
      const node = props.node;
      const { data, store } = node;
      return props.renderContent
        ? props.renderContent(h, { _self: nodeInstance, node, data, store })
        : (tree.ctx.slots.default
          ? tree.ctx.slots.default({ node, data })
          : h('span', { class: ns.be('node', 'label') }, [node.label]));
    };
  },
});
</script>
