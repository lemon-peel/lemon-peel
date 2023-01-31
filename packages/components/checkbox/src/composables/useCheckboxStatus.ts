import { computed, inject, ref, toRaw } from 'vue';
import { isEqual } from 'lodash-unified';
import { useSize } from '@lemon-peel/hooks';
import { isArray, isBoolean, isObject } from '@lemon-peel/utils';
import { checkboxGroupContextKey } from '@lemon-peel/tokens';

import type { ComponentInternalInstance } from 'vue';
import type { CheckboxProps } from '../checkbox';
import type { CheckboxModel } from './index';

export const useCheckboxStatus = (
  props: CheckboxProps,
  slots: ComponentInternalInstance['slots'],
  { model }: Pick<CheckboxModel, 'model'>,
) => {
  const checkboxGroup = inject(checkboxGroupContextKey);
  const isFocused = ref(false);
  const isChecked = computed<boolean>(() => {
    const value = model.value;
    if (isBoolean(value)) {
      return value;
    } else if (isArray(value)) {
      return isObject(props.label) ? value.map(toRaw).some(o => isEqual(o, props.label)) : value.map(toRaw).includes(props.label);
    } else if (value !== null && value !== undefined) {
      return value === props.trueLabel;
    } else {
      return !!value;
    }
  });

  const checkboxButtonSize = useSize(
    computed(() => checkboxGroup?.size?.value),
    {
      prop: true,
    },
  );
  const checkboxSize = useSize(computed(() => checkboxGroup?.size?.value));

  const hasOwnLabel = computed<boolean>(() => {
    return !!(slots.default || props.label);
  });

  return {
    checkboxButtonSize,
    isChecked,
    isFocused,
    checkboxSize,
    hasOwnLabel,
  };
};

export type CheckboxStatus = ReturnType<typeof useCheckboxStatus>;
