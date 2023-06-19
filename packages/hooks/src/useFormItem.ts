import { computed, inject, onMounted, onUnmounted, ref, toRef, watch } from 'vue';
import { formContextKey, formItemContextKey } from '@lemon-peel/tokens';
import { useId } from './useId';

import type { FormItemContext } from '@lemon-peel/tokens';
import type { ComputedRef, Ref, WatchStopHandle } from 'vue';

export const useFormItem = () => {
  const form = inject(formContextKey, null);
  const formItem = inject(formItemContextKey, null);
  return { form, formItem };
};

export type IUseFormItemInputCommonProps = {
  id?: string;
  label?: string | number | boolean | Record<string, any>;
};

export const useFormItemInputId = (
  properties: Partial<IUseFormItemInputCommonProps>,
  {
    formItemContext,
    disableIdGeneration,
    disableIdManagement,
  }: {
    formItemContext?: FormItemContext | null;
    disableIdGeneration?: ComputedRef<boolean> | Ref<boolean>;
    disableIdManagement?: ComputedRef<boolean> | Ref<boolean>;
  },
) => {
  if (!disableIdGeneration) {
    disableIdGeneration = ref<boolean>(false);
  }
  if (!disableIdManagement) {
    disableIdManagement = ref<boolean>(false);
  }

  const inputId = ref<string>();
  let idUnwatch: WatchStopHandle | undefined;

  const isLabeledByFormItem = computed<boolean>(() => {
    return !!(
      !properties.label &&
      formItemContext &&
      formItemContext.inputIds &&
      formItemContext.inputIds?.length <= 1
    );
  });

  // Generate id for ElFormItem label if not provided as prop
  onMounted(() => {
    idUnwatch = watch(
      [toRef(properties, 'id'), disableIdGeneration] as any,
      ([id, disableGeneration]: [string, boolean]) => {
        const newId = id ?? (disableGeneration ? undefined : useId().value);
        if (newId !== inputId.value) {
          if (formItemContext?.removeInputId) {
            inputId.value && formItemContext.removeInputId(inputId.value);
            if (!disableIdManagement?.value && !disableGeneration && newId) {
              formItemContext.addInputId?.(newId);
            }
          }
          inputId.value = newId;
        }
      },
      { immediate: true },
    );
  });

  onUnmounted(() => {
    idUnwatch && idUnwatch();
    if (formItemContext?.removeInputId) {
      inputId.value && formItemContext.removeInputId(inputId.value);
    }
  });

  return {
    isLabeledByFormItem,
    inputId,
  };
};
