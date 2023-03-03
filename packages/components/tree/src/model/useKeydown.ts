import { onMounted, onUpdated, shallowRef, watch } from 'vue';
import { useEventListener } from '@vueuse/core';
import { EVENT_CODE } from '@lemon-peel/constants';
import { useNamespace } from '@lemon-peel/hooks/src';
import type TreeStore from './treeStore';

import type { Ref } from 'vue';
import type { Nullable } from '@lemon-peel/utils';
import type { TreeKey } from '../tree';

interface UseKeydownOption {
  elRef: Ref<HTMLElement>;
}

export function useKeydown({ elRef }: UseKeydownOption, store: Ref<TreeStore>) {
  const ns = useNamespace('tree');

  const treeItems = shallowRef<HTMLElement[]>([]);
  const checkboxItems = shallowRef<HTMLElement[]>([]);

  const initTabIndex = (): void => {
    treeItems.value = [...elRef.value.querySelectorAll<HTMLElement>(`.${ns.is('focusable')}[role=treeitem]`)];
    checkboxItems.value = [...elRef.value.querySelectorAll<HTMLElement>('input[type=checkbox]')];
    const checkedItem = elRef.value.querySelectorAll(
      `.${ns.is('checked')}[role=treeitem]`,
    );
    if (checkedItem.length > 0) {
      checkedItem[0].setAttribute('tabindex', '0');
      return;
    }
    treeItems.value[0]?.setAttribute('tabindex', '0');
  };

  onMounted(() => {
    initTabIndex();
  });

  onUpdated(() => {
    treeItems.value = [...elRef.value.querySelectorAll<HTMLElement>('[role=treeitem]')];
    checkboxItems.value = [...elRef.value.querySelectorAll<HTMLElement>('input[type=checkbox]')];
  });

  watch(checkboxItems, val => {
    for (const checkbox of val) {
      checkbox.setAttribute('tabindex', '-1');
    }
  });

  const handleKeydown = (ev: KeyboardEvent): void => {
    const currentItem = ev.target as HTMLElement;
    if (!currentItem.className.includes(ns.b('node'))) return;
    const code = ev.code;
    treeItems.value = [...elRef.value.querySelectorAll(`.${ns.is('focusable')}[role=treeitem]`)] as HTMLElement[];

    const currentIndex = treeItems.value.indexOf(currentItem);
    let nextIndex;
    if ([EVENT_CODE.up, EVENT_CODE.down].includes(code)) {
      ev.preventDefault();
      if (code === EVENT_CODE.up) {
        nextIndex =
          currentIndex === -1
            ? 0
            : (currentIndex === 0
              ? treeItems.value.length - 1
              : currentIndex - 1);
        const startIndex = nextIndex;
        while (true) {
          if (store.value.getNode(treeItems.value[nextIndex].dataset.key as TreeKey).canFocus)
            break;
          nextIndex--;
          if (nextIndex === startIndex) {
            nextIndex = -1;
            break;
          }
          if (nextIndex < 0) {
            nextIndex = treeItems.value.length - 1;
          }
        }
      } else {
        nextIndex =
          currentIndex === -1
            ? 0
            : (currentIndex < treeItems.value.length - 1
              ? currentIndex + 1
              : 0);
        const startIndex = nextIndex;
        while (true) {
          if (
            store.value.getNode(treeItems.value[nextIndex].dataset.key as TreeKey).canFocus
          )
            break;
          nextIndex++;
          if (nextIndex === startIndex) {
            nextIndex = -1;
            break;
          }
          if (nextIndex >= treeItems.value.length) {
            nextIndex = 0;
          }
        }
      }
      nextIndex !== -1 && treeItems.value[nextIndex].focus();
    }
    if ([EVENT_CODE.left, EVENT_CODE.right].includes(code)) {
      ev.preventDefault();
      currentItem.click();
    }
    const hasInput = currentItem.querySelector(
      '[type="checkbox"]',
    ) as Nullable<HTMLInputElement>;
    if ([EVENT_CODE.enter, EVENT_CODE.space].includes(code) && hasInput) {
      ev.preventDefault();
      hasInput.click();
    }
  };

  useEventListener(elRef, 'keydown', handleKeydown);
}
