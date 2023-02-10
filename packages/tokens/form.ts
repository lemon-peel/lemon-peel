import type { InjectionKey, SetupContext, UnwrapRef } from 'vue';
import type {
  RuleItem,
  ValidateError,
  ValidateFieldsError,
} from 'async-validator';
import type { ComponentSize } from '@lemon-peel/constants';
import type {
  FormEmits,
  FormItemProp,
  FormItemProps,
  FormItemValidateState,
  FormLabelWidthContext,
  FormProps,
} from '@lemon-peel/components/form';
import type { Arrayable } from '@lemon-peel/utils';

export interface FormItemRule extends RuleItem {
  trigger?: Arrayable<string>;
}
export type FormRules = Partial<Record<string, Arrayable<FormItemRule>>>;

export type FormValidationResult = Promise<boolean>;
export type FormValidateCallback = (
  isValid: boolean,
  invalidFields?: ValidateFieldsError
) => void;
export interface FormValidateFailure {
  errors: ValidateError[] | null;
  fields: ValidateFieldsError;
}

export type FormContext = FormProps &
UnwrapRef<FormLabelWidthContext> & {
  emit: SetupContext<FormEmits>['emit'];

  // expose
  addField: (field: FormItemContext) => void;
  removeField: (field: FormItemContext) => void;
  resetFields: (properties?: Arrayable<FormItemProp>) => void;
  clearValidate: (properties?: Arrayable<FormItemProp>) => void;
  validateField: (
    properties?: Arrayable<FormItemProp>,
    callback?: FormValidateCallback
  ) => FormValidationResult;
};

export interface FormItemContext extends FormItemProps {
  $el: HTMLDivElement | undefined;
  size: ComponentSize;
  validateState: FormItemValidateState;
  isGroup: boolean;
  labelId: string;
  inputIds: string[];
  hasLabel: boolean;
  addInputId: (id: string) => void;
  removeInputId: (id: string) => void;
  validate: (
    trigger: string,
    callback?: FormValidateCallback
  ) => FormValidationResult;
  resetField(): void;
  clearValidate(): void;
}

export const formContextKey: InjectionKey<FormContext> =
  Symbol('formContextKey');

export const formItemContextKey: InjectionKey<FormItemContext> =
  Symbol('formItemContextKey');
