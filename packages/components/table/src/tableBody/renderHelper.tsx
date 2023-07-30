import { computed, inject } from 'vue';
import { useNamespace } from '@lemon-peel/hooks';

import { getRowIdentity } from '../util';
import { STORE_INJECTION_KEY, TABLE_INJECTION_KEY } from '../tokens';
import useEvents from './eventsHelper';
import useStyles from './stylesHelper';
import type { RenderRowData, TableProps, TreeNode } from '../table/defaults';
import type { DefaultRow } from '../table/defaults';
import type { TableBodyProps } from './defaults';
import type { TableColumnCtx } from '../tableColumn/defaults';

function useRender(props: TableBodyProps) {
  const table = inject(TABLE_INJECTION_KEY)!;
  const store = inject(STORE_INJECTION_KEY)!;
  const ns = useNamespace('table');
  const {
    handleDoubleClick,
    handleClick,
    handleContextMenu,
    handleMouseEnter,
    handleMouseLeave,
    handleCellMouseEnter,
    handleCellMouseLeave,
  } = useEvents();

  const {
    getRowStyle,
    getRowClass,
    getCellStyle,
    getCellClass,
    getSpan,
    getColspanRealWidth,
  } = useStyles(props);

  const firstDefaultColumnIndex = computed(() => {
    return store.states.columns.value.findIndex(
      ({ type }) => type === 'default',
    );
  });

  const getKeyOfRow = (row: DefaultRow, index: number) => {
    const rowKey = (table.props as TableProps).rowKey;
    return rowKey ? getRowIdentity(row, rowKey) : index;
  };

  const renderRow = (row: DefaultRow, rowIndex: number, treeNode?: TreeNode, expanded = false) => {
    const { tooltipEffect } = props;
    const { indent, columns } = store.states;
    const rowClasses = getRowClass(row, rowIndex);
    let display = true;

    if (treeNode) {
      rowClasses.push(ns.em('row', `level-${treeNode.level}`));
      display = !(treeNode.display === false);
    }

    const displayStyle = display
      ? null
      : { display: 'none' };

    return <tr {...{
      style: [displayStyle, getRowStyle(row, rowIndex)],
      class: rowClasses,
      key: getKeyOfRow(row, rowIndex),
      onDblclick: $event => handleDoubleClick($event, row),
      onClick: $event => handleClick($event, row),
      onContextmenu: $event => handleContextMenu($event, row),
      onMouseenter: () => handleMouseEnter(rowIndex),
      onMouseleave: handleMouseLeave,
    }}>
      {columns.value.map((column, cellIndex) => {
        const { rowspan, colspan } = getSpan(row, column, rowIndex, cellIndex);

        if (!rowspan || !colspan) return null;

        const columnData: TableColumnCtx = {
          ...column,
          realWidth: getColspanRealWidth(columns.value, colspan, cellIndex),
        };

        const data: RenderRowData = {
          store,
          table,
          column: columnData,
          row,
          rowIndex,
          cellIndex,
          expanded,
        };

        if (cellIndex === firstDefaultColumnIndex.value && treeNode) {
          data.treeNode = {
            ...treeNode,
            indent: (treeNode.level || 0) * indent.value,
            level: treeNode.level,
          };
        }

        const baseKey = `${rowIndex},${cellIndex}`;
        const patchKey = columnData.columnKey || columnData.rawColumnKey || '';
        const tdChildren = column.renderCell(data);
        return <td {...{
          style: getCellStyle(rowIndex, cellIndex, row, column),
          class: getCellClass(rowIndex, cellIndex, row, column, colspan - 1),
          key: `${patchKey}${baseKey}`,
          rowspan,
          colspan,
          onMouseenter: $event =>
            handleCellMouseEnter($event, row, tooltipEffect),
          onMouseleave: handleCellMouseLeave,
        }}>{tdChildren}</td>;
      })}
    </tr>;
  };

  const renderWrappedRow = (row: DefaultRow, rowIndex: number) => {
    const store = inject(STORE_INJECTION_KEY)!;
    const { treeData, lazyTreeNodeMap, childrenColumnName, rowKey } = store.states;
    const columns = store.states.columns.value;

    const renderWithExpand = () => {
      const expanded = store.expand.isRowExpanded(row);
      const tr = renderRow(row, rowIndex, undefined, expanded);
      const renderExpanded = table.renderExpanded;

      if (expanded && !renderExpanded) {
        console.error('[Lemon Peel Error]renderExpanded is required.');
        return tr;
      } else if (expanded && renderExpanded) {
        // 使用二维数组，避免修改 $index
        // Use a matrix to avoid modifying $index
        return [[
          tr,
          <tr key={`expanded-row__${tr.key as string}`}>
            <td colspan={columns.length} class={`${ns.e('cell')} ${ns.e('expanded-cell')}`}>
              {renderExpanded({ row, rowIndex, store, expanded })}
            </td>
          </tr>,
        ]];
      } else {
        // 使用二维数组，避免修改 $index
        // Use a two dimensional array avoid modifying $index
        return [[tr]];
      }
    };

    const renderWithTree = () => {
      store.watcher.assertRowKey();
      // TreeTable 时，rowKey 必须由用户设定，不使用 getKeyOfRow 计算
      // 在调用 rowRender 函数时，仍然会计算 rowKey，不太好的操作
      const key = getRowIdentity(row, rowKey.value!);
      let node = treeData.value[key];

      if (!node) return [renderRow(row, rowIndex)];

      const nodeList = [renderRow(row, rowIndex, node)];

      // 渲染嵌套数据
      // currentRow 记录的是 index，所以还需主动增加 TreeTable 的 index
      let i = 0;
      const traverse = (children: DefaultRow[], parent: DefaultRow) => {
        if (!(children && children.length > 0 && parent)) return;
        children.forEach(row => {

          const childKey = getRowIdentity(row, rowKey.value!);

          if (childKey === undefined || childKey === null) {
            throw new Error('For nested data item, row-key is required.');
          }

          node = treeData.value[childKey] || {
            children: [],
          };

          // 父节点的 display 状态影响子节点的显示状态
          // 对于当前节点，分成有无子节点两种情况。
          // 如果包含子节点的，设置 expanded 属性。
          // 对于它子节点的 display 属性由它本身的 expanded 与 display 共同决定。
          // 懒加载的某些节点，level 未知
          Object.assign(node, {
            display: parent.display && parent.expanded,
            level: parent.level + 1,
          });

          i++;
          nodeList.push(renderRow(row, rowIndex + i, node));

          const nodes = lazyTreeNodeMap.value[childKey]
            || row[childrenColumnName.value];

          traverse(nodes, node);
        });
      };

      // 对于 root 节点，display 一定为 true
      node.display = true;
      const nodes = lazyTreeNodeMap.value[key] || row[childrenColumnName.value];

      traverse(nodes, node);
      return nodeList;
    };

    return columns.some(({ type }) => type === 'expand')
      ? renderWithExpand()
      : Object.keys(treeData.value).length > 0
        ? renderWithTree()
        : renderRow(row, rowIndex);
  };

  return { renderWrappedRow };
}

export default useRender;
