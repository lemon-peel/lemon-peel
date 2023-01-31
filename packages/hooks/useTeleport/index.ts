import { Teleport, h, onUnmounted, ref } from 'vue';
import { NOOP } from '@vue/shared';
import { isClient } from '@vueuse/core';
import { createGlobalNode, removeGlobalNode } from '@lemon-peel/utils';

import type { Ref, VNode } from 'vue';

export const useTeleport = (
  contentRenderer: () => VNode,
  appendToBody: Ref<boolean>,
) => {
  const isTeleportVisible = ref(false);

  if (!isClient) {
    return {
      isTeleportVisible,
      showTeleport: NOOP,
      hideTeleport: NOOP,
      renderTeleport: NOOP,
    };
  }

  let $element: HTMLElement | null = null;

  const showTeleport = () => {
    isTeleportVisible.value = true;
    // this allows the delayed showing strategy since the the content itself could be enterable
    // e.g. el-popper
    if ($element !== null) return;

    $element = createGlobalNode();
  };

  const hideTeleport = () => {
    isTeleportVisible.value = false;
    if ($element !== null) {
      removeGlobalNode($element);
      $element = null;
    }
  };

  const renderTeleport = () => {
    return appendToBody.value === true
      ? (isTeleportVisible.value
        ? [h(Teleport, { to: $element }, contentRenderer())]
        : undefined)
      : contentRenderer();
  };

  onUnmounted(hideTeleport);

  return {
    isTeleportVisible,
    showTeleport,
    hideTeleport,
    renderTeleport,
  };
};
