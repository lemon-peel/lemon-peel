
import { computed, nextTick, toRefs, watch } from 'vue';
import { isEqual, pick } from 'lodash-es';
import { UPDATE_MODEL_EVENT } from '@lemon-peel/constants';
import { buildProps, isFunction } from '@lemon-peel/utils';
import { selectProps } from '@lemon-peel/components/select';
import { useNamespace } from '@lemon-peel/hooks';
import LpTree, { treeProps } from '@lemon-peel/components/tree';

import { isValidArray, isValidValue, toValidArray, treeFind } from './utils';
import TreeSelectOption from './treeSelectOption';

import type { ExtractPropTypes, SetupContext, Ref, h as vueRender } from 'vue';
import type { FilterNodeMethodFunction, TreeNodeContentRender, LpTreeNode, TreeKey } from '@lemon-peel/components/tree';
import type Node from '@lemon-peel/components/tree/src/model/node';
import type LpSelect from '@lemon-peel/components/select';
import type { TreeNodeData } from './utils';

export const treeEmits = ['node-click'];

export const treeSelectProps = buildProps({
  ...selectProps,
  ...treeProps,
});

export type TreeSelectProps = Readonly<ExtractPropTypes<typeof treeSelectProps>>;

export type TreeContext = SetupContext<typeof treeEmits>;
export type TreeRefs = {
  select: Ref<InstanceType<typeof LpSelect>>;
  tree: Ref<InstanceType<typeof LpTree>>;
  key: Ref<string>;
};

export const useSelect = (
  props: TreeSelectProps,
  { attrs, emit }: TreeContext,
  { tree, key }: TreeRefs,
) => {

  const ns = useNamespace('tree-select');

  const filterMethod = (keyword = '') => {
    if (props.filterMethod) props.filterMethod(keyword);

    nextTick(() => {
      // let tree node expand only, same with tree filter
      tree.value?.filter(keyword);
    });
  };

  return {
    ...pick(toRefs(props), Object.keys(selectProps)),
    ...attrs,
    valueKey: key,
    filterMethod,
    popperClass: computed(() => {
      const classes = [ns.e('popper')];
      if (props.popperClass) classes.push(props.popperClass);
      return classes.join(' ');
    }),

    // clear filter text when visible change
    onVisibleChange: (visible: boolean) => {
      emit('visible-change', visible);

      if (props.filterable && visible) {
        filterMethod();
      }
    },
  };
};


