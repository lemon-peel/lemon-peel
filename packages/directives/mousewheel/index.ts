import normalizeWheel from 'normalize-wheel-es';

import type { DirectiveBinding, ObjectDirective } from 'vue';
import type { NormalizedWheelEvent } from 'normalize-wheel-es';

const mousewheel = function (
  element: HTMLElement,
  callback: (e: WheelEvent, normalized: NormalizedWheelEvent) => void,
) {
  if (element && element.addEventListener) {
    element.addEventListener(
      'wheel',
      function (this: HTMLElement, event: WheelEvent) {
        const normalized = normalizeWheel(event);
        callback && Reflect.apply(callback, this, [event, normalized]);
      },
      { passive: true },
    );
  }
};

const Mousewheel: ObjectDirective = {
  beforeMount(element: HTMLElement, binding: DirectiveBinding) {
    mousewheel(element, binding.value);
  },
};

export default Mousewheel;
