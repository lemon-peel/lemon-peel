import { computed, watch } from 'vue';
import { isFunction } from '@lemon-peel/utils';
import { CHECKED_CHANGE_EVENT } from '../transferPanel';
import { usePropsAlias } from './usePropsAlias';

import type { SetupContext } from 'vue';
import type { CheckboxValueType } from '@lemon-peel/components/checkbox';
import type { TransferKey } from '../transfer';
import type { TransferPanelEmits, TransferPanelProps, TransferPanelState } from '../transferPanel';

export const useCheck = (
  props: TransferPanelProps,
  panelState: TransferPanelState,
  emit: SetupContext<TransferPanelEmits>['emit'],
) => {
  const propsAlias = usePropsAlias(props);

  const filteredData = computed(() => {
    return props.data.filter(item => {
      if (isFunction(props.filterMethod)) {
        return props.filterMethod(panelState.query, item);
      } else {
        const label = String(
          item[propsAlias.value.label] || item[propsAlias.value.key],
        );
        return label.toLowerCase().includes(panelState.query.toLowerCase());
      }

    });
  });

  const checkableData = computed(() =>
    filteredData.value.filter(item => !item[propsAlias.value.disabled]),
  );

  const checkedSummary = computed(() => {
    const checkedLength = panelState.checked.length;
    const dataLength = props.data.length;
    const { noChecked, hasChecked } = props.format;

    if (noChecked && hasChecked) {
      return checkedLength > 0
        ? hasChecked
          .replaceAll('${checked}', checkedLength.toString())
          .replaceAll('${total}', dataLength.toString())
        : noChecked.replaceAll('${total}', dataLength.toString());
    } else {
      return `${checkedLength}/${dataLength}`;
    }
  });

  const isIndeterminate = computed(() => {
    const checkedLength = panelState.checked.length;
    return checkedLength > 0 && checkedLength < checkableData.value.length;
  });

  const updateAllChecked = () => {
    const checkableDataKeys = checkableData.value.map(
      item => item[propsAlias.value.key],
    );
    panelState.allChecked =
      checkableDataKeys.length > 0 &&
      checkableDataKeys.every(item => panelState.checked.includes(item));
  };

  const handleAllCheckedChange = (value: CheckboxValueType) => {
    panelState.checked = value
      ? checkableData.value.map(item => item[propsAlias.value.key])
      : [];
  };

  watch(
    () => panelState.checked,
    (val, oldVal) => {
      updateAllChecked();

      if (panelState.checkChangeByUser) {
        const movedKeys = val
          .concat(oldVal)
          .filter(v => !val.includes(v) || !oldVal.includes(v));
        emit(CHECKED_CHANGE_EVENT, val, movedKeys);
      } else {
        emit(CHECKED_CHANGE_EVENT, val);
        panelState.checkChangeByUser = true;
      }
    },
  );

  watch(checkableData, () => {
    updateAllChecked();
  });

  watch(
    () => props.data,
    () => {
      const checked: TransferKey[] = [];
      const filteredDataKeys = new Set(filteredData.value.map(
        item => item[propsAlias.value.key],
      ));
      for (const item of panelState.checked) {
        if (filteredDataKeys.has(item)) {
          checked.push(item);
        }
      }
      panelState.checkChangeByUser = false;
      panelState.checked = checked;
    },
  );

  watch(
    () => props.defaultChecked,
    (val, oldVal) => {
      if (
        oldVal &&
        val.length === oldVal.length &&
        val.every(item => oldVal.includes(item))
      )
        return;

      const checked: TransferKey[] = [];
      const checkableDataKeys = new Set(checkableData.value.map(
        item => item[propsAlias.value.key],
      ));

      for (const item of val) {
        if (checkableDataKeys.has(item)) {
          checked.push(item);
        }
      }
      panelState.checkChangeByUser = false;
      panelState.checked = checked;
    },
    {
      immediate: true,
    },
  );

  return {
    filteredData,
    checkableData,
    checkedSummary,
    isIndeterminate,
    updateAllChecked,
    handleAllCheckedChange,
  };
};
