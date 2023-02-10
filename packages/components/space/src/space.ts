import { createTextVNode, createVNode, defineComponent, isVNode, renderSlot } from 'vue';
import { isString } from '@vue/shared';
import { PatchFlags, buildProps, definePropType, isArray, isFragment, isNumber, isValidElementNode } from '@lemon-peel/utils';
import { componentSizes } from '@lemon-peel/constants';

import Item from './item';
import { useSpace } from './useSpace';

import type { ExtractPropTypes, StyleValue, VNode, VNodeArrayChildren, VNodeChild } from 'vue';
import type { Arrayable } from '@lemon-peel/utils';
import type { AlignItemsProperty } from 'csstype';

export const spaceProps = buildProps({
  direction: {
    type: String,
    values: ['horizontal', 'vertical'],
    default: 'horizontal',
  },

  class: {
    type: definePropType<Arrayable<Record<string, boolean> | string>>([
      String,
      Object,
      Array,
    ]),
    default: '',
  },

  style: {
    type: definePropType<StyleValue>([String, Array, Object]),
    default: '',
  },

  alignment: {
    type: definePropType<AlignItemsProperty>(String),
    default: 'center',
  },

  prefixCls: {
    type: String,
  },

  spacer: {
    type: definePropType<VNodeChild>([Object, String, Number, Array]),
    default: null,
    validator: (value: unknown) => isVNode(value) || isNumber(value) || isString(value),
  },

  wrap: Boolean,

  fill: Boolean,

  fillRatio: {
    type: Number,
    default: 100,
  },

  size: {
    type: [String, Array, Number],
    values: componentSizes,
    validator: (value: unknown): value is [number, number] | number => {
      return (
        isNumber(value) ||
        (isArray(value) && value.length === 2 && value.every(isNumber))
      );
    },
  },
} as const);

export type SpaceProps = ExtractPropTypes<typeof spaceProps>;

export default defineComponent({
  name: 'LpSpace',

  props: spaceProps,

  setup(props, { slots }) {
    const { classes, containerStyle, itemStyle } = useSpace(props);

    // retrieve the children out via a simple for loop
    // the edge case here is that when users uses directives like <v-for>, <v-if>
    // we need to go deeper until the child is not the Fragment type
    function extractChildren(
      children: VNodeArrayChildren,
      parentKey = '',
      extractedChildren: VNode[] = [],
    ) {
      const { prefixCls } = props;
      for (const [loopKey, child] of children.entries()) {
        if (isFragment(child)) {
          if (isArray(child.children)) {
            for (const [key, nested] of child.children.entries()) {
              if (isFragment(nested) && isArray(nested.children)) {
                extractChildren(
                  nested.children,
                  `${parentKey + key}-`,
                  extractedChildren,
                );
              } else {
                extractedChildren.push(
                  createVNode(
                    Item,
                    {
                      style: itemStyle.value,
                      prefixCls,
                      key: `nested-${parentKey + key}`,
                    },
                    {
                      default: () => [nested],
                    },
                    PatchFlags.PROPS | PatchFlags.STYLE,
                    ['style', 'prefixCls'],
                  ),
                );
              }
            }
          }
          // if the current child is valid vnode, then append this current vnode
          // to item as child node.
        } else if (isValidElementNode(child)) {
          extractedChildren.push(
            createVNode(
              Item,
              {
                style: itemStyle.value,
                prefixCls,
                key: `LoopKey${parentKey + loopKey}`,
              },
              {
                default: () => [child],
              },
              PatchFlags.PROPS | PatchFlags.STYLE,
              ['style', 'prefixCls'],
            ),
          );
        }
      }

      return extractedChildren;
    }

    return () => {
      const { spacer, direction } = props;

      const children = renderSlot(slots, 'default', { key: 0 }, () => []);

      if ((children.children ?? []).length === 0) return null;
      // loop the children, if current children is rendered via `renderList` or `<v-for>`
      if (isArray(children.children)) {
        let extractedChildren = extractChildren(children.children);

        if (spacer) {
          // track the current rendering index, when encounters the last element
          // then no need to add a spacer after it.
          const len = extractedChildren.length - 1;
          extractedChildren = extractedChildren.reduce<VNode[]>((accumulator, child, index) => {
            const list = [...accumulator, child];
            if (index !== len) {
              list.push(
                createVNode(
                  'span',
                  // adding width 100% for vertical alignment,
                  // when the spacer inherit the width from the
                  // parent, this span's width was not set, so space
                  // might disappear
                  {
                    style: [
                      itemStyle.value,
                      direction === 'vertical' ? 'width: 100%' : null,
                    ],
                    key: index,
                  },
                  [
                    // if spacer is already a valid vnode, then append it to the current
                    // span element.
                    // otherwise, treat it as string.
                    isVNode(spacer)
                      ? spacer
                      : createTextVNode(spacer as string, PatchFlags.TEXT),
                  ],
                  PatchFlags.STYLE,
                ),
              );
            }
            return list;
          }, []);
        }

        // spacer container.
        return createVNode(
          'div',
          {
            class: classes.value,
            style: containerStyle.value,
          },
          extractedChildren,
          PatchFlags.STYLE | PatchFlags.CLASS,
        );
      }

      return children.children;
    };
  },
});
