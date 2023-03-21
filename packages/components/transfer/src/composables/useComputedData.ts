import { computed } from 'vue';
import { usePropsAlias } from './usePropsAlias';

import type { TransferDataItem, TransferKey, TransferProps } from '../transfer';

export const useComputedData = (props: TransferProps) => {
  const propsAlias = usePropsAlias(props);

  const dataObj = computed(() =>
    props.data.reduce((o, cur) => (o[cur[propsAlias.value.key]] = cur) && o, {}),
  );

  const sourceData = computed(() =>
    props.data.filter(
      item => !props.value.includes(item[propsAlias.value.key]),
    ),
  );

  const targetData = computed(() => {
    return props.targetOrder === 'original' ? props.data.filter(item =>
      props.value.includes(item[propsAlias.value.key]),
    ) : props.value.reduce(
      (arr: TransferDataItem[], cur: TransferKey) => {
        const val = dataObj.value[cur];
        if (val) {
          arr.push(val);
        }
        return arr;
      },
      [],
    );
  });

  return {
    sourceData,
    targetData,
  };
};
