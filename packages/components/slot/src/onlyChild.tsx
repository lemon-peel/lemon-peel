import { Comment, Fragment, Text, cloneVNode, defineComponent, inject, withDirectives } from 'vue';
import { NOOP, isObject } from '@vue/shared';
import { FORWARD_REF_INJECTION_KEY, useForwardRefDirective, useNamespace } from '@lemon-peel/hooks';
import { debugWarn } from '@lemon-peel/utils';

import type { Ref, VNode } from 'vue';

const NAME = 'LpOnlyChild';

function wrapTextContent(s: string | VNode) {
  const ns = useNamespace('only-child');
  return <span class={ns.e('content')}>{s}</span>;
}

function findFirstLegitChild(arr: VNode[] | undefined): VNode | null {
  if (!arr) return null;
  const children = arr as VNode[];
  for (const child of children) {
    /**
     * when user uses h(Fragment, [text]) to render plain string,
     * this switch case just cannot handle, when the value is primitives
     * we should just return the wrapped string
     */
    if (isObject(child)) {
      switch (child.type) {
        case Comment: {
          continue;
        }
        case Text:
        case 'svg': {
          return wrapTextContent(child);
        }
        case Fragment: {
          return findFirstLegitChild(child.children as VNode[]);
        }
        default: {
          return child;
        }
      }
    }
    return wrapTextContent(child);
  }
  return null;
}

export const OnlyChild = defineComponent({
  name: NAME,
  setup(_, { slots, attrs }) {
    const forwardRefInjection = inject(FORWARD_REF_INJECTION_KEY);
    const forwardRefDirective = useForwardRefDirective(
      forwardRefInjection?.setForwardRef ?? NOOP,
    );
    return () => {
      const defaultSlot = slots.default?.(attrs);
      if (!defaultSlot) return null;

      if (defaultSlot.length > 1) {
        debugWarn(NAME, 'requires exact only one valid child.');
        return null;
      }

      const firstLegitNode = findFirstLegitChild(defaultSlot);
      if (!firstLegitNode) {
        debugWarn(NAME, 'no valid child node found');
        return null;
      }

      return withDirectives(cloneVNode(firstLegitNode!, attrs), [
        [forwardRefDirective],
      ]);
    };
  },
});

export type OnlyChildExpose = {
  forwardRef: Ref<HTMLElement>;
};
