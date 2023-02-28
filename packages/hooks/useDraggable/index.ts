import { onBeforeUnmount, onMounted, watchEffect } from 'vue';
import { addUnit } from '@lemon-peel/utils';
import type { ComputedRef, Ref } from 'vue';

export const useDraggable = (
  targetReference: Ref<HTMLElement>,
  dragReference: Ref<HTMLElement | null>,
  draggable: ComputedRef<boolean>,
) => {
  let transform = {
    offsetX: 0,
    offsetY: 0,
  };

  const onMousedown = (downEvent: MouseEvent) => {
    const downX = downEvent.clientX;
    const downY = downEvent.clientY;
    const { offsetX, offsetY } = transform;

    const targetRect = targetReference.value.getBoundingClientRect();
    const targetLeft = targetRect.left;
    const targetTop = targetRect.top;
    const targetWidth = targetRect.width;
    const targetHeight = targetRect.height;

    const clientWidth = document.documentElement.clientWidth;
    const clientHeight = document.documentElement.clientHeight;

    const minLeft = -targetLeft + offsetX;
    const minTop = -targetTop + offsetY;
    const maxLeft = clientWidth - targetLeft - targetWidth + offsetX;
    const maxTop = clientHeight - targetTop - targetHeight + offsetY;

    const onMousemove = (moveEvent: MouseEvent) => {
      const moveX = Math.min(
        Math.max(offsetX + moveEvent.clientX - downX, minLeft),
        maxLeft,
      );
      const moveY = Math.min(
        Math.max(offsetY + moveEvent.clientY - downY, minTop),
        maxTop,
      );

      transform = {
        offsetX: moveX,
        offsetY: moveY,
      };
      targetReference.value!.style.transform = `translate(${addUnit(
        moveX,
      )}, ${addUnit(moveY)})`;
    };

    const onMouseup = () => {
      document.removeEventListener('mousemove', onMousemove);
      document.removeEventListener('mouseup', onMouseup);
    };

    document.addEventListener('mousemove', onMousemove);
    document.addEventListener('mouseup', onMouseup);
  };

  const onDraggable = () => {
    if (dragReference.value && targetReference.value) {
      dragReference.value.addEventListener('mousedown', onMousedown);
    }
  };

  const offDraggable = () => {
    if (dragReference.value && targetReference.value) {
      dragReference.value.removeEventListener('mousedown', onMousedown);
    }
  };

  onMounted(() => {
    watchEffect(() => {
      if (draggable.value) {
        onDraggable();
      } else {
        offDraggable();
      }
    });
  });

  onBeforeUnmount(() => {
    offDraggable();
  });
};
