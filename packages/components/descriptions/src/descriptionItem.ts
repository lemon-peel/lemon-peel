
import { defineComponent } from 'vue';
import { buildProps } from '@lemon-peel/utils';

import type { ExtractPropTypes } from 'vue';

const descriptionsItemProps = buildProps({
  label: { type: String, default: '' },
  span: { type: Number, default: 1 },
  width: { type: [String, Number], default: '' },
  minWidth: { type: [String, Number], default: '' },
  align: { type: String, default: 'left' },
  labelAlign: { type: String, default: '' },
  className: { type: String, default: '' },
  labelClassName: { type: String, default: '' },
});

export type DescriptionsItemProps = Readonly<ExtractPropTypes<typeof descriptionsItemProps>>;

export default defineComponent({
  name: 'LpDescriptionsItem',
  props: descriptionsItemProps,
});
