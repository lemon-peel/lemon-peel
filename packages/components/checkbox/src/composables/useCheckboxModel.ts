import { computed, getCurrentInstance, inject, ref } from 'vue';
import { isArray, isUndefined } from '@lemon-peel/utils';
import { UPDATE_MODEL_EVENT } from '@lemon-peel/constants';
import { checkboxGroupContextKey } from '@lemon-peel/tokens';

import type { CheckboxProps } from '../checkbox';

export const useCheckboxModel = (props: CheckboxProps) => {
  const selfModel = ref<unknown>(false);
  const { emit } = getCurrentInstance()!;
  const checkboxGroup = inject(checkboxGroupContextKey);
  const isGroup = computed(() => isUndefined(checkboxGroup) === false);
  const isLimitExceeded = ref(false);
  const model = computed({
    get() {
      return isGroup.value
        ? checkboxGroup?.modelValue?.value
        : props.modelValue ?? selfModel.value;
    },

    set(value: unknown) {
      if (isGroup.value && isArray(value)) {
        isLimitExceeded.value =
          checkboxGroup?.max?.value !== undefined &&
          value.length > checkboxGroup?.max.value;
        isLimitExceeded.value === false && checkboxGroup?.changeEvent?.(value);
      } else {
        emit(UPDATE_MODEL_EVENT, value);
        selfModel.value = value;
      }
    },
  });

  return {
    model,
    isGroup,
    isLimitExceeded,
  };
};

export type CheckboxModel = ReturnType<typeof useCheckboxModel>;
