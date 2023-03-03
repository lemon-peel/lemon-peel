import { computed, inject, ref } from 'vue';
import { radioGroupKey } from '@lemon-peel/tokens';
import { useDisabled, useSize } from '@lemon-peel/hooks';

import type { RadioGroupProps } from './radioGroup';
import type { RadioProps } from './radio';
import { debugWarn } from '@lemon-peel/utils';

export function inGroupGuard() {
  if (!inject(radioGroupKey, null)) {
    debugWarn('LpRadio', t() `LpRadio/LpRadioButton 组件必须使用 LpRadioGroup 包裹, 请勿单独使用.`);
  }
}

export function useRadio(
  props: RadioProps,
) {
  const radioRef = ref<HTMLInputElement>();
  const radioGroup = inject(radioGroupKey, null);

  const groupValue = computed<RadioGroupProps['modelValue']>({
    get() {
      return radioGroup!.modelValue;
    },
    set(val) {
      radioGroup!.changeEvent(val);
      radioRef.value!.checked = props.modelValue === props.label;
    },
  });

  const size = useSize(computed(() => radioGroup?.size));
  const disabled = useDisabled(computed(() => radioGroup?.disabled));
  const focus = ref(false);
  const tabIndex = computed(() => {
    return disabled.value || (isGroup.value && groupValue.value !== props.label)
      ? -1
      : 0;
  });

  return {
    radioRef,
    radioGroup,
    focus,
    size,
    disabled,
    tabIndex,
    modelValue: groupValue,
  };
}
