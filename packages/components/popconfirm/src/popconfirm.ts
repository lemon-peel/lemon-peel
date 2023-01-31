import { buttonTypes } from '@lemon-peel/components/button';
import { QuestionFilled } from '@element-plus/icons-vue';
import { buildProps, definePropType, iconPropType } from '@lemon-peel/utils';
import { useTooltipContentProps } from '@lemon-peel/components/tooltip';
import type { ExtractPropTypes } from 'vue';
import type Popconfirm from './Popconfirm.vue';

export const popconfirmProps = buildProps({
  title: String,
  confirmButtonText: String,
  cancelButtonText: String,
  confirmButtonType: {
    type: String,
    values: buttonTypes,
    default: 'primary',
  },
  cancelButtonType: {
    type: String,
    values: buttonTypes,
    default: 'text',
  },
  icon: {
    type: iconPropType,
    default: () => QuestionFilled,
  },
  iconColor: {
    type: String,
    default: '#f90',
  },
  hideIcon: {
    type: Boolean,
    default: false,
  },
  hideAfter: {
    type: Number,
    default: 200,
  },
  onConfirm: {
    type: definePropType<(e: Event) => Promise<void> | void>(Function),
  },
  onCancel: {
    type: definePropType<(e: Event) => Promise<void> | void>(Function),
  },
  teleported: useTooltipContentProps.teleported,
  persistent: useTooltipContentProps.persistent,
  width: {
    type: [String, Number],
    default: 150,
  },
} as const);
export type PopconfirmProps = ExtractPropTypes<typeof popconfirmProps>;

export type PopconfirmInstance = InstanceType<typeof Popconfirm>;
