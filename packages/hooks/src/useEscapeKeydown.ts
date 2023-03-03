import { onBeforeUnmount, onMounted } from 'vue';
import { isClient } from '@vueuse/core';
import { EVENT_CODE } from '@lemon-peel/constants';

let registeredEscapeHandlers: ((e: KeyboardEvent) => void)[] = [];

const cachedHandler = (e: Event) => {
  const event = e as KeyboardEvent;
  if (event.key === EVENT_CODE.esc) {
    for (const registeredHandler of registeredEscapeHandlers) registeredHandler(event)
    ;
  }
};

export const useEscapeKeydown = (handler: (e: KeyboardEvent) => void) => {
  onMounted(() => {
    if (registeredEscapeHandlers.length === 0) {
      document.addEventListener('keydown', cachedHandler);
    }
    if (isClient) registeredEscapeHandlers.push(handler);
  });

  onBeforeUnmount(() => {
    registeredEscapeHandlers = registeredEscapeHandlers.filter(
      registeredHandler => registeredHandler !== handler,
    );
    if (registeredEscapeHandlers.length === 0 && isClient) document.removeEventListener('keydown', cachedHandler);
  });
};
