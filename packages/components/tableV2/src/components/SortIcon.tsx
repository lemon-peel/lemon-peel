import LpIcon from '@lemon-peel/components/icon';
import { SortDown, SortUp } from '@element-plus/icons-vue';
import { SortOrder } from '../constants';

import type { FunctionalComponent } from 'vue';

export type SortIconProps = {
  sortOrder: SortOrder;
  class?: any;
};

const SortIcon: FunctionalComponent<SortIconProps> = props => {
  const { sortOrder } = props;

  return (
    <LpIcon size={14} class={props.class}>
      {sortOrder === SortOrder.ASC ? <SortUp /> : <SortDown />}
    </LpIcon>
  );
};

export default SortIcon;
