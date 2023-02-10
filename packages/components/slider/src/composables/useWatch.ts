import { watch } from 'vue';
import { INPUT_EVENT, UPDATE_MODEL_EVENT } from '@lemon-peel/constants';
import { debugWarn, throwError } from '@lemon-peel/utils';
import type { ComputedRef, SetupContext } from 'vue';
import type { Arrayable } from '@lemon-peel/utils';
import type { FormItemContext } from '@lemon-peel/tokens';
import type { SliderEmits, SliderInitData, SliderProps } from '../slider';

export const useWatch = (
  props: SliderProps,
  initData: SliderInitData,
  minValue: ComputedRef<number>,
  maxValue: ComputedRef<number>,
  emit: SetupContext<SliderEmits>['emit'],
  elFormItem: FormItemContext,
) => {
  const emitUpdate = (val: Arrayable<number>) => {
    emit(UPDATE_MODEL_EVENT, val);
    emit(INPUT_EVENT, val);
  };

  const valueChanged = () => {
    return props.range ? ![minValue.value, maxValue.value].every(
      (item, index) => item === (initData.oldValue as number[])[index],
    ) : props.modelValue !== initData.oldValue;
  };

  const setValues = () => {
    if (props.min > props.max) {
      throwError('Slider', 'min should not be greater than max.');
      return;
    }
    const val = props.modelValue;
    if (props.range && Array.isArray(val)) {
      if (val[1] < props.min) {
        emitUpdate([props.min, props.min]);
      } else if (val[0] > props.max) {
        emitUpdate([props.max, props.max]);
      } else if (val[0] < props.min) {
        emitUpdate([props.min, val[1]]);
      } else if (val[1] > props.max) {
        emitUpdate([val[0], props.max]);
      } else {
        initData.firstValue = val[0];
        initData.secondValue = val[1];
        if (valueChanged()) {
          if (props.validateEvent) {
            elFormItem?.validate?.('change').catch(error => debugWarn(error));
          }
          initData.oldValue = [...val];
        }
      }
    } else if (!props.range && typeof val === 'number' && !Number.isNaN(val)) {
      if (val < props.min) {
        emitUpdate(props.min);
      } else if (val > props.max) {
        emitUpdate(props.max);
      } else {
        initData.firstValue = val;
        if (valueChanged()) {
          if (props.validateEvent) {
            elFormItem?.validate?.('change').catch(error => debugWarn(error));
          }
          initData.oldValue = val;
        }
      }
    }
  };

  setValues();

  watch(
    () => initData.dragging,
    val => {
      if (!val) {
        setValues();
      }
    },
  );

  watch(
    () => props.modelValue,
    (val, oldVal) => {
      if (
        initData.dragging ||
        (Array.isArray(val) &&
          Array.isArray(oldVal) &&
          val.every((item, index) => item === oldVal[index]) &&
          initData.firstValue === val[0] &&
          initData.secondValue === val[1])
      ) {
        return;
      }
      setValues();
    },
    {
      deep: true,
    },
  );

  watch(
    () => [props.min, props.max],
    () => {
      setValues();
    },
  );
};
