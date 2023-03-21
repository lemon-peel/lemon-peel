import { computed, getCurrentInstance, inject, toRaw, watch } from 'vue';
import { get } from 'lodash-es';
import { escapeStringRegexp } from '@lemon-peel/utils';

import { selectGroupKey, selectKey } from './token';

import type { OptionStates, OptionProps } from './option';
import type { QueryChangeCtx } from './token';

export function useOption(props: OptionProps, states: OptionStates) {
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
      return get(a, valueKey!) === get(b, valueKey!);
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
          return toRaw(get(item, valueKey!)) === get(target, valueKey!);
        })
      );
    } else {
      return arr && arr.includes(target);
    }
  };

  const itemSelected = computed(() => {
    return select.props.multiple ? contains(select.props.value as unknown[], props.value) : isEqual(props.value, select.props.value);
  });

  const limitReached = computed(() => {
    if (select.props.multiple) {
      const value = (select.props.value || []) as unknown[];
      return (
        !itemSelected.value &&
        value.length >= select.props.multipleLimit! && select.props.multipleLimit! > 0
      );
    } else {
      return false;
    }
  });

  const currentLabel = computed<OptionProps['label']>(() => {
    return props.label || (isObject.value ? '' : props.value!.toString());
  });

  const currentValue = computed(() => {
    return props.value || props.label || '';
  });

  const isDisabled = computed(() => {
    return props.disabled || states.groupDisabled || limitReached.value;
  });

  const instance = getCurrentInstance()!;

  const hoverItem = () => {
    if (!props.disabled && !selectGroup.disabled) {
      select.hoverIndex = select.optionsArray.indexOf(instance.proxy);
    }
  };

  watch(
    () => currentLabel.value,
    () => {
      if (!select.props.remote) select.setSelected();
    },
  );

  watch(
    () => props.value,
    (val, oldVal) => {
      const { remote, valueKey } = select.props;

      if (!Object.is(val, oldVal)) {
        select.onOptionDestroy(oldVal as string, instance.proxy as any);
        select.onOptionCreate(instance.proxy as any);
      }

      if (!remote) {
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

  watch(
    () => select.queryChange,
    (changes: QueryChangeCtx) => {
      const { query } = changes;
      const regexp = new RegExp(escapeStringRegexp(`${query}`), 'i');
      states.visible = regexp.test(currentLabel.value as string);
      if (!states.visible) {
        select.filteredOptionsCount--;
      }
    },
  );

  return {
    select,
    currentLabel,
    currentValue,
    itemSelected,
    isDisabled,
    hoverItem,
  };
}
