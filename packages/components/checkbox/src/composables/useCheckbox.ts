import { useFormItem, useFormItemInputId } from '@lemon-peel/hooks';
import { isArray } from '@lemon-peel/utils';
import { useCheckboxDisabled } from './useCheckboxDisabled';
import { useCheckboxEvent } from './useCheckboxEvent';
import { useCheckboxModel } from './useCheckboxModel';
import { useCheckboxStatus } from './useCheckboxStatus';

import type { ComponentInternalInstance } from 'vue';
import type { CheckboxProps } from '../checkbox';
import type { CheckboxModel } from './useCheckboxModel';

const setStoreValue = (
  props: CheckboxProps,
  { model }: Pick<CheckboxModel, 'model'>,
) => {
  function addToStore() {
    if (isArray(model.value) && !model.value.includes(props.label)) {
      model.value.push(props.label);
    } else {
      model.value = props.trueLabel || true;
    }
  }
  props.checked && addToStore();
};

export const useCheckbox = (
  properties: CheckboxProps,
  slots: ComponentInternalInstance['slots'],
) => {
  const { formItem: elementFormItem } = useFormItem();
  const { model, isGroup, isLimitExceeded } = useCheckboxModel(properties);
  const {
    isFocused,
    isChecked,
    checkboxButtonSize,
    checkboxSize,
    hasOwnLabel,
  } = useCheckboxStatus(properties, slots, { model });
  const { isDisabled } = useCheckboxDisabled({ model, isChecked });
  const { inputId, isLabeledByFormItem } = useFormItemInputId(properties, {
    formItemContext: elementFormItem,
    disableIdGeneration: hasOwnLabel,
    disableIdManagement: isGroup,
  });
  const { handleChange, onClickRoot } = useCheckboxEvent(properties, {
    model,
    isLimitExceeded,
    hasOwnLabel,
    isDisabled,
    isLabeledByFormItem,
  });

  setStoreValue(properties, { model });

  return {
    inputId,
    isLabeledByFormItem,
    isChecked,
    isDisabled,
    isFocused,
    checkboxButtonSize,
    checkboxSize,
    hasOwnLabel,
    model,
    handleChange,
    onClickRoot,
  };
};
