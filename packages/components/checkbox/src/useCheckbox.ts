import { computed, inject, nextTick, ref, unref, watch } from 'vue';
import { useDisabled, useFormItem, useFormItemInputId, useSize } from '@lemon-peel/hooks';
import { debugWarn, isObject } from '@lemon-peel/utils';
import { checkboxGroupContextKey } from '@lemon-peel/tokens';
import { isEqual } from 'lodash-es';

import type { ComponentInternalInstance, SetupContext } from 'vue';
import type { checkboxEmits, CheckboxProps } from './checkbox';

export const useCheckbox = (
  props: CheckboxProps,
  slots: ComponentInternalInstance['slots'],
  emit: SetupContext<typeof checkboxEmits>['emit'],
) => {
  const { formItem } = useFormItem();

  const checkboxGroup = inject(checkboxGroupContextKey, null);
  const isGrouped = ref(!!checkboxGroup);
  const checkState = ref(!!props.checked);

  const isFocused = ref(false);
  const isChecked = computed(() => {
    return isGrouped.value
      ? checkboxGroup!.value.some(item => {
        const raw = unref(item);
        return isObject(raw) ? isEqual(raw, props.value) : raw === props.value;
      })
      : (checkState.value || !!props.checked);
  });

  const isDisabled = useDisabled(
    computed(() => checkboxGroup?.disabled),
  );

  const checkboxButtonSize = useSize(
    computed(() => checkboxGroup?.size),
    {
      prop: true,
    },
  );

  const checkboxSize = useSize(computed(() => checkboxGroup?.size));

  const hasOwnLabel = computed<boolean>(() => {
    return !!(slots.default || props.label);
  });

  const { inputId, isLabeledByFormItem } = useFormItemInputId(props, {
    formItemContext: formItem,
    disableIdGeneration: hasOwnLabel,
    disableIdManagement: isGrouped,
  });

  /* =---------------------------------= Event =---------------------------------= */
  const onChange = () => {
    const checked = !isChecked.value;
    if (isGrouped.value) {
      const val = checked
        ? checkboxGroup?.value.concat(props.value!)
        : checkboxGroup?.value.filter(item => {
          const raw = unref(item);
          return isObject(raw) ? !isEqual(raw, props.value) : raw !== props.value;
        });
      checkboxGroup?.changeEvent!(val!);
    }

    emit('update:checked', checked);
    emit('change', checked);
  };

  const onClickRoot = async (e: MouseEvent) => {
    if (!hasOwnLabel.value && !isDisabled.value && isLabeledByFormItem.value) {
      // fix: https://github.com/element-plus/element-plus/issues/9981
      const eventTargets: EventTarget[] = e.composedPath();
      const hasLabel = eventTargets.some(
        item => (item as HTMLElement).tagName === 'LABEL',
      );

      if (!hasLabel) {
        await nextTick();
        onChange();
      }
    }
  };

  const validateEvent = computed(
    () => checkboxGroup?.validateEvent || props.validateEvent,
  );

  watch(
    () => props.checked,
    () => {
      if (validateEvent.value) {
        formItem?.validate('change').catch(error => debugWarn(error));
      }
    },
  );

  return {
    inputId,
    isLabeledByFormItem,
    isChecked,
    isDisabled,
    isFocused,
    checkboxButtonSize,
    checkboxSize,
    hasOwnLabel,
    onChange,
    onClickRoot,
  };
};
