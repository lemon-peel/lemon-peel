import type { InjectionKey, ToRefs, WritableComputedRef } from 'vue';
import type { CheckboxGroupProps } from '@lemon-peel/components';

type CheckboxGroupContext = {
  modelValue?: WritableComputedRef<any>;
  changeEvent?: (...arguments_: any) => any;
} & ToRefs<
Pick<
CheckboxGroupProps,
'size' | 'min' | 'max' | 'disabled' | 'validateEvent' | 'fill' | 'textColor'
>
>;

export const checkboxGroupContextKey: InjectionKey<CheckboxGroupContext> =
  Symbol('checkboxGroupContextKey');
