import type { InjectionKey, SetupContext } from 'vue';
import type { CssNamespace } from '@lemon-peel/hooks/src';

interface DatePickerContext {
  slots: SetupContext['slots'];
  pickerNs: CssNamespace;
}

export const ROOT_PICKER_INJECTION_KEY: InjectionKey<DatePickerContext> =
  Symbol();
