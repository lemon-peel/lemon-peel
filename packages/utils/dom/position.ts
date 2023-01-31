import { isClient } from '@vueuse/core';

export const isInContainer = (
  element?: Element,
  container?: Element | Window,
): boolean => {
  if (!isClient || !element || !container) return false;

  const elementRect = element.getBoundingClientRect();

  let containerRect: Pick<DOMRect, 'top' | 'bottom' | 'left' | 'right'>;
  containerRect = container instanceof Element ? container.getBoundingClientRect() : {
    top: 0,
    right: window.innerWidth,
    bottom: window.innerHeight,
    left: 0,
  };
  return (
    elementRect.top < containerRect.bottom &&
    elementRect.bottom > containerRect.top &&
    elementRect.right > containerRect.left &&
    elementRect.left < containerRect.right
  );
};

export const getOffsetTop = (element: HTMLElement) => {
  let offset = 0;
  let parent = element;

  while (parent) {
    offset += parent.offsetTop;
    parent = parent.offsetParent as HTMLElement;
  }

  return offset;
};

export const getOffsetTopDistance = (
  element: HTMLElement,
  containerElement: HTMLElement,
) => {
  return Math.abs(getOffsetTop(element) - getOffsetTop(containerElement));
};

export const getClientXY = (event: MouseEvent | TouchEvent) => {
  let clientX: number;
  let clientY: number;
  if (event.type === 'touchend') {
    clientY = (event as TouchEvent).changedTouches[0].clientY;
    clientX = (event as TouchEvent).changedTouches[0].clientX;
  } else if (event.type.startsWith('touch')) {
    clientY = (event as TouchEvent).touches[0].clientY;
    clientX = (event as TouchEvent).touches[0].clientX;
  } else {
    clientY = (event as MouseEvent).clientY;
    clientX = (event as MouseEvent).clientX;
  }
  return {
    clientX,
    clientY,
  };
};
