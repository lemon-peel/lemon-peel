import type { Nullable } from './../../../utils/typescript';

import { computed, nextTick, reactive, ref, shallowRef, toRaw, triggerRef, watch } from 'vue';
import { isObject, toRawType } from '@vue/shared';
import { get, isEqual, debounce as lodashDebounce } from 'lodash-es';
import { isClient } from '@vueuse/core';
import { CHANGE_EVENT, EVENT_CODE, UPDATE_MODEL_EVENT } from '@lemon-peel/constants';
import { debugWarn, getComponentSize, isFunction, isKorean, isNumber, isString, scrollIntoView } from '@lemon-peel/utils';
import { useFormItem, useLocale, useNamespace, useSize } from '@lemon-peel/hooks';

import type { ComponentPublicInstance, ExtractPropTypes, Ref, ShallowRef, SetupContext } from 'vue';
import type LpTooltip from '@lemon-peel/components/tooltip';
import type { QueryChangeCtx, SelectOptionProxy } from './token';
import type { selectProps } from './select';

export function useSelectStates(props: Readonly<ExtractPropTypes<typeof selectProps>>) {
  const { t } = useLocale();
  return reactive({
    options: new Map(),
    cachedOptions: new Map<any, SelectOptionProxy>(),
    createdLabel: null as Nullable<any>,
    createdSelected: false,
    selected: props.multiple ? ([] as SelectOptionProxy[]) : ({} as any),
    inputLength: 20,
    inputWidth: 0,
    optionsCount: 0,
    filteredOptionsCount: 0,
    visible: false,
    softFocus: false,
    selectedLabel: '',
    hoverIndex: -1,
    query: '',
    previousQuery: null as Nullable<string>,
    inputHovering: false,
    cachedPlaceHolder: '',
    currentPlaceholder: t('el.select.placeholder'),
    menuVisibleOnFocus: false,
    isOnComposition: false,
    isSilentBlur: false,
    prefixWidth: 11,
    tagInMultiLine: false,
    mouseEnter: false,
  });
}

type States = ReturnType<typeof useSelectStates>;

