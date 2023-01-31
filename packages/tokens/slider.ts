import type { SliderProps } from '@lemon-peel/components';
import type { ComputedRef, InjectionKey, Ref, ToRefs } from 'vue';

export interface SliderContext extends ToRefs<SliderProps> {
  precision: ComputedRef<number>;
  sliderSize: Ref<number>;
  emitChange: () => void;
  resetSize: () => void;
  updateDragging: (value: boolean) => void;
}

export const sliderContextKey: InjectionKey<SliderContext> =
  Symbol('sliderContextKey');
