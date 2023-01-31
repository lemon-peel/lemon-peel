import { unref } from 'vue';
import { isArray } from '@lemon-peel/utils';
import type { Arrayable } from '@lemon-peel/utils';
import type { Ref } from 'vue';
import type { TooltipTriggerType } from './Trigger.vue';

export const isTriggerType = (
  trigger: Arrayable<TooltipTriggerType>,
  type: TooltipTriggerType,
) => {
  if (isArray(trigger)) {
    return trigger.includes(type);
  }
  return trigger === type;
};

export const whenTrigger = (
  trigger: Ref<Arrayable<TooltipTriggerType>>,
  type: TooltipTriggerType,
  handler: (e: Event) => void,
) => {
  return (e: Event) => {
    isTriggerType(unref(trigger), type) && handler(e);
  };
};