export const useTree = (
  props: TreeSelectProps,
  { attrs, emit, slots }: TreeContext,
  { select, tree, key }: TreeRefs,
) => {
  watch(
    () => props.modelValue,
    () => {
      if (props.showCheckbox) {
        nextTick(() => {
          const treeIns = tree.value;
          if (
            treeIns &&
            !isEqual(
              treeIns.getCheckedKeys(),
              toValidArray(props.modelValue),
            )
          ) {
            treeIns.setCheckedKeys(toValidArray(props.modelValue));
          }
        });
      }
    },
    { immediate: true, deep: true },
  );

  const propsMap = computed(() => ({
    value: key.value,
    label: 'label',
    children: 'children',
    disabled: 'disabled',
    isLeaf: 'isLeaf',
    ...props.props,
  }));

  const getNodeValByProp = (
    prop: 'value' | 'label' | 'children' | 'disabled' | 'isLeaf',
    data: TreeNodeData,
  ): any => {
    const propVal = propsMap.value[prop];
    return isFunction(propVal) ? (propVal(
      data,
      tree.value.getNode(getNodeValByProp('value', data)) as Node,
    )) : data[propVal as string];
  };

  const defaultExpandedParentKeys = toValidArray(props.modelValue)
    .map(value => {
      return treeFind(
        props.data || [],
        data => getNodeValByProp('value', data) === value,
        data => getNodeValByProp('children', data),
        (data, index, array, parent) =>
          parent && getNodeValByProp('value', parent),
      );
    })
    .filter(item => isValidValue(item));

  return {
    ...pick(toRefs(props), Object.keys(LpTree.props)),
    ...attrs,
    nodeKey: key,

    // only expand on click node when the `check-strictly` is false
    expandOnClickNode: computed(() => {
      return !props.checkStrictly && props.expandOnClickNode;
    }),

    // show current selected node only first time,
    // fix the problem of expanding multiple nodes when checking multiple nodes
    defaultExpandedKeys: computed(() => {
      return props.defaultExpandedKeys
        ? props.defaultExpandedKeys.concat(defaultExpandedParentKeys)
        : defaultExpandedParentKeys;
    }),

    renderContent: ((h: typeof vueRender, { node, data, store }) => {
      return h(
        TreeSelectOption,
        {
          value: getNodeValByProp('value', data),
          label: getNodeValByProp('label', data),
          disabled: getNodeValByProp('disabled', data),
        },
        props.renderContent
          ? () => props.renderContent!(h, { node, data, store })
          : (slots.default
            ? () => slots.default!({ node, data, store })
            : undefined),
      );
    }) as TreeNodeContentRender,

    filterNodeMethod: ((value, data, node) => {
      if (props.filterNodeMethod)
        return props.filterNodeMethod(value, data, node);
      if (!value) return true;
      return getNodeValByProp('label', data)?.includes(value);
    }) as FilterNodeMethodFunction,

    onNodeClick: (data: TreeNodeData, node: Node, nodeIns: InstanceType<typeof LpTreeNode>) => {
      emit('node-click', data, node, nodeIns);

      // `onCheck` is trigger when `checkOnClickNode`
      if (props.showCheckbox && props.checkOnClickNode) return;

      // now `checkOnClickNode` is false, only no checkbox and `checkStrictly` or `isLeaf`
      if (!props.showCheckbox && (props.checkStrictly || node.isLeaf)) {
        if (!getNodeValByProp('disabled', data)) {
          const option = select.value.options.get(
            getNodeValByProp('value', data),
          );
          select.value.handleOptionSelect(option, true);
        }
      } else if (props.expandOnClickNode) {
        nodeIns.handleExpandIconClick();
      }
    },

    onCheck: (
      data: TreeNodeData,
      params: {
        checkedNodes: TreeNodeData[];
        checkedKeys: TreeKey[];
        halfCheckedNodes: TreeNodeData[];
        halfCheckedKeys: TreeKey[];
      },
    ) => {
      emit('check', data, params);

      const dataValue = getNodeValByProp('value', data);
      if (props.checkStrictly) {
        emit(
          UPDATE_MODEL_EVENT,
          // Checking for changes may come from `check-on-node-click`
          props.multiple
            ? params.checkedKeys
            : (params.checkedKeys.includes(dataValue)
              ? dataValue
              : undefined),
        );
      } else {
        // only can select leaf node
        if (props.multiple) {
          emit(
            UPDATE_MODEL_EVENT,
            (tree.value as InstanceType<typeof LpTree>).getCheckedKeys(true),
          );
        } else {
          // select first leaf node when check parent
          const firstLeaf = treeFind(
            [data],
            data =>
              !isValidArray(getNodeValByProp('children', data)) &&
              !getNodeValByProp('disabled', data),
            data => getNodeValByProp('children', data),
          );
          const firstLeafKey = firstLeaf
            ? getNodeValByProp('value', firstLeaf)
            : undefined;

          // unselect when any child checked
          const hasCheckedChild =
            isValidValue(props.modelValue) &&
            !!treeFind(
              [data],
              data => getNodeValByProp('value', data) === props.modelValue,
              data => getNodeValByProp('children', data),
            );

          emit(
            UPDATE_MODEL_EVENT,
            firstLeafKey === props.modelValue || hasCheckedChild
              ? undefined
              : firstLeafKey,
          );
        }
      }
    },
  };
};
