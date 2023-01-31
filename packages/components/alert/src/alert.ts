import { TypeComponentsMap, buildProps, keysOf } from '@lemon-peel/utils';
import type { ExtractPropTypes } from 'vue';

export const alertEffects = ['light', 'dark'] as const;

export const alertProps = buildProps({
  /**
   * @description alert title.
   */
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  /**
   * @description alert type.
   */
  type: {
    type: String,
    values: keysOf(TypeComponentsMap),
    default: 'info',
  },
  /**
   * @description whether alert can be dismissed.
   */
  closable: {
    type: Boolean,
    default: true,
  },
  /**
   * @description text for replacing x button
   */
  closeText: {
    type: String,
    default: '',
  },
  /**
   * @description whether show icon
   */
  showIcon: Boolean,
  /**
   * @description should content be placed in center.
   */
  center: Boolean,
  effect: {
    type: String,
    values: alertEffects,
    default: 'light',
  },
} as const);
export type AlertProps = ExtractPropTypes<typeof alertProps>;

export const alertEmits = {
  close: (event_: MouseEvent) => event_ instanceof MouseEvent,
};

export type AlertEmits = typeof alertEmits;
