<template>
  <slot :handle-keydown="onKeydown" />
</template>

<script lang="ts">
import { defineComponent, nextTick, onBeforeUnmount, onMounted, provide, ref, unref, watch } from 'vue';
import { isNil } from 'lodash-unified';
import { EVENT_CODE } from '@lemon-peel/constants';
import { useEscapeKeydown } from '@lemon-peel/hooks';
import { isString } from '@lemon-peel/utils';
import { createFocusOutPreventedEvent, focusFirstDescendant, focusableStack, getEdges, isFocusCausedByUserEvent, obtainAllFocusableElements, tryFocus, useFocusReason } from './utils';
import { FOCUS_AFTER_RELEASED, FOCUS_AFTER_TRAPPED, FOCUS_AFTER_TRAPPED_OPTS, FOCUS_TRAP_INJECTION_KEY, ON_RELEASE_FOCUS_EVT, ON_TRAP_FOCUS_EVT } from './tokens';

import type { PropType } from 'vue';
import type { FocusLayer } from './utils';

export default defineComponent({
  name: 'LpFocusTrap',
  inheritAttrs: false,
  props: {
    loop: Boolean,
    trapped: Boolean,
    focusTrapEl: {
      type: Object as PropType<HTMLElement>,
      required: true,
    },
    focusStartEl: {
      type: [Object, String] as PropType<'container' | 'first' | HTMLElement>,
      default: 'first',
    },
  },
  emits: [
    ON_TRAP_FOCUS_EVT,
    ON_RELEASE_FOCUS_EVT,
    'focusin',
    'focusout',
    'focusout-prevented',
    'release-requested',
  ],
  setup(props, { emit }) {
    const forwardRef = ref<HTMLElement | undefined>();
    let lastFocusBeforeTrapped: HTMLElement | null;
    let lastFocusAfterTrapped: HTMLElement | null;

    const { focusReason } = useFocusReason();


    const focusLayer: FocusLayer = {
      paused: false,
      pause() {
        this.paused = true;
      },
      resume() {
        this.paused = false;
      },
    };

    useEscapeKeydown(event => {
      if (props.trapped && !focusLayer.paused) {
        emit('release-requested', event);
      }
    });

    const onKeydown = (e: KeyboardEvent) => {
      if (!props.loop && !props.trapped) return;
      if (focusLayer.paused) return;

      const { key, altKey, ctrlKey, metaKey, currentTarget, shiftKey } = e;
      const { loop } = props;
      const isTabbing =
        key === EVENT_CODE.tab && !altKey && !ctrlKey && !metaKey;

      const currentFocusingElement = document.activeElement;
      if (isTabbing && currentFocusingElement) {
        const container = currentTarget as HTMLElement;
        const [first, last] = getEdges(container);
        const isTabbable = first && last;
        if (isTabbable) {
          if (!shiftKey && currentFocusingElement === last) {
            const focusoutPreventedEvent = createFocusOutPreventedEvent({
              focusReason: focusReason.value,
            });
            emit('focusout-prevented', focusoutPreventedEvent);
            if (!focusoutPreventedEvent.defaultPrevented) {
              e.preventDefault();
              if (loop) tryFocus(first, true);
            }
          } else if (
            shiftKey &&
            [first, container].includes(currentFocusingElement as HTMLElement)
          ) {
            const focusoutPreventedEvent = createFocusOutPreventedEvent({
              focusReason: focusReason.value,
            });
            emit('focusout-prevented', focusoutPreventedEvent);
            if (!focusoutPreventedEvent.defaultPrevented) {
              e.preventDefault();
              if (loop) tryFocus(last, true);
            }
          }
        } else {
          if (currentFocusingElement === container) {
            const focusoutPreventedEvent = createFocusOutPreventedEvent({
              focusReason: focusReason.value,
            });
            emit('focusout-prevented', focusoutPreventedEvent);
            if (!focusoutPreventedEvent.defaultPrevented) {
              e.preventDefault();
            }
          }
        }
      }
    };

    provide(FOCUS_TRAP_INJECTION_KEY, {
      focusTrapRef: forwardRef,
      onKeydown,
    });

    watch(
      () => props.focusTrapEl,
      focusTrapElement => {
        if (focusTrapElement) {
          forwardRef.value = focusTrapElement;
        }
      },
      { immediate: true },
    );

    const onFocusIn = (e: FocusEvent) => {
      const trapContainer = unref(forwardRef);
      if (!trapContainer) return;

      const target = e.target as HTMLElement | null;
      const relatedTarget = e.relatedTarget as HTMLElement | null;
      const isFocusedInTrap = target && trapContainer.contains(target);

      if (!props.trapped) {
        const isPreviousFocusedInTrap =
          relatedTarget && trapContainer.contains(relatedTarget);
        if (!isPreviousFocusedInTrap) {
          lastFocusBeforeTrapped = relatedTarget;
        }
      }

      if (isFocusedInTrap) emit('focusin', e);

      if (focusLayer.paused) return;

      if (props.trapped) {
        if (isFocusedInTrap) {
          lastFocusAfterTrapped = target;
        } else {
          tryFocus(lastFocusAfterTrapped, true);
        }
      }
    };

    const onFocusOut = (e: Event) => {
      const trapContainer = unref(forwardRef);
      if (focusLayer.paused || !trapContainer) return;

      if (props.trapped) {
        const relatedTarget = (e as FocusEvent)
          .relatedTarget as HTMLElement | null;
        if (!isNil(relatedTarget) && !trapContainer.contains(relatedTarget)) {
          // Give embedded focus layer time to pause this layer before reclaiming focus
          // And only reclaim focus if it should currently be trapping
          setTimeout(() => {
            if (!focusLayer.paused && props.trapped) {
              const focusoutPreventedEvent = createFocusOutPreventedEvent({
                focusReason: focusReason.value,
              });
              emit('focusout-prevented', focusoutPreventedEvent);
              if (!focusoutPreventedEvent.defaultPrevented) {
                tryFocus(lastFocusAfterTrapped, true);
              }
            }
          }, 0);
        }
      } else {
        const target = e.target as HTMLElement | null;
        const isFocusedInTrap = target && trapContainer.contains(target);
        if (!isFocusedInTrap) emit('focusout', e);
      }
    };

    watch([forwardRef], ([forwardRef_], [oldForwardReference]) => {
      if (forwardRef_) {
        forwardRef_.addEventListener('keydown', onKeydown);
        forwardRef_.addEventListener('focusin', onFocusIn);
        forwardRef_.addEventListener('focusout', onFocusOut);
      }
      if (oldForwardReference) {
        oldForwardReference.removeEventListener('keydown', onKeydown);
        oldForwardReference.removeEventListener('focusin', onFocusIn);
        oldForwardReference.removeEventListener('focusout', onFocusOut);
      }
    });

    const trapOnFocus = (e: Event) => {
      emit(ON_TRAP_FOCUS_EVT, e);
    };
    const releaseOnFocus = (e: Event) => emit(ON_RELEASE_FOCUS_EVT, e);

    async function startTrap() {
      // Wait for forwardRef to resolve
      await nextTick();
      const trapContainer = unref(forwardRef);
      if (trapContainer) {
        focusableStack.push(focusLayer);
        const previousFocusedElement = trapContainer.contains(
          document.activeElement,
        )
          ? lastFocusBeforeTrapped
          : document.activeElement;
        lastFocusBeforeTrapped = previousFocusedElement as HTMLElement | null;
        const isPreviousFocusContained = trapContainer.contains(previousFocusedElement);
        if (!isPreviousFocusContained) {
          const focusEvent = new Event(
            FOCUS_AFTER_TRAPPED,
            FOCUS_AFTER_TRAPPED_OPTS,
          );
          trapContainer.addEventListener(FOCUS_AFTER_TRAPPED, trapOnFocus);
          trapContainer.dispatchEvent(focusEvent);
          if (!focusEvent.defaultPrevented) {
            nextTick(() => {
              let focusStartElement = props.focusStartEl;
              if (!isString(focusStartElement)) {
                tryFocus(focusStartElement);
                if (document.activeElement !== focusStartElement) {
                  focusStartElement = 'first';
                }
              }
              if (focusStartElement === 'first') {
                focusFirstDescendant(
                  obtainAllFocusableElements(trapContainer),
                  true,
                );
              }
              if (
                document.activeElement === previousFocusedElement ||
                focusStartElement === 'container'
              ) {
                tryFocus(trapContainer);
              }
            });
          }
        }
      }
    }

    function stopTrap() {
      const trapContainer = unref(forwardRef);

      if (trapContainer) {
        trapContainer.removeEventListener(FOCUS_AFTER_TRAPPED, trapOnFocus);

        const releasedEvent = new CustomEvent(FOCUS_AFTER_RELEASED, {
          ...FOCUS_AFTER_TRAPPED_OPTS,
          detail: {
            focusReason: focusReason.value,
          },
        });
        trapContainer.addEventListener(FOCUS_AFTER_RELEASED, releaseOnFocus);
        trapContainer.dispatchEvent(releasedEvent);

        if (
          !releasedEvent.defaultPrevented &&
          (focusReason.value == 'keyboard' || !isFocusCausedByUserEvent())
        ) {
          tryFocus(lastFocusBeforeTrapped ?? document.body, true);
        }

        trapContainer.removeEventListener(FOCUS_AFTER_RELEASED, trapOnFocus);
        focusableStack.remove(focusLayer);
      }
    }

    onMounted(() => {
      if (props.trapped) {
        startTrap();
      }

      watch(
        () => props.trapped,
        trapped => {
          if (trapped) {
            startTrap();
          } else {
            stopTrap();
          }
        },
      );
    });

    onBeforeUnmount(() => {
      if (props.trapped) {
        stopTrap();
      }
    });

    return {
      onKeydown,
    };
  },
});
</script>
