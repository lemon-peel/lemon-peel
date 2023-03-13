import type { InjectionKey, UnwrapNestedRefs } from 'vue';
import type { CheckboxGroupProps } from '@lemon-peel/components';

type CheckboxGroupContext = UnwrapNestedRefs<{
  changeEvent?: (val: CheckboxGroupProps['value']) => any;
} & Pick<CheckboxGroupProps, 'value' | 'size' | 'disabled' | 'validateEvent' | 'fill' | 'textColor'>>;

export const checkboxGroupContextKey: InjectionKey<CheckboxGroupContext> =
  Symbol('checkboxGroupContextKey');
