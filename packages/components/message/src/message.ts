import { isClient } from '@vueuse/core';
import { buildProps, iconPropType, mutable } from '@lemon-peel/utils';
import type { AppContext, ExtractPropTypes, PropType, VNode } from 'vue';
import type { Mutable } from '@lemon-peel/utils';
import type MessageConstructor from './Message.vue';

export const messageTypes = ['success', 'info', 'warning', 'error'] as const;

export type MessageType = typeof messageTypes[number];

export interface MessageConfigContext {
  max?: number;
}

export const messageDefaults = mutable({
  customClass: '',
  center: false,
  dangerouslyUseHTMLString: false,
  duration: 3000,
  icon: undefined,
  id: '',
  message: '',
  onClose: undefined,
  showClose: false,
  type: 'info',
  offset: 16,
  zIndex: 0,
  grouping: false,
  repeatNum: 1,
  appendTo: isClient ? document.body : (undefined as never),
});

export const messageProps = buildProps({
  customClass: { type: String, default: messageDefaults.customClass },
  center: { type: Boolean, default: messageDefaults.center },
  dangerouslyUseHTMLString: { type: Boolean, default: messageDefaults.dangerouslyUseHTMLString },
  duration: { type: Number, default: messageDefaults.duration },
  icon: { type: iconPropType, default: messageDefaults.icon },
  id: { type: String, default: messageDefaults.id },
  message: { type: [String, Object, Function] as PropType<string | VNode | (() => VNode)>, default: messageDefaults.message },
  onClose: { type: Function as PropType<() => void>, required: false },
  showClose: { type: Boolean, default: messageDefaults.showClose },
  type: { type: String, values: messageTypes, default: messageDefaults.type },
  offset: { type: Number, default: messageDefaults.offset },
  zIndex: { type: Number, default: messageDefaults.zIndex },
  grouping: { type: Boolean, default: messageDefaults.grouping },
  repeatNum: { type: Number, default: messageDefaults.repeatNum },
});

export type MessageProps = ExtractPropTypes<typeof messageProps>;

export const messageEmits = {
  destroy: () => true,
};
export type MessageEmits = typeof messageEmits;

export type MessageInstance = InstanceType<typeof MessageConstructor>;

export type MessageOptions = Partial<Mutable<Omit<MessageProps, 'id'> & { appendTo?: HTMLElement | string }>>;

export type MessageParams = MessageOptions | MessageOptions['message'];

export type MessageParamsNormalized = Omit<MessageProps, 'id'> & {
  appendTo: HTMLElement;
};

export type MessageOptionsWithType = Omit<MessageOptions, 'type'>;
export type MessageParamsWithType =
  | MessageOptionsWithType
  | MessageOptions['message'];

export interface MessageHandler {
  close: () => void;
}

export type MessageFn = {
  (options?: MessageParams, appContext?: null | AppContext): MessageHandler;
  closeAll(type?: MessageType): void;
};
export type MessageTypedFn = (
  options?: MessageParamsWithType,
  appContext?: null | AppContext
) => MessageHandler;

export interface Message extends MessageFn {
  success: MessageTypedFn;
  warning: MessageTypedFn;
  info: MessageTypedFn;
  error: MessageTypedFn;
}
