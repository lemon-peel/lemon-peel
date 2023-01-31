import LpIcon from '@lemon-peel/components/icon';
import { ArrowRight } from '@element-plus/icons-vue';

import type { StyleValue } from 'vue';
import type { TableV2RowCellRenderParam as TableV2RowCellRenderParameter } from './Row';

const ExpandIcon = (
  properties: TableV2RowCellRenderParameter['expandIconProps'] & {
    class?: string | string[];
    style: StyleValue;
    size: number;
    expanded: boolean;
    expandable: boolean;
  },
) => {
  const { expanded, expandable, onExpand, style, size } = properties;

  const expandIconProps = {
    onClick: expandable ? () => onExpand(!expanded) : undefined,
    class: properties.class,
  } as any;

  return (
    <LpIcon {...expandIconProps} size={size} style={style}>
      <ArrowRight />
    </LpIcon>
  );
};

export default ExpandIcon;

export type ExpandIconInstance = ReturnType<typeof ExpandIcon>;
