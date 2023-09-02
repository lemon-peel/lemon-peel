import { isClient } from '@vueuse/core';
import { getStyle } from './style';

export const isScroll = (element: HTMLElement, isVertical?: boolean): boolean => {
  if (!isClient) return false;

  const key = (
    {
      undefined: 'overflow',
      true: 'overflow-y',
      false: 'overflow-x',
    } as const
  )[String(isVertical)]!;
  const overflow = getStyle(element, key);
  return ['scroll', 'auto', 'overlay'].some(s => overflow.includes(s));
};

export const getScrollContainer = (
  element: HTMLElement,
  isVertical?: boolean,
): Window | HTMLElement | undefined => {
  if (!isClient) return;

  let parent: HTMLElement = element;
  while (parent) {
    if ([window, document, document.documentElement].includes(parent))
      return window;

    if (isScroll(parent, isVertical)) return parent;

    parent = parent.parentNode as HTMLElement;
  }

  return parent;
};

let scrollBarWidth: number;

export const getScrollBarWidth = (namespace?: string): number => {
  if (!isClient) return 0;
  if (scrollBarWidth !== undefined) return scrollBarWidth;

  const outer = document.createElement('div');
  outer.className = `${namespace}-scrollbar__wrap`;
  outer.style.visibility = 'hidden';
  outer.style.width = '100px';
  outer.style.position = 'absolute';
  outer.style.top = '-9999px';
  document.body.append(outer);

  const widthNoScroll = outer.offsetWidth;
  outer.style.overflow = 'scroll';

  const inner = document.createElement('div');
  inner.style.width = '100%';
  outer.append(inner);

  const widthWithScroll = inner.offsetWidth;
  outer.remove();
  scrollBarWidth = widthNoScroll - widthWithScroll;

  return scrollBarWidth;
};

/**
 * Scroll with in the container element, positioning the **selected** element at the top
 * of the container
 */
export function scrollIntoView(
  container: HTMLElement,
  selected: HTMLElement,
): void {
  if (!isClient) return;

  if (!selected) {
    container.scrollTop = 0;
    return;
  }

  const offsetParents: HTMLElement[] = [];
  let pointer = selected.offsetParent;
  while (
    pointer !== null &&
    container !== pointer &&
    container.contains(pointer)
  ) {
    offsetParents.push(pointer as HTMLElement);
    pointer = (pointer as HTMLElement).offsetParent;
  }
  const top =
    selected.offsetTop +
    offsetParents.reduce((previous, current) => previous + current.offsetTop, 0);
  const bottom = top + selected.offsetHeight;
  const viewRectTop = container.scrollTop;
  const viewRectBottom = viewRectTop + container.clientHeight;

  if (top < viewRectTop) {
    container.scrollTop = top;
  } else if (bottom > viewRectBottom) {
    container.scrollTop = bottom - container.clientHeight;
  }
}
