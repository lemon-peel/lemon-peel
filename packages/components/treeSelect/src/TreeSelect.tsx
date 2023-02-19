
import { computed, defineComponent, onMounted, reactive, ref } from 'vue';
import { pick } from 'lodash-es';
import { unrefs } from '@lemon-peel/utils';
import LpSelect from '@lemon-peel/components/select';
import LpTree from '@lemon-peel/components/tree';

import { treeEmits, treeSelectProps, useTree, useSelect } from './hooks';

export default defineComponent({
  name: 'LpTreeSelect',
  // disable `LpSelect` inherit current attrs
  inheritAttrs: false,
  props: treeSelectProps,
  emits: treeEmits,
  setup(props, context) {
    const { slots, expose } = context;

    const select = ref<InstanceType<typeof LpSelect>>(null as any);
    const tree = ref<InstanceType<typeof LpTree>>(null as any);
    const key = computed(() => props.nodeKey || props.valueKey || 'value');

    const selectProps = useSelect(props, context, { select, tree, key });
    const treeProps = useTree(props, context, { select, tree, key });

    // expose LpTree/LpSelect methods
    const methods = reactive({});
    expose(methods);
    onMounted(() => {
      Object.assign(methods, {
        ...pick(tree.value, [
          'filter',
          'updateKeyChildren',
          'getCheckedNodes',
          'setCheckedNodes',
          'getCheckedKeys',
          'setCheckedKeys',
          'setChecked',
          'getHalfCheckedNodes',
          'getHalfCheckedKeys',
          'getCurrentKey',
          'getCurrentNode',
          'setCurrentKey',
          'setCurrentNode',
          'getNode',
          'remove',
          'append',
          'insertBefore',
          'insertAfter',
        ]),
        ...pick(select.value, ['focus', 'blur']),
      });
    });

    return () => (<LpSelect v-slots={slots} ref={select} {...unrefs(selectProps)}>
      <LpTree ref={tree} {...unrefs(treeProps)}></LpTree>
    </LpSelect>);
  },
});
