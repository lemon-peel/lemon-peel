
import { defineComponent, getCurrentInstance } from 'vue';
import { useNamespace } from '@lemon-peel/hooks/src';
import type CascaderNode from './Node.vue';
export default defineComponent({
  name: 'NodeContent',
  setup() {
    const ns = useNamespace('cascader-node');
    const inc = getCurrentInstance()!;
    const { node, panel } = inc.parent!.proxy as InstanceType<typeof CascaderNode>;
    const { data, label } = node;
    const { renderLabelFn } = panel;

    return () => (<span class={ns.e('label')}>
      {renderLabelFn ? renderLabelFn({ node, data }) : label}
      </span>);
  },
});
