import { computed, ref, unref, watch } from 'vue';

import type { TableV2Props } from '../table';
import type { KeyType } from '../types';
import type { UseRowReturn } from './useRow';

type UseDataProps = {
  expandedRowKeys: UseRowReturn['expandedRowKeys'];
  lastRenderedRowIndex: UseRowReturn['lastRenderedRowIndex'];
  resetAfterIndex: UseRowReturn['resetAfterIndex'];
};

export function useData(props: TableV2Props, { expandedRowKeys, lastRenderedRowIndex, resetAfterIndex }: UseDataProps) {
  const depthMap = ref<Record<KeyType, number>>({});

  const flattenedData = computed(() => {
    const depths: Record<KeyType, number> = {};
    const { data, rowKey } = props;

    const localExpandedRowKeys = unref(expandedRowKeys);

    if (!localExpandedRowKeys || localExpandedRowKeys.length === 0) return data;

    const array: any[] = [];
    const keysSet = new Set();
    for (const x of localExpandedRowKeys) keysSet.add(x);

    let copy: any[] = [...data];
    for (const x of copy) (depths[x[rowKey]] = 0);
    while (copy.length > 0) {
      const item = copy.shift()!;

      array.push(item);
      if (
        keysSet.has(item[rowKey]) &&
        Array.isArray(item.children) &&
        item.children.length > 0
      ) {
        copy = [...item.children, ...copy];
        item.children.forEach(
          (child: any) => (depths[child[rowKey]] = depths[item[rowKey]] + 1),
        );
      }
    }

    depthMap.value = depths;
    return array;
  });

  const data = computed(() => {
    return props.expandColumnKey ? unref(flattenedData) : props.data;
  });

  watch(data, (val, prev) => {
    if (val !== prev) {
      lastRenderedRowIndex.value = -1;
      resetAfterIndex(0, true);
    }
  });

  return {
    data,
    depthMap,
  };
}

export type UseDataReturn = ReturnType<typeof useData>;
