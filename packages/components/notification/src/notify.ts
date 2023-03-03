import { createVNode, render } from 'vue';
import { isClient } from '@vueuse/core';
import { useZIndex } from '@lemon-peel/hooks/src';
import { debugWarn, isElement, isString, isVNode } from '@lemon-peel/utils';
import NotificationConstructor from './Notification.vue';
import { notificationTypes } from './notification';

import type { AppContext, Ref, VNode } from 'vue';
import type { NotificationOptions, NotificationProps, NotificationQueue, Notify, NotifyFn } from './notification';

// This should be a queue but considering there were `non-autoclosable` notifications.
const notifications: Record<
NotificationOptions['position'],
NotificationQueue
> = {
  'top-left': [],
  'top-right': [],
  'bottom-left': [],
  'bottom-right': [],
};

// the gap size between each notification
const GAP_SIZE = 16;
let seed = 1;

/**
 * This function gets called when user click `x` button or press `esc` or the time reached its limitation.
 * Emitted by transition@before-leave event so that we can fetch the current notification.offsetHeight, if this was called
 * by @after-leave the DOM element will be removed from the page thus we can no longer fetch the offsetHeight.
 * @param {String} id notification id to be closed
 * @param {Position} position the positioning strategy
 * @param {Function} userOnClose the callback called when close passed by user
 */
export function close(
  id: string,
  position: NotificationOptions['position'],
  userOnClose?: (vm: VNode) => void,
): void {
  // maybe we can store the index when inserting the vm to notification list.
  const orientedNotifications = notifications[position];
  const ownIndex = orientedNotifications.findIndex(
    ({ vm }) => vm.component?.props.id === id,
  );
  if (ownIndex === -1) return;
  const { vm } = orientedNotifications[ownIndex];
  if (!vm) return;
  // calling user's on close function before notification gets removed from DOM.
  userOnClose?.(vm);

  // note that this is called @before-leave, that's why we were able to fetch this property.
  const removedHeight = vm.el!.offsetHeight;
  const verticalPos = position.split('-')[0];
  orientedNotifications.splice(ownIndex, 1);
  const notifyLength = orientedNotifications.length;
  if (notifyLength < 1) return;
  // starting from the removing item.
  for (let index = ownIndex; index < notifyLength; index++) {
    // new position equals the current offsetTop minus removed height plus 16px(the gap size between each item)
    const { el, component } = orientedNotifications[index].vm;
    const pos =
      Number.parseInt(el!.style[verticalPos], 10) - removedHeight - GAP_SIZE;
    component!.props.offset = pos;
  }
}

const notify: NotifyFn & Partial<Notify> & { _context: AppContext | null } =
  function (options = {}, context?: AppContext) {
    if (!isClient) return { close: () => {} };

    if (typeof options === 'string' || isVNode(options)) {
      options = { message: options };
    }

    const position = options.position || 'top-right';

    let verticalOffset = options.offset || 0;
    for (const { vm } of notifications[position]) {
      verticalOffset += (vm.el?.offsetHeight || 0) + GAP_SIZE;
    }
    verticalOffset += GAP_SIZE;

    const { nextZIndex } = useZIndex();

    const id = `notification_${seed++}`;
    const userOnClose = options.onClose;
    const props: Partial<NotificationProps> = {
      ...options,
      zIndex: nextZIndex(),
      offset: verticalOffset,
      id,
      onClose: () => {
        close(id, position, userOnClose);
      },
    };

    let appendTo: HTMLElement | null = document.body;
    if (isElement(options.appendTo)) {
      appendTo = options.appendTo;
    } else if (isString(options.appendTo)) {
      appendTo = document.querySelector(options.appendTo);
    }

    // should fallback to default value with a warning
    if (!isElement(appendTo)) {
      debugWarn(
        'LpNotification',
        'the appendTo option is not an HTMLElement. Falling back to document.body.',
      );
      appendTo = document.body;
    }

    const container = document.createElement('div');

    const vm = createVNode(
      NotificationConstructor,
      props,
      isVNode(props.message)
        ? {
          default: () => props.message,
        }
        : null,
    );
    vm.appContext = context ?? notify._context;

    // clean notification element preventing mem leak
    vm.props!.onDestroy = () => {
      render(null, container);
    };

    // instances will remove this item when close function gets called. So we do not need to worry about it.
    render(vm, container);
    notifications[position].push({ vm });
    appendTo.append(container.firstElementChild!);

    return {
      // instead of calling the onClose function directly, setting this value so that we can have the full lifecycle
      // for out component, so that all closing steps will not be skipped.
      close: () => {
        (vm.component!.exposed as { visible: Ref<boolean> }).visible.value =
          false;
      },
    };
  };

for (const type of notificationTypes) {
  notify[type] = (options = {}) => {
    if (typeof options === 'string' || isVNode(options)) {
      options = {
        message: options,
      };
    }
    return notify({
      ...options,
      type,
    });
  };
}

export function closeAll(): void {
  // loop through all directions, close them at once.
  for (const orientedNotifications of Object.values(notifications)) {
    for (const { vm } of orientedNotifications) {
      // same as the previous close method, we'd like to make sure lifecycle gets handle properly.
      (vm.component!.exposed as { visible: Ref<boolean> }).visible.value =
        false;
    }
  }
}

notify.closeAll = closeAll;
notify._context = null;

export default notify as Notify;
