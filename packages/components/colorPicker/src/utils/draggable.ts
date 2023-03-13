import { isClient } from '@vueuse/core';

let isDragging = false;

export interface DraggableOptions {
  drag?: (event: MouseEvent | TouchEvent) => void;
  start?: (event: MouseEvent | TouchEvent) => void;
  end?: (event: MouseEvent | TouchEvent) => void;
}

export function draggable(element: HTMLElement, options: DraggableOptions) {
  if (!isClient) return;

  const moveFn = function (event: MouseEvent | TouchEvent) {
    options.drag?.(event);
  };

  const upFn = function (event: MouseEvent | TouchEvent) {
    document.removeEventListener('mousemove', moveFn);
    document.removeEventListener('mouseup', upFn);
    document.removeEventListener('touchmove', moveFn);
    document.removeEventListener('touchend', upFn);
    /* eslint-disable unicorn/prefer-add-event-listener */
    document.onselectstart = null;
    document.ondragstart = null;
    /* eslint-enable unicorn/prefer-add-event-listener */

    isDragging = false;

    options.end?.(event);
  };

  const downFn = function (event: MouseEvent | TouchEvent) {
    if (isDragging) return;
    event.preventDefault();
    document.addEventListener('selectstart', () => false);
    document.addEventListener('dragstart', () => false);
    document.addEventListener('mousemove', moveFn);
    document.addEventListener('mouseup', upFn);
    document.addEventListener('touchmove', moveFn);
    document.addEventListener('touchend', upFn);

    isDragging = true;

    options.start?.(event);
  };

  element.addEventListener('mousedown', downFn);
  element.addEventListener('touchstart', downFn);
}
