import { getCurrentInstance, useAttrs, useSlots } from 'vue';
import dayjs from 'dayjs';
import { debugWarn, isFunction } from '@lemon-peel/utils';

import type { useLocale } from '@lemon-peel/hooks';
import type { Shortcut } from '../datePicker.type';


export const useShortcut = (lang: ReturnType<typeof useLocale>['lang']) => {
  const { emit } = getCurrentInstance()!;
  const attrs = useAttrs();
  const slots = useSlots();

  const handleShortcutClick = (shortcut: Shortcut) => {
    const shortcutValues = isFunction(shortcut.value)
      ? shortcut.value()
      : shortcut.value;

    if (shortcutValues && !Array.isArray(shortcutValues)) {
      return debugWarn('LpDatePicker', 'shortcut value for date range picker should be array of date.');
    }

    if (shortcutValues) {
      return emit('pick', [
        dayjs(shortcutValues[0]).locale(lang.value),
        dayjs(shortcutValues[1]).locale(lang.value),
      ]);
    }

    shortcut.onClick?.({
      attrs,
      slots,
      emit,
    });
  };

  return handleShortcutClick;
};
