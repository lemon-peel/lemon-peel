import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '@lemon-peel/constants';
import { buildProps } from '@lemon-peel/utils';
import { commonProps } from './config';

import type { ExtractPropTypes, PropType } from 'vue';
import type { RenderLabel } from './node';

export const cascaderPanelProps = buildProps({
  ...commonProps,
  border: { type: Boolean, default: true },
  renderLabel: { type: Function as PropType<RenderLabel>, default: undefined },
});

export const cascaderPanelEmits = [
  UPDATE_MODEL_EVENT,
  CHANGE_EVENT,
  'close',
  'expand-change',
];

export type CascaderPanelProps = Readonly<ExtractPropTypes<typeof cascaderPanelProps>>;
