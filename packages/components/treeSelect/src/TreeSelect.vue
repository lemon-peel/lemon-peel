<script lang="ts">
import { computed, defineComponent, h, onMounted, reactive, ref } from 'vue';
import { pick } from 'lodash-unified';
import LpSelect, { selectProps } from '@lemon-peel/components/select';
import LpTree from '@lemon-peel/components/tree';
import { useSelect } from './select';
import { useTree } from './tree';

export default defineComponent({
  name: 'LpTreeSelect',
  // disable `LpSelect` inherit current attrs
  inheritAttrs: false,
  props: {
    ...selectProps,
    ...LpTree.props,
  },
  setup(props, context) {
    const { slots, expose } = context;

    const select = ref<InstanceType<typeof LpSelect>>();
    const tree = ref<InstanceType<typeof LpTree>>();

    const key = computed(() => props.nodeKey || props.valueKey || 'value');

    const selectProperties = useSelect(props, context, { select, tree, key });
    const treeProperties = useTree(props, context, { select, tree, key });

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

    return () =>
      h(
        LpSelect,
        /**
         * 1. The `props` is processed into `Refs`, but `v-bind` and
         * render function props cannot read `Refs`, so use `reactive`
         * unwrap the `Refs` and keep reactive.
         * 2. The keyword `ref` requires `Ref`, but `reactive` broke it,
         * so use function.
         */
        reactive({
          ...selectProperties,
          ref: reference => (select.value = reference),
        }),
        {
          ...slots,
          default: () =>
            h(
              LpTree,
              reactive({
                ...treeProperties,
                ref: reference => (tree.value = reference),
              }),
            ),
        },
      );
  },
});
</script>
