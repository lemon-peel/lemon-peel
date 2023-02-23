import { provide, shallowReactive } from 'vue';
import { addClass, removeClass } from '@lemon-peel/utils';
import { useNamespace } from '@lemon-peel/hooks';

import type { InjectionKey, Ref, SetupContext, ShallowRef  } from 'vue';
import type { NodeDropType, TreeProps } from '../tree';
import Node from './node';
import type TreeStore from './treeStore';

interface TreeNode {
  node: Node;
  $el?: HTMLElement;
}

interface DragOptions {
  event: DragEvent;
  treeNode: TreeNode;
}

export interface DragEvents {
  treeNodeDragStart: (options: DragOptions) => void;
  treeNodeDragOver: (options: DragOptions) => void;
  treeNodeDragEnd: (event: DragEvent) => void;
}

export const dragEventsKey: InjectionKey<DragEvents> = Symbol('dragEvents');

export function useDragNodeHandler({
  props,
  emit,
  elRef,
  dropIndicatorRef,
  store,
}: {
  props: TreeProps;
  emit: SetupContext['emit'];
  elRef: Ref<HTMLElement>;
  dropIndicatorRef: Ref<HTMLElement>;
  store: ShallowRef<TreeStore>;
}) {
  const ns = useNamespace('tree');

  const dragState = shallowReactive<{
    showDropIndicator: boolean;
    draggingNode: TreeNode | null;
    dropNode: TreeNode | null;
    allowDrop: boolean;
    dropType: NodeDropType | null;
  }>({
    showDropIndicator: false,
    draggingNode: null,
    dropNode: null,
    allowDrop: true,
    dropType: null,
  });

  const treeNodeDragStart = ({ event, treeNode }: DragOptions) => {
    if (
      typeof props.allowDrag === 'function' &&
      !props.allowDrag(treeNode.node)
    ) {
      event.preventDefault();
      return false;
    }
    event.dataTransfer!.effectAllowed = 'move';

    // wrap in try catch to address IE's error when first param is 'text/plain'
    try {
      // setData is required for draggable to work in FireFox
      // the content has to be '' so dragging a node out of the tree won't open a new tab in FireFox
      event.dataTransfer!.setData('text/plain', '');
    } catch {}
    dragState.draggingNode = treeNode;
    emit('node-drag-start', treeNode.node, event);
  };

  const treeNodeDragOver = ({ event, treeNode }: DragOptions) => {
    const dropNode = treeNode;
    const oldDropNode = dragState.dropNode;
    if (oldDropNode && oldDropNode !== dropNode) {
      removeClass(oldDropNode.$el!, ns.is('drop-inner'));
    }

    const draggingNode = dragState.draggingNode;
    if (!draggingNode || !dropNode) return;

    let dropPrev = true;
    let dropInner = true;
    let dropNext = true;
    let userAllowDropInner = true;
    if (typeof props.allowDrop === 'function') {
      dropPrev = props.allowDrop(draggingNode.node, dropNode.node, 'prev');
      userAllowDropInner = dropInner = props.allowDrop(
        draggingNode.node,
        dropNode.node,
        'inner',
      );
      dropNext = props.allowDrop(draggingNode.node, dropNode.node, 'next');
    }

    event.dataTransfer!.dropEffect =
      dropInner || dropPrev || dropNext ? 'move' : 'none';
    if ((dropPrev || dropInner || dropNext) && oldDropNode !== dropNode) {
      if (oldDropNode) {
        emit('node-drag-leave', draggingNode.node, oldDropNode.node, event);
      }

      emit('node-drag-enter', draggingNode.node, dropNode.node, event);
    }

    if (dropPrev || dropInner || dropNext) {
      dragState.dropNode = dropNode;
    }

    if (dropNode.node.nextSibling === draggingNode.node) {
      dropNext = false;
    }
    if (dropNode.node.previousSibling === draggingNode.node) {
      dropPrev = false;
    }
    if (dropNode.node.contains(draggingNode.node, false)) {
      dropInner = false;
    }
    if (
      draggingNode.node === dropNode.node ||
      draggingNode.node.contains(dropNode.node)
    ) {
      dropPrev = false;
      dropInner = false;
      dropNext = false;
    }

    const targetPosition = dropNode.$el!.getBoundingClientRect();
    const treePosition = elRef.value.getBoundingClientRect();

    let dropType: NodeDropType;
    const prevPercent = dropPrev ? (dropInner ? 0.25 : dropNext ? 0.45 : 1) : -1;
    const nextPercent = dropNext ? (dropInner ? 0.75 : dropPrev ? 0.55 : 0) : 1;

    let indicatorTop = -9999;
    const distance = event.clientY - targetPosition.top;
    if (distance < targetPosition.height * prevPercent) {
      dropType = 'before';
    } else if (distance > targetPosition.height * nextPercent) {
      dropType = 'after';
    } else if (dropInner) {
      dropType = 'inner';
    } else {
      dropType = 'none';
    }

    const iconPosition = dropNode.$el!
      .querySelector(`.${ns.be('node', 'expand-icon')}`)!
      .getBoundingClientRect();
    const dropIndicator = dropIndicatorRef.value;
    if (dropType === 'before') {
      indicatorTop = iconPosition.top - treePosition.top;
    } else if (dropType === 'after') {
      indicatorTop = iconPosition.bottom - treePosition.top;
    }
    dropIndicator.style.top = `${indicatorTop}px`;
    dropIndicator.style.left = `${iconPosition.right - treePosition.left}px`;

    if (dropType === 'inner') {
      addClass(dropNode.$el!, ns.is('drop-inner'));
    } else {
      removeClass(dropNode.$el!, ns.is('drop-inner'));
    }

    dragState.showDropIndicator =
      dropType === 'before' || dropType === 'after';
    dragState.allowDrop =
      dragState.showDropIndicator || userAllowDropInner;
    dragState.dropType = dropType;
    emit('node-drag-over', draggingNode.node, dropNode.node, event);
  };

  const treeNodeDragEnd = (event: DragEvent) => {
    const { draggingNode, dropType, dropNode } = dragState;
    event.preventDefault();
    event.dataTransfer!.dropEffect = 'move';

    if (draggingNode && dropNode) {
      const draggingNodeCopy = new Node({
        data: draggingNode.node.data,
        store: store.value,
      });

      if (dropType !== 'none') {
        draggingNode.node.remove();
      }
      switch (dropType) {
        case 'before': {
          dropNode.node.parent!.insertBefore(draggingNodeCopy, dropNode.node);

          break;
        }
        case 'after': {
          dropNode.node.parent!.insertAfter(draggingNodeCopy, dropNode.node);

          break;
        }
        case 'inner': {
          dropNode.node.insertChild(draggingNodeCopy);

          break;
        }
      // No default
      }

      if (dropType !== 'none') {
        store.value.registerNode(draggingNodeCopy);
      }

      removeClass(dropNode.$el!, ns.is('drop-inner'));

      emit(
        'node-drag-end',
        draggingNode.node,
        dropNode.node,
        dropType,
        event,
      );

      if (dropType !== 'none') {
        emit('node-drop', draggingNode.node, dropNode.node, dropType, event);
      }
    }

    if (draggingNode && !dropNode) {
      emit('node-drag-end', draggingNode.node, null, dropType, event);
    }

    dragState.showDropIndicator = false;
    dragState.draggingNode = null;
    dragState.dropNode = null;
    dragState.allowDrop = true;
  };

  provide(dragEventsKey, {
    treeNodeDragStart,
    treeNodeDragOver,
    treeNodeDragEnd,
  });

  return {
    dragState,
  };
}
