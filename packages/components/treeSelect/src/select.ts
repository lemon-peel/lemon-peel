
import { computed, nextTick, toRefs } from 'vue';
import { pick } from 'lodash-unified';
import LpSelect from '@lemon-peel/components/select';
import { useNamespace } from '@lemon-peel/hooks';
import type { Ref } from 'vue';
import type LpTree from '@lemon-peel/components/tree';

export const useSelect = (
  props,
  { attrs },
  {
    tree,
    key,
  }: {
    select: Ref<InstanceType<typeof LpSelect> | undefined>;
    tree: Ref<InstanceType<typeof LpTree> | undefined>;
    key: Ref<string>;
  },
) => {
  const ns = useNamespace('tree-select');

  const result = {
    ...pick(toRefs(props), Object.keys(LpSelect.props)),
    ...attrs,
    valueKey: key,
    popperClass: computed(() => {
      const classes = [ns.e('popper')];
      if (props.popperClass) classes.push(props.popperClass);
      return classes.join(' ');
    }),
    filterMethod: (keyword = '') => {
      if (props.filterMethod) props.filterMethod(keyword);

      nextTick(() => {
        // let tree node expand only, same with tree filter
        tree.value?.filter(keyword);
      });
    },
    // clear filter text when visible change
    onVisibleChange: (visible: boolean) => {
      attrs.onVisibleChange?.(visible);

      if (props.filterable && visible) {
        result.filterMethod();
      }
    },
  };

  return result;
};
