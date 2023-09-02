import { watch } from 'vue';
import { isClient, useEventListener } from '@vueuse/core';
import { EVENT_CODE } from '@lemon-peel/constants';

import type { Ref } from 'vue';

type ModalInstance = {
  handleClose: () => void;
};

const modalStack: ModalInstance[] = [];

const closeModal = (e: KeyboardEvent) => {
  if (modalStack.length === 0) return;
  if (e.code === EVENT_CODE.esc) {
    e.stopPropagation();
    modalStack.at(-1)?.handleClose();
  }
};

export const useModal = (instance: ModalInstance, visibleReference: Ref<boolean>) => {
  watch(visibleReference, value => {
    if (value) {
      modalStack.push(instance);
    } else {
      modalStack.splice(modalStack.indexOf(instance), 1);
    }
  });
};

if (isClient) useEventListener(document, 'keydown', closeModal);
