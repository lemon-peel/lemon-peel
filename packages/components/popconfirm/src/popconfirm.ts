import { buttonTypes } from '@lemon-peel/components/button';
import { QuestionFilled } from '@element-plus/icons-vue';
import { buildProps, iconPropType } from '@lemon-peel/utils';
import { useTooltipContentProps } from '@lemon-peel/components/tooltip';
import type { ExtractPropTypes, PropType } from 'vue';
import type Popconfirm from './Popconfirm.vue';

export const popconfirmProps = buildProps({
  title: String,
  confirmButtonText: String,
  cancelButtonText: String,
  confirmButtonType: { type: String, values: buttonTypes, default: 'primary' },
  cancelButtonType: { type: String, values: buttonTypes, default: 'text' },
  icon: { type: iconPropType, default: () => QuestionFilled },
  iconColor: { type: String, default: '#f90' },
  hideIcon: { type: Boolean, default: false },
  hideAfter: { type: Number, default: 200 },
  onConfirm: { type: Function as PropType<(e: Event) => Promise<void> | void> },
  onCancel: { type: Function as PropType<(e: Event) => Promise<void> | void> },
  teleported: useTooltipContentProps.teleported,
  persistent: useTooltipContentProps.persistent,
  width: { type: [String, Number], default: 150 },
} as const);

export type PopconfirmProps = ExtractPropTypes<typeof popconfirmProps>;

export type PopconfirmInstance = InstanceType<typeof Popconfirm>;
