import { isClient } from '@vueuse/core';
import { isElement } from '@lemon-peel/utils';

import type { ComponentPublicInstance, DirectiveBinding, ObjectDirective } from 'vue';

type DocumentHandler = <T extends MouseEvent>(mouseup: T, mousedown: T) => void;
type FlushList = Map<
HTMLElement,
{
  documentHandler: DocumentHandler;
  bindingFn: (...arguments_: unknown[]) => unknown;
}[]
>;

const nodeList: FlushList = new Map();

let startClick: MouseEvent;

if (isClient) {
  document.addEventListener('mousedown', (e: MouseEvent) => (startClick = e));
  document.addEventListener('mouseup', (e: MouseEvent) => {
    for (const handlers of nodeList.values()) {
      for (const { documentHandler } of handlers) {
        documentHandler(e as MouseEvent, startClick);
      }
    }
  });
}

function createDocumentHandler(
  element: HTMLElement,
  binding: DirectiveBinding,
): DocumentHandler {
  let excludes: HTMLElement[] = [];
  if (Array.isArray(binding.arg)) {
    excludes = binding.arg;
  } else if (isElement(binding.arg)) {
    // due to current implementation on binding type is wrong the type casting is necessary here
    excludes.push(binding.arg as unknown as HTMLElement);
  }
  return function (mouseup, mousedown) {
    const popperReference = (
      binding.instance as ComponentPublicInstance<{
        popperRef: HTMLElement;
      }>
    ).popperRef;
    const mouseUpTarget = mouseup.target as Node;
    const mouseDownTarget = mousedown?.target as Node;
    const isBound = !binding || !binding.instance;
    const isTargetExists = !mouseUpTarget || !mouseDownTarget;
    const isContainedByElement =
      element.contains(mouseUpTarget) || element.contains(mouseDownTarget);
    const isSelf = element === mouseUpTarget;

    const isTargetExcluded =
      (excludes.some(item => item?.contains(mouseUpTarget))) ||
      (excludes.length > 0 && excludes.includes(mouseDownTarget as HTMLElement));
    const isContainedByPopper =
      popperReference &&
      (popperReference.contains(mouseUpTarget) || popperReference.contains(mouseDownTarget));
    if (
      isBound ||
      isTargetExists ||
      isContainedByElement ||
      isSelf ||
      isTargetExcluded ||
      isContainedByPopper
    ) {
      return;
    }
    binding.value(mouseup, mousedown);
  };
}

const ClickOutside: ObjectDirective = {
  beforeMount(element: HTMLElement, binding: DirectiveBinding) {
    // there could be multiple handlers on the element
    if (!nodeList.has(element)) {
      nodeList.set(element, []);
    }

    nodeList.get(element)!.push({
      documentHandler: createDocumentHandler(element, binding),
      bindingFn: binding.value,
    });
  },
  updated(element: HTMLElement, binding: DirectiveBinding) {
    if (!nodeList.has(element)) {
      nodeList.set(element, []);
    }

    const handlers = nodeList.get(element)!;
    const oldHandlerIndex = handlers.findIndex(
      item => item.bindingFn === binding.oldValue,
    );
    const newHandler = {
      documentHandler: createDocumentHandler(element, binding),
      bindingFn: binding.value,
    };

    if (oldHandlerIndex >= 0) {
      // replace the old handler to the new handler
      handlers.splice(oldHandlerIndex, 1, newHandler);
    } else {
      handlers.push(newHandler);
    }
  },
  unmounted(element: HTMLElement) {
    // remove all listeners when a component unmounted
    nodeList.delete(element);
  },
};

export default ClickOutside;
