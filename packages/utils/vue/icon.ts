import { CircleCheck, CircleClose, CircleCloseFilled, Close, InfoFilled, Loading, SuccessFilled, WarningFilled } from '@element-plus/icons-vue';

import type { Component, PropType } from 'vue';

export const iconPropType = [String, Object, Function] as PropType<string | Component>;

export const CloseComponents = {
  Close,
};

export const TypeComponents = {
  Close,
  SuccessFilled,
  InfoFilled,
  WarningFilled,
  CircleCloseFilled,
};

export const TypeComponentsMap = {
  success: SuccessFilled,
  warning: WarningFilled,
  error: CircleCloseFilled,
  info: InfoFilled,
};

export const ValidateComponentsMap = {
  validating: Loading,
  success: CircleCheck,
  error: CircleClose,
} as const;
