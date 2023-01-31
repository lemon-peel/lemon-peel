import { computed, getCurrentInstance, inject, toRaw, unref, watch } from 'vue';
import { get } from 'lodash-unified';
import { escapeStringRegexp } from '@lemon-peel/utils';

import { selectGroupKey, selectKey } from './token';

import type { Ref, ExtractPropTypes } from 'vue';
import type { optionProps, OptionStates } from './option';
import type { QueryChangeCtx } from './token';

export function useOption(props: Readonly<ExtractPropTypes<typeof optionProps>>, states: OptionStates) {
  // inject
  const select = inject(selectKey)!;
  const selectGroup = inject(selectGroupKey, { disabled: false });

  // computed
  const isObject = computed(() => {
    return (
      Object.prototype.toString.call(props.value).toLowerCase() ===
      '[object object]'
    );
  });

  const isEqual = (a: unknown, b: unknown) => {
    if (isObject.value) {
      const { valueKey } = select.props;
      return get(a, valueKey) === get(b, valueKey);
    } else {
      return a === b;
    }
  };

  const contains = (arr: any[] = [], target?: any) => {
    if (isObject.value) {
      const valueKey = select.props.valueKey;
      return (
        arr &&
        arr.some(item => {
          return toRaw(get(item, valueKey)) === get(target, valueKey);
        })
      );
    } else {
      return arr && arr.includes(target);
    }
  };

  const itemSelected = computed(() => {
    return select.props.multiple ? contains(select.props.modelValue as unknown[], props.value) : isEqual(props.value, select.props.modelValue);
  });

  const limitReached = computed(() => {
    if (select.props.multiple) {
      const modelValue = (select.props.modelValue || []) as unknown[];
      return (
        !itemSelected.value &&
        modelValue.length >= select.props.multipleLimit &&
        select.props.multipleLimit > 0
      );
    } else {
      return false;
    }
  });

  const currentLabel = computed(() => {
    return props.label || (isObject.value ? '' : props.value);
  });

  const currentValue = computed(() => {
    return props.value || props.label || '';
  });

  const isDisabled = computed(() => {
    return props.disabled || states.groupDisabled || limitReached.value;
  });

  const instance = getCurrentInstance();

  const hoverItem = () => {
    if (!props.disabled && !selectGroup.disabled) {
      select.hoverIndex = select.optionsArray.indexOf(instance.proxy);
    }
  };

  watch(
    () => currentLabel.value,
    () => {
      if (!props.created && !select.props.remote) select.setSelected();
    },
  );

  watch(
    () => props.value,
    (val, oldVal) => {
      const { remote, valueKey } = select.props;

      if (!Object.is(val, oldVal)) {
        select.onOptionDestroy(oldVal, instance.proxy);
        select.onOptionCreate(instance.proxy);
      }

      if (!props.created && !remote) {
        if (
          valueKey &&
          typeof val === 'object' &&
          typeof oldVal === 'object' &&
          val[valueKey] === oldVal[valueKey]
        ) {
          return;
        }
        select.setSelected();
      }
    },
  );

  watch(
    () => selectGroup.disabled,
    () => {
      states.groupDisabled = selectGroup.disabled;
    },
    { immediate: true },
  );

  const { queryChange } = toRaw(select);
  watch(queryChange, (changes: Ref<QueryChangeCtx>) => {
    const { query } = unref(changes);

    const regexp = new RegExp(escapeStringRegexp(query), 'i');
    states.visible = regexp.test(currentLabel.value) || props.created;
    if (!states.visible) {
      select.filteredOptionsCount--;
    }
  });

  return {
    select,
    currentLabel,
    currentValue,
    itemSelected,
    isDisabled,
    hoverItem,
  };
}
