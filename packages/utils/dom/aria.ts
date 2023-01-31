const FOCUSABLE_ELEMENT_SELECTORS = `a[href],button:not([disabled]),button:not([hidden]),:not([tabindex="-1"]),input:not([disabled]),input:not([type="hidden"]),select:not([disabled]),textarea:not([disabled])`;

/**
 * Determine if the testing element is visible on screen no matter if its on the viewport or not
 */
export const isVisible = (element: HTMLElement) => {
  if (process.env.NODE_ENV === 'test') return true;
  const computed = getComputedStyle(element);
  // element.offsetParent won't work on fix positioned
  // WARNING: potential issue here, going to need some expert advices on this issue
  return computed.position === 'fixed' ? false : element.offsetParent !== null;
};

/**
 * @desc Determine if target element is focusable
 * @param element {HTMLElement}
 * @returns {Boolean} true if it is focusable
 */
export const isFocusable = (element: HTMLElement): boolean => {
  if (
    element.tabIndex > 0 ||
    (element.tabIndex === 0 && element.getAttribute('tabIndex') !== null)
  ) {
    return true;
  }
  // HTMLButtonElement has disabled
  if ((element as HTMLButtonElement).disabled) {
    return false;
  }

  switch (element.nodeName) {
    case 'A': {
      // casting current element to Specific HTMLElement in order to be more type precise
      return (
        !!(element as HTMLAnchorElement).href &&
        (element as HTMLAnchorElement).rel !== 'ignore'
      );
    }
    case 'INPUT': {
      return !(
        (element as HTMLInputElement).type === 'hidden' ||
        (element as HTMLInputElement).type === 'file'
      );
    }
    case 'BUTTON':
    case 'SELECT':
    case 'TEXTAREA': {
      return true;
    }
    default: {
      return false;
    }
  }
};

export const obtainAllFocusableElements = (
  element: HTMLElement,
): HTMLElement[] => {
  return [...element.querySelectorAll<HTMLElement>(FOCUSABLE_ELEMENT_SELECTORS)].filter((item: HTMLElement) => isFocusable(item) && isVisible(item));
};

/**
 * @desc Set Attempt to set focus on the current node.
 * @param element
 *          The node to attempt to focus on.
 * @returns
 *  true if element is focused.
 */
export const attemptFocus = (element: HTMLElement): boolean => {
  if (!isFocusable(element)) {
    return false;
  }
  // Remove the old try catch block since there will be no error to be thrown
  element.focus?.();
  return document.activeElement === element;
};

/**
 * Trigger an event
 * mouseenter, mouseleave, mouseover, keyup, change, click, etc.
 * @param  {HTMLElement} elm
 * @param  {String} name
 * @param  {*} opts
 */
export const triggerEvent = function (
  elm: HTMLElement,
  name: string,
  ...options: Array<boolean>
): HTMLElement {
  let eventName: string;

  if (name.includes('mouse') || name.includes('click')) {
    eventName = 'MouseEvents';
  } else if (name.includes('key')) {
    eventName = 'KeyboardEvent';
  } else {
    eventName = 'HTMLEvents';
  }
  const event_ = document.createEvent(eventName);

  event_.initEvent(name, ...options);
  elm.dispatchEvent(event_);
  return elm;
};

export const isLeaf = (element: HTMLElement) => !element.getAttribute('aria-owns');

export const getSibling = (
  element: HTMLElement,
  distance: number,
  elementClass: string,
) => {
  const { parentNode } = element;
  if (!parentNode) return null;
  const siblings = parentNode.querySelectorAll(elementClass);
  const index = Array.prototype.indexOf.call(siblings, element);
  return siblings[index + distance] || null;
};

export const focusNode = (element: HTMLElement) => {
  if (!element) return;
  element.focus();
  !isLeaf(element) && element.click();
};
