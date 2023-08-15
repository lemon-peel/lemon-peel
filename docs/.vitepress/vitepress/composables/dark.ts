import { useDark, useToggle } from '@vueuse/core';

export const isDark = useDark({
  storageKey: 'lp-theme-appearance',
});

export const toggleDark = useToggle(isDark);
