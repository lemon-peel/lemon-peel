import { computed, getCurrentInstance, inject, nextTick, watch } from 'vue';
import { useFormItem } from '@lemon-peel/hooks';
import { checkboxGroupContextKey } from '@lemon-peel/tokens';
import { debugWarn } from '@lemon-peel/utils';

import type { useFormItemInputId } from '@lemon-peel/hooks';
import type { CheckboxProps } from '../checkbox';
import type { CheckboxDisabled, CheckboxModel, CheckboxStatus } from './index';

export const useCheckboxEvent = (
  props: CheckboxProps,
  {
    model,
    isLimitExceeded,
    hasOwnLabel,
    isDisabled,
    isLabeledByFormItem,
  }: Pick<CheckboxModel, 'model' | 'isLimitExceeded'> &
  Pick<CheckboxStatus, 'hasOwnLabel'> &
  Pick<CheckboxDisabled, 'isDisabled'> &
  Pick<ReturnType<typeof useFormItemInputId>, 'isLabeledByFormItem'>,
) => {
  const checkboxGroup = inject(checkboxGroupContextKey);
  const { formItem } = useFormItem();
  const { emit } = getCurrentInstance()!;

  function getLabeledValue(value: string | number | boolean) {
    return value === props.trueLabel || value === true
      ? props.trueLabel ?? true
      : props.falseLabel ?? false;
  }

  function emitChangeEvent(
    checked: string | number | boolean,
    e: InputEvent | MouseEvent,
  ) {
    emit('change', getLabeledValue(checked), e);
  }

  function handleChange(e: Event) {
    if (isLimitExceeded.value) return;

    const target = e.target as HTMLInputElement;
    emit('change', getLabeledValue(target.checked), e);
  }

  async function onClickRoot(e: MouseEvent) {
    if (isLimitExceeded.value) return;

    if (!hasOwnLabel.value && !isDisabled.value && isLabeledByFormItem.value) {
      // fix: https://github.com/element-plus/element-plus/issues/9981
      const eventTargets: EventTarget[] = e.composedPath();
      const hasLabel = eventTargets.some(
        item => (item as HTMLElement).tagName === 'LABEL',
      );
      if (!hasLabel) {
        model.value = getLabeledValue(
          [false, props.falseLabel].includes(model.value),
        );
        await nextTick();
        emitChangeEvent(model.value, e);
      }
    }
  }

  const validateEvent = computed(
    () => checkboxGroup?.validateEvent || props.validateEvent,
  );

  watch(
    () => props.modelValue,
    () => {
      if (validateEvent.value) {
        formItem?.validate('change').catch(error => debugWarn(error));
      }
    },
  );

  return {
    handleChange,
    onClickRoot,
  };
};