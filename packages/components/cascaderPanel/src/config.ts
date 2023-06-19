import { computed } from 'vue';
import { NOOP } from '@vue/shared';

import type { PropType } from 'vue';
import type { CascaderConfig, CascaderOption, CascaderProps, CascaderValue } from './node';
import { buildProps } from '@lemon-peel/utils';

export const commonProps = buildProps({
  value: { type: [Number, String, Array] as PropType<CascaderValue> },
  options: {
    type: Array as PropType<CascaderOption[]>,
    default: () => [] as CascaderOption[],
  },
  config: {
    type: Object as PropType<CascaderProps>,
    default: () => ({} as CascaderProps),
  },
});

export const DefaultProps: CascaderConfig = {
  expandTrigger: 'click',
  multiple: false,
  checkStrictly: false, // whether all nodes can be selected
  emitPath: true, // wether to emit an array of all levels value in which node is located
  lazy: false,
  lazyLoad: NOOP,
  valueKey: 'value',
  labelKey: 'label',
  childrenKey: 'children',
  leaf: 'leaf',
  disabled: 'disabled',
  hoverThreshold: 500,
};

export const useCascaderConfig = (props: { config: CascaderProps }) => {
  return computed(() => ({
    ...DefaultProps,
    ...props.config,
  }));
};
