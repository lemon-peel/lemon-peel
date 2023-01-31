import { isClient } from '@vueuse/core';

const globalNodes: HTMLElement[] = [];
let target: HTMLElement = !isClient ? (undefined as any) : document.body;

export function createGlobalNode(id?: string) {
  const element = document.createElement('div');
  if (id !== undefined) {
    element.setAttribute('id', id);
  }

  target.append(element);
  globalNodes.push(element);

  return element;
}

export function removeGlobalNode(element: HTMLElement) {
  globalNodes.splice(globalNodes.indexOf(element), 1);
  element.remove();
}

export function changeGlobalNodesTarget(element: HTMLElement) {
  if (element === target) return;

  target = element;
  for (const ele of globalNodes) {
    if (ele.contains(target) === false) {
      target.append(ele);
    }
  }
}
