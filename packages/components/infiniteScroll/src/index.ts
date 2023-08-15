
import { nextTick } from 'vue';
import { isFunction } from '@vue/shared';
import { throttle } from 'lodash';
import { getOffsetTopDistance, getScrollContainer, throwError } from '@lemon-peel/utils';

import type { ComponentPublicInstance, ObjectDirective } from 'vue';

export const SCOPE = 'LpInfiniteScroll';
export const CHECK_INTERVAL = 50;
export const DEFAULT_DELAY = 200;
export const DEFAULT_DISTANCE = 0;

const attributes = {
  delay: { type: Number, default: DEFAULT_DELAY },
  distance: { type: Number, default: DEFAULT_DISTANCE },
  disabled: { type: Boolean, default: false },
  immediate: { type: Boolean, default: true },
};

type ScrollOptions = {
  delay: number;
  distance: number;
  disabled: boolean;
  immediate: boolean;
};

type InfiniteScrollCallback = () => void;
export type InfiniteScrollElement = HTMLElement & {
  [SCOPE]: {
    container: HTMLElement | Window;
    containerEl: HTMLElement;
    instance: ComponentPublicInstance & Record<string, any>;
    delay: number; // export for test
    lastScrollTop: number;
    cb: InfiniteScrollCallback;
    onScroll: () => void;
    observer?: MutationObserver;
  };
};

const getScrollOptions = (
  element: HTMLElement,
  instance: ComponentPublicInstance & Record<string, any>,
): ScrollOptions => {
  return Object.entries(attributes)
    .reduce((acm, [name, option]) => {
      const { type, default: defaultValue } = option;
      const attributeValue = element.getAttribute(`infinite-scroll-${name}`);
      let value = attributeValue
        ? instance[attributeValue] ?? attributeValue
        : defaultValue;

      value = value === 'false' ? false : value;
      value = type(value);
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      acm[name as keyof ScrollOptions] = Number.isNaN(value) ? defaultValue : value;
      return acm;
    }, {} as ScrollOptions);
};

const destroyObserver = (element: InfiniteScrollElement) => {
  const { observer } = element[SCOPE];

  if (observer) {
    observer.disconnect();
    delete element[SCOPE].observer;
  }
};

const handleScroll = (element: InfiniteScrollElement, callback: InfiniteScrollCallback) => {
  const { container, containerEl, instance, observer, lastScrollTop } =
    element[SCOPE];
  const { disabled, distance } = getScrollOptions(element, instance);
  const { clientHeight, scrollHeight, scrollTop } = containerEl;
  const delta = scrollTop - lastScrollTop;

  element[SCOPE].lastScrollTop = scrollTop;

  // trigger only if full check has done and not disabled and scroll down
  if (observer || disabled || delta < 0) return;

  let shouldTrigger = false;

  if (container === element) {
    shouldTrigger = scrollHeight - (clientHeight + scrollTop) <= distance;
  } else {
    // get the scrollHeight since el might be visible overflow
    const { clientTop, scrollHeight: height } = element;
    const offsetTop = getOffsetTopDistance(element, containerEl);
    shouldTrigger =
      scrollTop + clientHeight >= offsetTop + clientTop + height - distance;
  }

  if (shouldTrigger) {
    callback.call(instance);
  }
};

function checkFull(element: InfiniteScrollElement, callback: InfiniteScrollCallback) {
  const { containerEl, instance } = element[SCOPE];
  const { disabled } = getScrollOptions(element, instance);

  if (disabled || containerEl.clientHeight === 0) return;

  if (containerEl.scrollHeight <= containerEl.clientHeight) {
    callback.call(instance);
  } else {
    destroyObserver(element);
  }
}

const InfiniteScroll: ObjectDirective<
InfiniteScrollElement,
InfiniteScrollCallback
> = {
  async mounted(element, binding) {
    const { instance, value: callback } = binding;

    if (!isFunction(callback)) {
      throwError(SCOPE, "'v-infinite-scroll' binding value must be a function");
    }

    // ensure parentNode mounted
    await nextTick();

    const { delay, immediate } = getScrollOptions(element, instance!);
    const container = getScrollContainer(element, true);
    const containerElement =
      container === window
        ? document.documentElement
        : (container as HTMLElement);
    const onScroll = throttle(handleScroll.bind(null, element, callback), delay);

    if (!container) return;

    element[SCOPE] = {
      instance: instance!,
      container,
      containerEl: containerElement,
      delay,
      cb: callback,
      onScroll,
      lastScrollTop: containerElement.scrollTop,
    };

    if (immediate) {
      const observer = new MutationObserver(
        throttle(checkFull.bind(null, element, callback), CHECK_INTERVAL),
      );
      element[SCOPE].observer = observer;
      observer.observe(element, { childList: true, subtree: true });
      checkFull(element, callback);
    }

    container.addEventListener('scroll', onScroll);
  },
  unmounted(element) {
    const { container, onScroll } = element[SCOPE];

    container?.removeEventListener('scroll', onScroll);
    destroyObserver(element);
  },
  async updated(element) {
    if (!element[SCOPE]) {
      await nextTick();
    }
    const { containerEl, cb, observer } = element[SCOPE];
    if (containerEl.clientHeight && observer) {
      checkFull(element, cb);
    }
  },
};

export default InfiniteScroll;
