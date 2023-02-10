<script lang="ts">
import { defineComponent, h, inject } from 'vue';
import { useNamespace } from '@lemon-peel/hooks';
import { treeNodeContentProps } from './tree';
import { rootTreeKey } from './tokens';

import type { ComponentInternalInstance } from 'vue';

export default defineComponent({
  name: 'LpTreeNodeContent',
  props: treeNodeContentProps,
  setup(props) {
    const ns = useNamespace('tree');
    const nodeInstance = inject<ComponentInternalInstance>('NodeInstance')!;
    const tree = inject(rootTreeKey)!;

    return () => {
      const node = props.node!;
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
