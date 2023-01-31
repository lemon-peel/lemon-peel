import { createVNode, render } from 'vue';
import { isClient } from '@vueuse/core';
import { debugWarn, hasOwn, isElement, isFunction, isObject, isString, isUndefined, isVNode } from '@lemon-peel/utils';

import MessageBoxConstructor from './index.vue';

import type { AppContext, ComponentPublicInstance, VNode } from 'vue';
import type { Action, Callback, LpMessageBoxOptions, LpMessageBoxShortcutMethod, ILpMessageBox, MessageBoxData, MessageBoxState } from './messageBox.type';

// component default merge props & data

const messageInstance = new Map<
ComponentPublicInstance<{ doClose: () => void }>, // marking doClose as function
{
  options: any;
  callback: Callback | undefined;
  resolve: (res: any) => void;
  reject: (reason?: any) => void;
}
>();

const getAppendToElement = (props: any): HTMLElement => {
  let appendTo: HTMLElement | null = document.body;
  if (props.appendTo) {
    if (isString(props.appendTo)) {
      appendTo = document.querySelector<HTMLElement>(props.appendTo);
    }
    if (isElement(props.appendTo)) {
      appendTo = props.appendTo;
    }

    // should fallback to default value with a warning
    if (!isElement(appendTo)) {
      debugWarn(
        'LpMessageBox',
        'the appendTo option is not an HTMLElement. Falling back to document.body.',
      );
      appendTo = document.body;
    }
  }
  return appendTo;
};

const initInstance = (
  props: any,
  container: HTMLElement,
  appContext: AppContext | null = null,
) => {
  const vnode = createVNode(
    MessageBoxConstructor,
    props,
    isFunction(props.message) || isVNode(props.message)
      ? {
        default: isFunction(props.message)
          ? props.message
          : () => props.message,
      }
      : null,
  );
  vnode.appContext = appContext;
  render(vnode, container);
  getAppendToElement(props).append(container.firstElementChild!);
  return vnode.component;
};

const genContainer = () => {
  return document.createElement('div');
};

const showMessage = (options: any, appContext?: AppContext | null) => {
  const container = genContainer();

  const instance = initInstance(options, container, appContext)!;

  // This is how we use message box programmably.
  // Maybe consider releasing a template version?
  // get component instance like v2.
  const vm = instance.proxy as ComponentPublicInstance<
  {
    visible: boolean;
    doClose: () => void;
  } & MessageBoxState
  >;

  // Adding destruct method.
  // when transition leaves emitting `vanish` evt. so that we can do the clean job.
  options.onVanish = () => {
    // not sure if this causes mem leak, need proof to verify that.
    // maybe calling out like 1000 msg-box then close them all.
    render(null, container);
    messageInstance.delete(vm); // Remove vm to avoid mem leak.
    // here we were suppose to call document.body.removeChild(container.firstElementChild)
    // but render(null, container) did that job for us. so that we do not call that directly
  };

  options.onAction = (action: Action) => {
    const currentMessage = messageInstance.get(vm)!;
    const resolve: Action | { value: string, action: Action }
      = options.showInput ? { value: vm.inputValue, action } : action;
    if (options.callback) {
      options.callback(resolve, instance.proxy);
    } else {
      if (action === 'cancel' || action === 'close') {
        if (options.distinguishCancelAndClose && action !== 'cancel') {
          currentMessage.reject('close');
        } else {
          currentMessage.reject('cancel');
        }
      } else {
        currentMessage.resolve(resolve);
      }
    }
  };

  for (const property in options) {
    if (hasOwn(options, property) && !hasOwn(vm.$props, property)) {
      vm[property as keyof ComponentPublicInstance] = options[property];
    }
  }

  // change visibility after everything is settled
  vm.visible = true;
  return vm;
};

async function MessageBox(
  options: LpMessageBoxOptions,
  appContext?: AppContext | null
): Promise<MessageBoxData>;
function MessageBox(
  options: LpMessageBoxOptions | string | VNode,
  appContext: AppContext | null = null,
): Promise<{ value: string, action: Action } | Action> {
  if (!isClient) return Promise.reject();
  let callback: Callback | undefined;
  if (isString(options) || isVNode(options)) {
    options = {
      message: options,
    };
  } else {
    callback = options.callback;
  }

  return new Promise((resolve, reject) => {
    const vm = showMessage(
      options,
      appContext ?? (MessageBox as ILpMessageBox)._context,
    );
    // collect this vm in order to handle upcoming events.
    messageInstance.set(vm, {
      options,
      callback,
      resolve,
      reject,
    });
  });
}

const MESSAGE_BOX_VARIANTS = ['alert', 'confirm', 'prompt'] as const;
const MESSAGE_BOX_DEFAULT_OPTS: Record<
  typeof MESSAGE_BOX_VARIANTS[number],
Partial<LpMessageBoxOptions>
> = {
  alert: { closeOnPressEscape: false, closeOnClickModal: false },
  confirm: { showCancelButton: true },
  prompt: { showCancelButton: true, showInput: true },
};

function messageBoxFactory(boxType: typeof MESSAGE_BOX_VARIANTS[number]) {
  return (
    message: string | VNode,
    title: string | LpMessageBoxOptions,
    options?: LpMessageBoxOptions,
    appContext?: AppContext | null,
  ) => {
    let titleOrOptions = '';
    if (isObject(title)) {
      options = title as LpMessageBoxOptions;
      titleOrOptions = '';
    } else if (isUndefined(title)) {
      titleOrOptions = '';
    } else {
      titleOrOptions = title as string;
    }

    return MessageBox(
      Object.assign(
        {
          title: titleOrOptions,
          message,
          type: '',
          ...MESSAGE_BOX_DEFAULT_OPTS[boxType],
        },
        options,
        {
          boxType,
        },
      ),
      appContext,
    );
  };
}

for (const boxType of MESSAGE_BOX_VARIANTS) {
  (MessageBox as ILpMessageBox)[boxType] = messageBoxFactory(
    boxType,
  ) as LpMessageBoxShortcutMethod;
}

MessageBox.close = () => {
  // instance.setupInstall.doClose()
  // instance.setupInstall.state.visible = false

  for (const [vm] of messageInstance.entries()) {
    vm.doClose();
  }

  messageInstance.clear();
};

(MessageBox as ILpMessageBox)._context = null;

export default MessageBox as ILpMessageBox;
