import { inject, watch } from 'vue';
import { hasOwn } from '@lemon-peel/utils';
import { parseMinWidth, parseWidth } from '../util';

import { STORE_INJECTION_KEY } from '../tokens';

import type { Ref } from 'vue';
import type { TableColumnCtx, TableColumnProps, ValueOf } from './defaults';

function getAllAliases(props: string[], aliases: Record<string, string>) {
  return props.reduce((pre, cur) => {
    pre[cur] = cur;
    return pre;
  }, aliases);
}

function useWatcher(props: TableColumnProps, columnConfig: Ref<Partial<TableColumnCtx>>) {
  const store = inject(STORE_INJECTION_KEY)!;

  const registerComplexWatchers = () => {
    const aliases = {
      realWidth: 'width',
      realMinWidth: 'minWidth',
    } as const;

    Object.entries(aliases)
      .forEach(([key, alias]) => {
        if (!hasOwn(props, alias)) return;
        watch(
          () => props[alias],
          newVal => {
            let value: ValueOf<TableColumnCtx> = newVal;
            if (alias === 'width' && key === 'realWidth') {
              value = parseWidth(newVal);
            }

            if (alias === 'minWidth' && key === 'realMinWidth') {
              value = parseMinWidth(newVal);
            }

            columnConfig.value[alias as 'width'] = value;
            columnConfig.value[key as 'minWidth'] = value;

            const updateColumns = alias === 'fixed';
            store.watcher.scheduleLayout(updateColumns);
          },
        );
      });
  };

  const registerNormalWatchers = () => {
    const keys = [
      'label',
      'filters',
      'filterMultiple',
      'sortable',
      'index',
      'formatter',
      'className',
      'labelClassName',
      'showOverflowTooltip',
    ];

    const aliases: Record<string, string> = {
      property: 'prop',
      align: 'realAlign',
      headerAlign: 'realHeaderAlign',
    };

    const allAliases = getAllAliases(keys, aliases);
    Object.keys(allAliases).forEach(key => {
      const columnKey = aliases[key];
      if (hasOwn(props, columnKey)) {
        watch(
          () => props[columnKey],
          newVal => {
            columnConfig.value[key as keyof TableColumnCtx] = newVal;
          },
        );
      }
    });
  };

  return {
    registerComplexWatchers,
    registerNormalWatchers,
  };
}

export default useWatcher;
