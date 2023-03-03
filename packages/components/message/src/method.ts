import { createVNode, render } from 'vue';
import { isClient } from '@vueuse/core';
import { debugWarn, isElement, isFunction, isNumber, isString, isVNode } from '@lemon-peel/utils';
import { useZIndex } from '@lemon-peel/hooks/src';
import { messageConfig } from '@lemon-peel/components/configProvider/src/configProvider';
import MessageView from './Message.vue';
import { messageDefaults, messageTypes } from './message';
import { instances } from './instance';

import type { MessageContext } from './instance';
import type { AppContext } from 'vue';
import type { Message, MessageFn, MessageHandler, MessageOptions, MessageParams, MessageParamsNormalized, MessageType, MessageProps } from './message';

let seed = 1;

// TODO: Since Notify.ts is basically the same like this file. So we could do some encapsulation against them to reduce code duplication.

const normalizeOptions = (params?: MessageParams) => {
  const options: MessageOptions =
    !params || isString(params) || isVNode(params) || isFunction(params)
      ? { message: params }
      : params;

  const normalized = {
    ...messageDefaults,
    ...options,
  };

  if (!normalized.appendTo) {
    normalized.appendTo = document.body;
  } else if (isString(normalized.appendTo)) {
    let appendTo = document.querySelector<HTMLElement>(normalized.appendTo);

    // should fallback to default value with a warning
    if (!isElement(appendTo)) {
      debugWarn(
        'LpMessage',
        'the appendTo option is not an HTMLElement. Falling back to document.body.',
      );
      appendTo = document.body;
    }

    normalized.appendTo = appendTo;
  }

  return normalized as MessageParamsNormalized;
};

const closeMessage = (instance: MessageContext) => {
  const index = instances.indexOf(instance);
  if (index === -1) return;

  instances.splice(index, 1);
  const { handler } = instance;
  handler.close();
};

const message: MessageFn & Message & { _context: AppContext | null } = (((options = {}, context?) => {
  if (!isClient) return { close: () => {} };

  if (isNumber(messageConfig.max) && instances.length >= messageConfig.max) {
    return { close: () => {} };
  }

  const normalized = normalizeOptions(options);

  if (normalized.grouping && instances.length > 0) {
    const instance = instances.find(
      ({ vnode: vm }) => vm.props?.message === normalized.message,
    );
    if (instance) {
      instance.props.repeatNum += 1;
      instance.props.type = normalized.type;
      return instance.handler;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-use-before-define
  const instance = createMessage(normalized, context);

  instances.push(instance);
  return instance.handler;
}) as MessageFn) as any;

function createMessage({ appendTo, ...options }: MessageParamsNormalized, context?: AppContext | null): MessageContext {
  const { nextZIndex } = useZIndex();

  const id = `message_${seed++}`;
  const userOnClose = options.onClose;

  const container = document.createElement('div');

  // eslint-disable-next-line prefer-const
  let instance: MessageContext;

  const props = {
    ...options,
    zIndex: nextZIndex() + options.zIndex,
    id,
    onClose: () => {
      userOnClose?.();
      closeMessage(instance);
    },

    // clean message element preventing mem leak
    onDestroy: () => {
      // since the element is destroy, then the VNode should be collected by GC as well
      // we do not want cause any mem leak because we have returned vm as a reference to users
      // so that we manually set it to false.
      render(null, container);
    },
  };

  const vnode = createVNode(
    MessageView,
    props,
    isFunction(props.message) || isVNode(props.message)
      ? {
        default: isFunction(props.message)
          ? props.message
          : () => props.message,
      }
      : null,
  );

  const handler: MessageHandler = {
    // instead of calling the onClose function directly, setting this value so that we can have the full lifecycle
    // for out component, so that all closing steps will not be skipped.
    close: () => {
      if (vnode.component?.exposed) {
        vnode.component.exposed.visible.value = false;
      }
    },
  };

  instance = {
    id,
    vnode,
    handler,
    props: vnode.props as MessageProps,
  };

  vnode.appContext = context || message._context;

  render(vnode, container);
  // instances will remove this item when close function gets called. So we do not need to worry about it.
  appendTo.append(container.firstElementChild!);

  return instance;
}

for (const type of messageTypes) {
  message[type] = (options = {}, appContext = null) => {
    const normalized = normalizeOptions(options);
    return message({ ...normalized, type }, appContext);
  };
}

export function closeAll(type?: MessageType): void {
  for (const instance of instances) {
    if (!type || type === instance.props.type) {
      instance.handler.close();
    }
  }
}

message.closeAll = closeAll;
message._context = null;

export default message as Message;
