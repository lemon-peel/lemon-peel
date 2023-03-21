import type { InjectionKey } from 'vue';
import type { OptionProps } from './option';

interface SelectGroupContext {
  disabled: boolean;
}

export interface QueryChangeCtx {
  query: OptionProps['label'];
}

export interface SelectContext {
  props: {
    multiple?: boolean;
    multipleLimit?: number;
    valueKey?: string;
    modelValue?: string | number | unknown | unknown[];
    popperClass?: string;
    remote?: boolean;
    fitInputWidth?: boolean;
  };
  queryChange: QueryChangeCtx;
  groupQueryChange: string;
  selectWrapper: HTMLElement;
  hoverIndex: number;
  optionsCount: number;
  filteredOptionsCount: number;
  options: Map<any, any>;
  optionsArray: any[];
  selected: any | any[];
  setSelected(): void;
  onOptionCreate(vm: SelectOptionProxy): void;
  onOptionDestroy(key: OptionProps['value'], vm: SelectOptionProxy): void;
  handleOptionSelect(vm: unknown, byClick: boolean): void;
}

// For individual build sharing injection key, we had to make `Symbol` to string
export const selectGroupKey = Symbol('LpSelectGroup') as InjectionKey<SelectGroupContext>;

export const selectKey = Symbol('LpSelect') as InjectionKey<SelectContext>;

export interface SelectOptionProxy {
  $el: HTMLElement;
  value?: OptionProps['value'];
  label: OptionProps['label'];
  groupDisabled: boolean;
  disabled: OptionProps['disabled'];
  currentLabel: OptionProps['label'];
  itemSelected: boolean;
  isDisabled: boolean;
  hoverItem: () => void;
  visible: boolean;
  hover: boolean;
  selectOptionClick: () => void;
}
