import { computed, inject, ref, unref } from 'vue';
import { formContextKey, formItemContextKey } from '@lemon-peel/tokens';
import { buildProp } from '@lemon-peel/utils';
import { componentSizes } from '@lemon-peel/constants';
import { useProp as useProperty } from '../useProp';
import { useGlobalConfig } from '../useGlobalConfig';
import type { ComponentSize } from '@lemon-peel/constants';
import type { MaybeRef } from '@vueuse/core';

export const useSizeProp = buildProp({
  type: String,
  values: componentSizes,
  required: false,
} as const);

export const useSize = (
  fallback?: MaybeRef<ComponentSize | undefined>,
  ignore: Partial<Record<'prop' | 'form' | 'formItem' | 'global', boolean>> = {},
) => {
  const emptyReference = ref(undefined);

  const size = ignore.prop ? emptyReference : useProperty<ComponentSize>('size');
  const globalConfig = ignore.global ? emptyReference : useGlobalConfig('size');
  const form = ignore.form
    ? { size: undefined }
    : inject(formContextKey);
  const formItem = ignore.formItem
    ? { size: undefined }
    : inject(formItemContextKey);

  return computed(
    (): ComponentSize =>
      size.value ||
      unref(fallback) ||
      formItem?.size ||
      form?.size ||
      globalConfig.value ||
      '',
  );
};

export const useDisabled = (fallback?: MaybeRef<boolean | undefined>) => {
  const disabled = useProperty<boolean>('disabled');
  const form = inject(formContextKey);
  return computed(
    () => disabled.value || unref(fallback) || form?.disabled || false,
  );
};
