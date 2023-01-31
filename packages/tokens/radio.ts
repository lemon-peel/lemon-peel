import type { RadioGroupProps } from '@lemon-peel/components';
import type { InjectionKey } from 'vue';

export interface RadioGroupContext extends RadioGroupProps {
  changeEvent: (value: RadioGroupProps['modelValue']) => void;
}

export const radioGroupKey: InjectionKey<RadioGroupContext> =
  Symbol('radioGroupKey');
