
import type { SetupContext } from 'vue';
import type { IOptionProps } from './token';

export function useOption(props: IOptionProps, { emit }: { emit: SetupContext['emit'] }) {
  return {
    hoverItem: () => {
      if (!props.disabled) {
        emit('hover', props.index);
      }
    },
    selectOptionClick: () => {
      if (!props.disabled) {
        emit('select', props.item, props.index);
      }
    },
  };
}
