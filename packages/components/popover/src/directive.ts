import type { DirectiveBinding, ObjectDirective } from 'vue';
import type { PopoverInstance } from './popover';

const attachEvents = (element: HTMLElement, binding: DirectiveBinding) => {
  const popperComponent: PopoverInstance = binding.arg || binding.value;
  const popover = popperComponent?.popperRef;
  if (popover) {
    popover.triggerRef = element;
  }
};

export default {
  mounted(element, binding) {
    attachEvents(element, binding);
  },
  updated(element, binding) {
    attachEvents(element, binding);
  },
} as ObjectDirective;

export const VPopover = 'popover';