export function useSelect(props: Readonly<ExtractPropTypes<typeof selectProps>>, states: States, emit: SetupContext['emit']) {
  const { t } = useLocale();
  const ns = useNamespace('select');

  // template refs
  const reference = ref<ComponentPublicInstance<{
    focus: () => void;
    blur: () => void;
    input: HTMLInputElement;
  }> | null>(null);

  const input: Ref<HTMLInputElement | null> = ref(null);
  const tooltipRef: Ref<InstanceType<typeof LpTooltip> | null> = ref(null);
  const tags: Ref<HTMLElement | null> = ref(null);
  const selectWrapper: Ref<HTMLElement | null> = ref(null);
  const scrollbar: Ref<{ handleScroll: () => void } | null> = ref(null);
  const hoverOption: Ref<SelectOptionProxy | null> = ref(null);
  const queryChange: ShallowRef<QueryChangeCtx> = shallowRef({ query: '' });
  const groupQueryChange = shallowRef('');

  const { form, formItem } = useFormItem();

  const readonly = computed(
    () => !props.filterable || props.multiple || !states.visible,
  );

  const selectDisabled = computed(() => props.disabled || form?.disabled);

  const showClose = computed(() => {
    const hasValue = props.multiple
      ? Array.isArray(props.modelValue) && props.modelValue.length > 0
      : props.modelValue !== undefined &&
        props.modelValue !== null &&
        props.modelValue !== '';

    const criteria =
      props.clearable &&
      !selectDisabled.value &&
      states.inputHovering &&
      hasValue;
    return criteria;
  });
  const iconComponent = computed(() =>
    props.remote && props.filterable && !props.remoteShowSuffix
      ? ''
      : props.suffixIcon,
  );
  const iconReverse = computed(() =>
    ns.is(
      'reverse',
      !!(iconComponent.value && states.visible && props.suffixTransition),
    ),
  );

  const debounce = computed(() => (props.remote ? 300 : 0));

  const emptyText = computed(() => {
    if (props.loading) {
      return props.loadingText || t('el.select.loading');
    } else {
      if (props.remote && states.query === '' && states.options.size === 0)
        return false;
      if (
        props.filterable &&
        states.query &&
        states.options.size > 0 &&
        states.filteredOptionsCount === 0
      ) {
        return props.noMatchText || t('el.select.noMatch');
      }
      if (states.options.size === 0) {
        return props.noDataText || t('el.select.noData');
      }
    }
    return null;
  });

  const optionsArray = computed(() => [...states.options.values()]);

  const cachedOptionsArray = computed(() =>
    [...states.cachedOptions.values()],
  );

  const showNewOption = computed(() => {
    const hasExistingOption = optionsArray.value
      .filter(option => {
        return !option.created;
      })
      .some(option => {
        return option.currentLabel === states.query;
      });
    return (
      props.filterable &&
      props.allowCreate &&
      states.query !== '' &&
      !hasExistingOption
    );
  });

  const selectSize = useSize();

  const collapseTagSize = computed(() =>
    ['small'].includes(selectSize.value) ? 'small' : 'default',
  );

  const dropMenuVisible = computed({
    get() {
      return states.visible && emptyText.value !== false;
    },
    set(val: boolean) {
      states.visible = val;
    },
  });

  // methods
  const resetInputHeight = () => {
    if (props.collapseTags && !props.filterable) return;
    nextTick(() => {
      if (!reference.value) return;
      const inputEle = reference.value.$el.querySelector('input') as HTMLInputElement;
      const tagList = tags.value;

      const sizeInMap = getComponentSize(selectSize.value || form?.size);
      // it's an inner input so reduce it by 2px.
      inputEle.style.height = `${
        (states.selected.length === 0
          ? sizeInMap
          : Math.max(
            tagList
              ? tagList.clientHeight + (tagList.clientHeight > sizeInMap ? 6 : 0)
              : 0,
            sizeInMap,
          )) - 2
      }px`;

      states.tagInMultiLine = Number.parseFloat(inputEle.style.height) >= sizeInMap;

      if (states.visible && emptyText.value !== false) {
        tooltipRef.value?.updatePopper?.();
      }
    });
  };

  // watch
  watch(
    [() => selectDisabled.value, () => selectSize.value, () => form?.size],
    () => {
      nextTick(() => {
        resetInputHeight();
      });
    },
  );

  watch(
    () => props.placeholder,
    val => {
      states.cachedPlaceHolder = states.currentPlaceholder = val || '';
    },
  );

  const managePlaceholder = () => {
    if (states.currentPlaceholder !== '') {
      states.currentPlaceholder = input.value!.value
        ? ''
        : states.cachedPlaceHolder;
    }
  };

  const getValueIndex = (arr: any[] = [], value?: any) => {
    if (!isObject(value)) return arr.indexOf(value);

    const valueKey = props.valueKey;
    let index = -1;
    arr.some((item, i) => {
      if (toRaw(get(item, valueKey)) === get(value, valueKey)) {
        index = i;
        return true;
      }
      return false;
    });
    return index;
  };

  /**
   * find and highlight first option as default selected
   * @remark
   * - if the first option in dropdown list is user-created,
   *   it would be at the end of the optionsArray
   *   so find it and set hover.
   *   (NOTE: there must be only one user-created option in dropdown list with query)
   * - if there's no user-created option in list, just find the first one as usual
   *   (NOTE: exclude options that are disabled or in disabled-group)
   */
  const checkDefaultFirstOption = () => {
    const optionsInDropdown = optionsArray.value.filter(
      n => n.visible && !n.disabled && !n.states.groupDisabled,
    );
    const userCreatedOption = optionsInDropdown.find(n => n.created);
    const firstOriginOption = optionsInDropdown[0];
    states.hoverIndex = getValueIndex(
      optionsArray.value,
      userCreatedOption || firstOriginOption,
    );
  };

  const handleQueryChange = async (val: string) => {
    if (states.previousQuery === val || states.isOnComposition) return;
    if (
      states.previousQuery === null &&
      (isFunction(props.filterMethod) || isFunction(props.remoteMethod))
    ) {
      states.previousQuery = val;
      return;
    }
    states.previousQuery = val;
    nextTick(() => {
      if (states.visible) tooltipRef.value?.updatePopper?.();
    });
    states.hoverIndex = -1;
    if (props.multiple && props.filterable) {
      nextTick(() => {
        const length = input.value!.value.length * 15 + 20;
        states.inputLength = props.collapseTags ? Math.min(50, length) : length;
        managePlaceholder();
        resetInputHeight();
      });
    }
    if (props.remote && isFunction(props.remoteMethod)) {
      states.hoverIndex = -1;
      props.remoteMethod(val);
    } else if (isFunction(props.filterMethod)) {
      props.filterMethod(val);
      triggerRef(groupQueryChange);
    } else {
      states.filteredOptionsCount = states.optionsCount;
      queryChange.value.query = val;

      triggerRef(queryChange);
      triggerRef(groupQueryChange);
    }
    if (
      props.defaultFirstOption &&
      (props.filterable || props.remote) &&
      states.filteredOptionsCount
    ) {
      await nextTick();
      checkDefaultFirstOption();
    }
  };

  const getOption = (value: any) => {
    let option;
    const isObjectValue = toRawType(value).toLowerCase() === 'object';
    const isNull = toRawType(value).toLowerCase() === 'null';
    const isUndefined = toRawType(value).toLowerCase() === 'undefined';

    for (let i = states.cachedOptions.size - 1; i >= 0; i--) {
      const cachedOption = cachedOptionsArray.value[i];
      const isEqualValue = isObjectValue
        ? get(cachedOption.value, props.valueKey) === get(value, props.valueKey)
        : cachedOption.value === value;
      if (isEqualValue) {
        option = {
          value,
          currentLabel: cachedOption.currentLabel,
          isDisabled: cachedOption.isDisabled,
        } as Partial<SelectOptionProxy>;
        break;
      }
    }
    if (option) return option;
    const label = isObjectValue
      ? value.label
      : (!isNull && !isUndefined
        ? value
        : '');
    const newOption: Partial<SelectOptionProxy> = {
      value,
      currentLabel: label,
    };
    if (props.multiple) {
      (newOption as any).hitState = false;
    }
    return newOption;
  };

  const setSelected = () => {
    if (props.multiple) {
      states.selectedLabel = '';
    } else {
      const option = getOption(props.modelValue);
      if (option.created) {
        states.createdLabel = option.value!;
        states.createdSelected = true;
      } else {
        states.createdSelected = false;
      }
      states.selectedLabel = option.currentLabel!;
      states.selected = option;
      if (props.filterable) states.query = states.selectedLabel;
      return;
    }
    const result: any[] = [];
    if (Array.isArray(props.modelValue)) {
      for (const value of props.modelValue) {
        result.push(getOption(value));
      }
    }
    states.selected = result;
    nextTick(() => {
      resetInputHeight();
    });
  };

  watch(
    () => props.modelValue,
    (val, oldVal) => {
      if (props.multiple) {
        resetInputHeight();
        states.currentPlaceholder = (val && Array.isArray(val) && val.length > 0) || (input.value && states.query !== '') ? '' : states.cachedPlaceHolder;
        if (props.filterable && !props.reserveKeyword) {
          states.query = '';
          handleQueryChange(states.query);
        }
      }
      setSelected();
      if (props.filterable && !props.multiple) {
        states.inputLength = 20;
      }
      if (!isEqual(val, oldVal) && props.validateEvent) {
        formItem?.validate('change').catch(error => debugWarn(error));
      }
    },
    {
      flush: 'post',
      deep: true,
    },
  );

  const getValueKey = (item: SelectOptionProxy) => {
    return isObject(item.value) ? get(item.value, props.valueKey) : item.value;
  };

  const resetHoverIndex = () => {
    setTimeout(() => {
      const valueKey = props.valueKey;
      if (props.multiple) {
        states.hoverIndex = states.selected.length > 0 ? Math.min.apply(
          null,
          states.selected.map((selected: SelectOptionProxy) => {
            return optionsArray.value.findIndex(item => {
              return get(item, valueKey) === get(selected, valueKey);
            });
          }),
        ) : -1;
      } else {
        states.hoverIndex = optionsArray.value.findIndex(item => {
          return getValueKey(item) === getValueKey(states.selected);
        });
      }
    }, 300);
  };

  watch(
    () => states.visible,
    val => {
      if (val) {
        tooltipRef.value?.updatePopper?.();

        if (props.filterable) {
          states.filteredOptionsCount = states.optionsCount;
          states.query = props.remote ? '' : states.selectedLabel;
          if (props.multiple) {
            input.value?.focus();
          } else {
            if (states.selectedLabel) {
              states.currentPlaceholder = `${states.selectedLabel}`;
              states.selectedLabel = '';
            }
          }
          handleQueryChange(states.query);
          if (!props.multiple && !props.remote) {
            queryChange.value.query = '';

            triggerRef(queryChange);
            triggerRef(groupQueryChange);
          }
        }
      } else {
        if (props.filterable) {
          if (isFunction(props.filterMethod)) {
            props.filterMethod('');
          }
          if (isFunction(props.remoteMethod)) {
            props.remoteMethod('');
          }
        }
        input.value && input.value.blur();
        states.query = '';
        states.previousQuery = null;
        states.selectedLabel = '';
        states.inputLength = 20;
        states.menuVisibleOnFocus = false;
        resetHoverIndex();
        nextTick(() => {
          if (
            input.value &&
            input.value.value === '' &&
            states.selected.length === 0
          ) {
            states.currentPlaceholder = states.cachedPlaceHolder;
          }
        });

        if (!props.multiple) {
          if (states.selected) {
            states.selectedLabel = props.filterable &&
              props.allowCreate &&
              states.createdSelected &&
              states.createdLabel ? states.createdLabel : states.selected.currentLabel;
            if (props.filterable) states.query = states.selectedLabel;
          }

          if (props.filterable) {
            states.currentPlaceholder = states.cachedPlaceHolder;
          }
        }
      }

      emit('visible-change', val);
    },
  );

  watch(
    // fix `Array.prototype.push/splice/..` cannot trigger non-deep watcher
    // https://github.com/vuejs/vue-next/issues/2116
    () => states.options.entries(),
    () => {
      if (!isClient) return;
      tooltipRef.value?.updatePopper?.();
      if (props.multiple) {
        resetInputHeight();
      }
      const inputs = selectWrapper.value?.querySelectorAll('input') || [];
      if (
        ![...inputs].includes(document.activeElement as HTMLInputElement)
      ) {
        setSelected();
      }
      if (
        props.defaultFirstOption &&
        (props.filterable || props.remote) &&
        states.filteredOptionsCount
      ) {
        checkDefaultFirstOption();
      }
    },
    {
      flush: 'post',
    },
  );

  watch(
    () => states.hoverIndex,
    val => {
      hoverOption.value = isNumber(val) && val > -1 ? optionsArray.value[val] || {} : {};
      for (const option of optionsArray.value) {
        option.hover = hoverOption.value === option;
      }
    },
  );

  const resetInputWidth = () => {
    states.inputWidth = reference.value?.$el.offsetWidth;
  };

  const handleResize = () => {
    resetInputWidth();
    tooltipRef.value?.updatePopper?.();
    if (props.multiple && !props.filterable) resetInputHeight();
  };

  const onInputChange = () => {
    if (props.filterable && states.query !== states.selectedLabel) {
      states.query = states.selectedLabel;
      handleQueryChange(states.query);
    }
  };

  const debouncedOnInputChange = lodashDebounce(() => {
    onInputChange();
  }, debounce.value);

  const debouncedQueryChange = lodashDebounce(e => {
    handleQueryChange(e.target.value);
  }, debounce.value);

  const emitChange = (val: typeof props.modelValue) => {
    if (!isEqual(props.modelValue, val)) {
      emit(CHANGE_EVENT, val);
    }
  };

  const toggleLastOptionHitState = (hit?: boolean) => {
    if (!Array.isArray(states.selected)) return;
    const option = states.selected[states.selected.length - 1];
    if (!option) return;

    if (hit === true || hit === false) {
      option.hitState = hit;
      return hit;
    }

    option.hitState = !option.hitState;
    return option.hitState;
  };

  const deletePrevTag = (e: KeyboardEvent) => {
    const ele = e.target as HTMLInputElement;
    if (ele.value.length <= 0 && !toggleLastOptionHitState()) {
      const value = [...(props.modelValue as Array<any>)];
      value.pop();
      emit(UPDATE_MODEL_EVENT, value);
      emitChange(value);
    }

    if (ele.value.length === 1 && (props.modelValue as string).length === 0) {
      states.currentPlaceholder = states.cachedPlaceHolder;
    }
  };

  const deleteTag = (event: Event, tag: SelectOptionProxy) => {
    const index = states.selected.indexOf(tag);
    if (index > -1 && !selectDisabled.value) {
      const value = [...(props.modelValue as Array<any>)];
      value.splice(index, 1);
      emit(UPDATE_MODEL_EVENT, value);
      emitChange(value);
      emit('remove-tag', tag.value);
    }
    event.stopPropagation();
  };

  const deleteSelected = (evt: Event) => {
    evt.stopPropagation();
    const value: string | any[] = props.multiple ? [] : '';
    if (!isString(value)) {
      for (const item of states.selected) {
        if (item.isDisabled) value.push(item.value);
      }
    }
    emit(UPDATE_MODEL_EVENT, value);
    emitChange(value);
    states.hoverIndex = -1;
    states.visible = false;
    emit('clear');
  };

  const setSoftFocus = () => {
    states.softFocus = true;
    const inputEle = input.value || reference.value;
    inputEle?.focus();
  };

  const scrollToOption = (option: SelectOptionProxy[] | SelectOptionProxy | null) => {
    const targetOption = Array.isArray(option) ? option[0] : option;
    let target = null;

    if (targetOption?.value) {
      const options = optionsArray.value.filter(
        item => item.value === targetOption.value,
      );
      if (options.length > 0) {
        target = options[0].$el;
      }
    }

    if (tooltipRef.value && target) {
      const menu = tooltipRef.value?.popperRef?.contentRef?.querySelector?.(
        `.${ns.be('dropdown', 'wrap')}`,
      );
      if (menu) {
        scrollIntoView(menu as HTMLElement, target);
      }
    }
    scrollbar.value?.handleScroll();
  };

  const handleOptionSelect = (option: SelectOptionProxy, byClick = false) => {
    if (props.multiple) {
      const value = [...(props.modelValue as Array<any>)];
      const optionIndex = getValueIndex(value, option.value);
      if (optionIndex > -1) {
        value.splice(optionIndex, 1);
      } else if (
        props.multipleLimit <= 0 ||
        value.length < props.multipleLimit
      ) {
        value.push(option.value);
      }
      emit(UPDATE_MODEL_EVENT, value);
      emitChange(value);
      if (option.created) {
        states.query = '';
        handleQueryChange('');
        states.inputLength = 20;
      }
      if (props.filterable) input.value?.focus();
    } else {
      emit(UPDATE_MODEL_EVENT, option.value);
      emitChange(option.value);
      states.visible = false;
    }
    states.isSilentBlur = byClick;
    setSoftFocus();
    if (states.visible) return;
    nextTick(() => {
      scrollToOption(option);
    });
  };

  const onOptionCreate = (vm: SelectOptionProxy) => {
    states.optionsCount++;
    states.filteredOptionsCount++;
    states.options.set(vm.value, vm);
    states.cachedOptions.set(vm.value, vm);
  };

  const onOptionDestroy = (key: any, vm: SelectOptionProxy) => {
    if (states.options.get(key) === vm) {
      states.optionsCount--;
      states.filteredOptionsCount--;
      states.options.delete(key);
    }
  };

  const resetInputState = (e: KeyboardEvent) => {
    if (e.code !== EVENT_CODE.backspace) toggleLastOptionHitState(false);
    states.inputLength = input.value!.value.length * 15 + 20;
    resetInputHeight();
  };

  const handleComposition = (event: CompositionEvent) => {
    const text = (event.target as HTMLInputElement).value;
    if (event.type === 'compositionend') {
      states.isOnComposition = false;
      nextTick(() => handleQueryChange(text));
    } else {
      const lastCharacter = text[text.length - 1] || '';
      states.isOnComposition = !isKorean(lastCharacter);
    }
  };

  const handleMenuEnter = () => {
    nextTick(() => scrollToOption(states.selected));
  };

  const handleFocus = (event: FocusEvent) => {
    if (states.softFocus) {
      states.softFocus = false;
    } else {
      if (props.automaticDropdown || props.filterable) {
        if (props.filterable && !states.visible) {
          states.menuVisibleOnFocus = true;
        }
        states.visible = true;
      }
      emit('focus', event);
    }
  };

  const blur = () => {
    states.visible = false;
    reference.value?.blur();
  };

  const handleBlur = (event: FocusEvent) => {
    // https://github.com/ElemeFE/element/pull/10822
    nextTick(() => {
      if (states.isSilentBlur) {
        states.isSilentBlur = false;
      } else {
        emit('blur', event);
      }
    });
    states.softFocus = false;
  };

  const handleClearClick = (event: Event) => {
    deleteSelected(event);
  };

  const handleClose = () => {
    states.visible = false;
  };

  const handleKeydownEscape = (event: KeyboardEvent) => {
    if (states.visible) {
      event.preventDefault();
      event.stopPropagation();
      states.visible = false;
    }
  };

  const toggleMenu = (e?: MouseEvent) => {
    if (e && !states.mouseEnter) {
      return;
    }
    if (!selectDisabled.value) {
      if (states.menuVisibleOnFocus) {
        states.menuVisibleOnFocus = false;
      } else {
        if (!tooltipRef.value || !tooltipRef.value.isFocusInsideContent()) {
          states.visible = !states.visible;
        }
      }
      if (states.visible) {
        (input.value || reference.value)?.focus();
      }
    }
  };

  const selectOption = () => {
    if (states.visible) {
      if (optionsArray.value[states.hoverIndex]) {
        handleOptionSelect(optionsArray.value[states.hoverIndex]);
      }
    } else {
      toggleMenu();
    }
  };

  const optionsAllDisabled = computed(() =>
    optionsArray.value
      .filter(option => option.visible)
      .every(option => option.disabled),
  );

  const navigateOptions = (direction: 'prev' | 'next') => {
    if (!states.visible) {
      states.visible = true;
      return;
    }
    if (states.options.size === 0 || states.filteredOptionsCount === 0) return;
    if (states.isOnComposition) return;

    if (!optionsAllDisabled.value) {
      if (direction === 'next') {
        states.hoverIndex++;
        if (states.hoverIndex === states.options.size) {
          states.hoverIndex = 0;
        }
      } else if (direction === 'prev') {
        states.hoverIndex--;
        if (states.hoverIndex < 0) {
          states.hoverIndex = states.options.size - 1;
        }
      }
      const option = optionsArray.value[states.hoverIndex];
      if (
        option.disabled === true ||
        option.states.groupDisabled === true ||
        !option.visible
      ) {
        navigateOptions(direction);
      }
      nextTick(() => scrollToOption(hoverOption.value));
    }
  };

  const handleMouseEnter = () => {
    states.mouseEnter = true;
  };

  const handleMouseLeave = () => {
    states.mouseEnter = false;
  };

  return {
    optionsArray,
    selectSize,
    handleResize,
    debouncedOnInputChange,
    debouncedQueryChange,
    deletePrevTag,
    deleteTag,
    deleteSelected,
    handleOptionSelect,
    scrollToOption,
    readonly,
    resetInputHeight,
    showClose,
    iconComponent,
    iconReverse,
    showNewOption,
    collapseTagSize,
    setSelected,
    managePlaceholder,
    selectDisabled,
    emptyText,
    toggleLastOptionHitState,
    resetInputState,
    handleComposition,
    onOptionCreate,
    onOptionDestroy,
    handleMenuEnter,
    handleFocus,
    blur,
    handleBlur,
    handleClearClick,
    handleClose,
    handleKeydownEscape,
    toggleMenu,
    selectOption,
    getValueKey,
    navigateOptions,
    dropMenuVisible,
    queryChange,
    groupQueryChange,

    // DOM ref
    reference,
    input,
    tooltipRef,
    tags,
    selectWrapper,
    scrollbar,

    // Mouser Event
    handleMouseEnter,
    handleMouseLeave,
  };
}
