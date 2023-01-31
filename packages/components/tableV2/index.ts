import { withInstall } from '@lemon-peel/utils';
import TableV2 from './src/tableV2';
import AutoResizer from './src/components/AutoResizer';

export {
  Alignment as TableV2Alignment,
  FixedDir as TableV2FixedDir,
  SortOrder as TableV2SortOrder,
} from './src/constants';
export { default as TableV2 } from './src/tableV2';
export * from './src/autoResizer';
export { placeholderSign as TableV2Placeholder } from './src/private';

export const LpTableV2 = withInstall(TableV2);
export const LpAutoResizer = withInstall(AutoResizer);

export type { Column, Columns, SortBy, SortState, TableV2CustomizedHeaderSlotParam } from './src/types';
export type { TableV2Instance } from './src/tableV2';
export * from './src/table';
export * from './src/row';

export type { HeaderCellSlotProps } from './src/renderers/HeaderCell';
