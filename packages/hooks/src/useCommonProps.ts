import { computed, inject, ref, unref } from 'vue';
import { formContextKey, formItemContextKey } from '@lemon-peel/tokens';
import { buildProp } from '@lemon-peel/utils';
import { componentSizes, defaultSize } from '@lemon-peel/constants';

import { useProp } from './useProp';
import { useGlobalConfig } from './useGlobalConfig';

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

  const size = ignore.prop ? emptyReference : useProp<ComponentSize>('size');
  const globalConfig = ignore.global ? emptyReference : useGlobalConfig('size');
  const form = ignore.form
    ? { size: undefined }
    : inject(formContextKey, null);
  const formItem = ignore.formItem
    ? { size: undefined }
    : inject(formItemContextKey, null);

  return computed(
    (): ComponentSize =>
      size.value ||
      unref(fallback) ||
      formItem?.size ||
      form?.size ||
      globalConfig.value ||
      defaultSize,
  );
};

export const useDisabled = (fallback?: MaybeRef<boolean | undefined>) => {
  const disabled = useProp<boolean>('disabled');
  const form = inject(formContextKey, null);
  return computed(
    () => disabled.value || unref(fallback) || form?.disabled || false,
  );
};
