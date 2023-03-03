import { defineComponent, inject } from 'vue';
import { useNamespace } from '@lemon-peel/hooks/src';
import { ROOT_TREE_INJECTION_KEY, treeNodeContentProps } from './virtualTree';

export default defineComponent({
  name: 'LpTreeNodeContent',
  props: treeNodeContentProps,
  setup(props) {
    const tree = inject(ROOT_TREE_INJECTION_KEY)!;
    const ns = useNamespace('tree');
    return () => {
      const node = props.node;
      const { data } = node!;
      return tree.ctx.slots.default
        ? tree.ctx.slots.default({ node, data })
        : <span class={ns.be('node', 'label')}>{node?.label}</span>;
    };
  },
});
