import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '@lemon-peel/constants';
import { usePropsAlias } from './usePropsAlias';

import type { SetupContext } from 'vue';
import type { TransferCheckedState, TransferDataItem, TransferDirection, TransferEmits, TransferKey, TransferProps } from '../transfer';

export const useMove = (
  props: TransferProps,
  checkedState: TransferCheckedState,
  emit: SetupContext<TransferEmits>['emit'],
) => {
  const propsAlias = usePropsAlias(props);

  const callEmit = (
    value: TransferKey[],
    direction: TransferDirection,
    movedKeys: TransferKey[],
  ) => {
    emit(UPDATE_MODEL_EVENT, value);
    emit(CHANGE_EVENT, value, direction, movedKeys);
  };

  const addToLeft = () => {
    const currentValue = [...props.modelValue];

    for (const item of checkedState.rightChecked) {
      const index = currentValue.indexOf(item);
      if (index > -1) {
        currentValue.splice(index, 1);
      }
    }
    callEmit(currentValue, 'left', checkedState.rightChecked);
  };

  const addToRight = () => {
    let currentValue = [...props.modelValue];

    const itemsToBeMoved = props.data
      .filter((item: TransferDataItem) => {
        const itemKey = item[propsAlias.value.key];
        return (
          checkedState.leftChecked.includes(itemKey) &&
          !props.modelValue.includes(itemKey)
        );
      })
      .map(item => item[propsAlias.value.key]);

    currentValue =
      props.targetOrder === 'unshift'
        ? itemsToBeMoved.concat(currentValue)
        : currentValue.concat(itemsToBeMoved);

    if (props.targetOrder === 'original') {
      currentValue = props.data
        .filter(item => currentValue.includes(item[propsAlias.value.key]))
        .map(item => item[propsAlias.value.key]);
    }

    callEmit(currentValue, 'right', checkedState.leftChecked);
  };

  return {
    addToLeft,
    addToRight,
  };
};
