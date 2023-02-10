import { computed, inject } from 'vue';
import type { LpDropdownInstance } from './dropdown';

export const useDropdown = () => {
  const lpDropdown = inject<LpDropdownInstance>('lpDropdown', {});
  const dropdownSize = computed(() => lpDropdown?.dropdownSize);

  return {
    lpDropdown,
    dropdownSize,
  };
};
