import { createVNode, defineComponent, h, renderSlot } from 'vue';
import { PatchFlags, buildProps } from '@lemon-peel/utils';
import { useNamespace, useSameTarget } from '@lemon-peel/hooks';

import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';
import type { ZIndexProperty } from 'csstype';

export const overlayProps = buildProps({
  mask: { type: Boolean, default: true },
  customMaskEvent: { type: Boolean, default: false },
  overlayClass: { type: [String, Array, Object] as PropType<string | string[] | Record<string, boolean>> },
  zIndex: { type: [String, Number] as PropType<ZIndexProperty> },
});

export type OverlayProps = ExtractPropTypes<typeof overlayProps>;

export const overlayEmits = {
  click: (event_: MouseEvent) => event_ instanceof MouseEvent,
};
export type OverlayEmits = typeof overlayEmits;

export default defineComponent({
  name: 'LpOverlay',

  props: overlayProps,
  emits: overlayEmits,

  setup(props, { slots, emit }) {
    const ns = useNamespace('overlay');

    const onMaskClick = (e: MouseEvent) => {
      emit('click', e);
    };

    const { onClick, onMousedown, onMouseup } = useSameTarget(
      props.customMaskEvent ? undefined : onMaskClick,
    );

    // init here
    return () => {
      // when the vnode meets the same structure but with different change trigger
      // it will not automatically update, thus we simply use h function to manage updating
      return props.mask
        ? createVNode(
          'div',
          {
            class: [ns.b(), props.overlayClass],
            style: {
              zIndex: props.zIndex,
            },
            onClick,
            onMousedown,
            onMouseup,
          },
          [renderSlot(slots, 'default')],
          PatchFlags.STYLE | PatchFlags.CLASS | PatchFlags.PROPS,
          ['onClick', 'onMouseup', 'onMousedown'],
        )
        : h(
          'div',
          {
            class: props.overlayClass,
            style: {
              zIndex: props.zIndex,
              position: 'fixed',
              top: '0px',
              right: '0px',
              bottom: '0px',
              left: '0px',
            } as CSSProperties,
          },
          [renderSlot(slots, 'default')],
        );
    };
  },
});
