import { buildProps } from '@lemon-peel/utils';
import { popperContentProps } from '@lemon-peel/components/popper';
import { POPPER_CONTAINER_SELECTOR, useDelayedToggleProps, useNamespace } from '@lemon-peel/hooks';
import type { ExtractPropTypes } from 'vue';

const ns = useNamespace('tooltip');

export const useTooltipContentProps = buildProps({
  ...useDelayedToggleProps,
  ...popperContentProps,
  appendTo: {
    type: [String, Object] as PropType<string | HTMLElement>,
    default: POPPER_CONTAINER_SELECTOR,
  },
  content: {
    type: String,
    default: '',
  },
  rawContent: {
    type: Boolean,
    default: false,
  },
  persistent: Boolean,
  ariaLabel: String,
  // because model toggle prop is generated dynamically
  // so the typing cannot be evaluated by typescript as type:
  // [name]: { type: Boolean, default: null }
  // so we need to declare that again for type checking.
  visible: {
    type: Boolean as PropType<boolean | null>,
    default: null,
  },
  transition: {
    type: String,
    default: `${ns.namespace.value}-fade-in-linear`,
  },
  teleported: {
    type: Boolean,
    default: true,
  },
  disabled: {
    type: Boolean,
  },
} as const);

export type LpTooltipContentProps = ExtractPropTypes<
  typeof useTooltipContentProps
>;
