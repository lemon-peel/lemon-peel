import { computed, inject, ref, watch } from 'vue';
import { radioGroupKey } from '@lemon-peel/tokens';
import { useDisabled, useLocale, useSize } from '@lemon-peel/hooks';

import type { SetupContext } from 'vue';
import type { RadioProps } from './radio';
import { debugWarn } from '@lemon-peel/utils';

export function wrappedGuard() {
  if (!inject(radioGroupKey, null)) {
    const { t } = useLocale();
    debugWarn('LpRadio', t('lp.radio.shouldWrappedWithGroup'));
  }
}

export function useRadio(
  props: RadioProps,
  emit?: SetupContext['emit'],
) {
  const radioRef = ref<HTMLInputElement>(null as any);
  const radioGroup = inject(radioGroupKey, null);
  const isGrouped = !!radioGroup;
  const checkState = ref(!!props.checked);
  const isChecked = computed(() => isGrouped
    ? radioGroup.value === props.value
    : (checkState.value || !!props.checked));

  watch(
    () => props.checked,
    () => { checkState.value = !!props.checked; },
  );

  const size = useSize(computed(() => radioGroup?.size));
  const disabled = useDisabled(computed(() => radioGroup?.disabled));
  const focus = ref(false);
  const tabIndex = computed(() => {
    return disabled.value ? -1 : 0;
  });

  const onChange = (e: Event) => {
    checkState.value = true;
    isGrouped && radioGroup!.changeEvent(props.value);
    emit && (
      emit('change', e),
      emit('update:checked', true)
    );
  };

  return {
    radioRef,
    radioGroup,
    isChecked,
    focus,
    size,
    disabled,
    tabIndex,
    onChange,
  };
}
