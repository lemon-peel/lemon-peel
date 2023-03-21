<template>
  <div
    :id="inputId"
    :class="[rateClasses, ns.is('disabled', rateDisabled)]"
    role="slider"
    :aria-label="!isLabeledByFormItem ? label || 'rating' : undefined"
    :aria-labelledby="
      isLabeledByFormItem ? formItemContext?.labelId : undefined
    "
    :aria-valuenow="currentValue"
    :aria-valuetext="text || undefined"
    aria-valuemin="0"
    :aria-valuemax="max"
    tabindex="0"
    :style="rateStyles"
    @keydown="handleKey"
  >
    <span
      v-for="(item, key) in max"
      :key="key"
      :class="ns.e('item')"
      @mousemove="setCurrentValue(item, $event)"
      @mouseleave="resetCurrentValue"
      @click="selectValue(item)"
    >
      <lp-icon
        :class="[
          ns.e('icon'),
          { hover: hoverIndex === item },
          ns.is('active', item <= currentValue),
        ]"
      >
        <template v-if="!showDecimalIcon(item)">
          <component :is="activeComponent" v-show="item <= currentValue" />
          <component :is="voidComponent" v-show="!(item <= currentValue)" />
        </template>
        <lp-icon
          v-if="showDecimalIcon(item)"
          :style="decimalStyle"
          :class="[ns.e('icon'), ns.e('decimal')]"
        >
          <component :is="decimalIconComponent" />
        </lp-icon>
      </lp-icon>
    </span>
    <span v-if="showText || showScore" :class="ns.e('text')">
      {{ text }}
    </span>
  </div>
</template>
<script lang="ts" setup>
import { computed, inject, markRaw, ref, watch } from 'vue';
import { EVENT_CODE, UPDATE_MODEL_EVENT } from '@lemon-peel/constants';
import { hasClass, isArray, isObject, isString } from '@lemon-peel/utils';
import { formContextKey, formItemContextKey } from '@lemon-peel/tokens';
import { LpIcon } from '@lemon-peel/components/icon';
import { useFormItemInputId, useNamespace, useSize } from '@lemon-peel/hooks';
import { rateEmits, rateProps } from './rate';
import type { iconPropType } from '@lemon-peel/utils';
import type { CSSProperties, Component } from 'vue';

function getValueFromMap<T>(
  value: number,
  map: Record<string, T | { excluded?: boolean, value: T }>,
) {
  const isExcludedObject = (
    value_: unknown,
  ): value_ is { excluded?: boolean } & Record<any, unknown> => isObject(value_);

  const matchedKeys = Object.keys(map)
    .map(key => +key)
    .filter(key => {
      const val = map[key];
      const excluded = isExcludedObject(val) ? val.excluded : false;
      return excluded ? value < key : value <= key;
    })
    .sort((a, b) => a - b);
  const matchedValue = map[matchedKeys[0]];
  return (isExcludedObject(matchedValue) && matchedValue.value) || matchedValue;
}

defineOptions({
  name: 'LpRate',
});

const props = defineProps(rateProps);
const emit = defineEmits(rateEmits);

const formContext = inject(formContextKey, null);
const formItemContext = inject(formItemContextKey, null);
const rateSize = useSize();
const ns = useNamespace('rate');
const { inputId, isLabeledByFormItem } = useFormItemInputId(props, {
  formItemContext,
});

const currentValue = ref(props.value);
const hoverIndex = ref(-1);
const pointerAtLeftHalf = ref(true);

const rateClasses = computed(() => [ns.b(), ns.m(rateSize.value)]);
const rateDisabled = computed(() => props.disabled || formContext?.disabled);
const colorMap = computed(() =>
  isArray(props.colors)
    ? {
      [props.lowThreshold]: props.colors[0],
      [props.highThreshold]: { value: props.colors[1], excluded: true },
      [props.max]: props.colors[2],
    }
    : props.colors,
);
const activeColor = computed(() => {
  const color = getValueFromMap(currentValue.value, colorMap.value);
  // {value: '', excluded: true} returned
  return isObject(color) ? '' : color;
});
const rateStyles = computed(() => {
  return ns.cssVarBlock({
    'void-color': props.voidColor,
    'disabled-void-color': props.disabledVoidColor,
    'fill-color': activeColor.value,
  }) as CSSProperties;
});

const text = computed(() => {
  let result = '';
  if (props.showScore) {
    result = props.scoreTemplate.replace(
      /{\s*value\s*}/,
      rateDisabled.value ? `${props.value}` : `${currentValue.value}`,
    );
  } else if (props.showText) {
    result = props.texts[Math.ceil(currentValue.value) - 1];
  }
  return result;
});
const valueDecimal = computed(
  () => props.value * 100 - Math.floor(props.value) * 100,
);

const decimalStyle = computed(() => {
  let width = '';
  if (rateDisabled.value) {
    width = `${valueDecimal.value}%`;
  } else if (props.allowHalf) {
    width = '50%';
  }
  return {
    color: activeColor.value,
    width,
  };
});
const componentMap = computed(() => {
  let icons = isArray(props.icons) ? [...props.icons] : { ...props.icons };
  icons = markRaw(icons) as
    | Array<string | Component>
    | Record<number, string | Component>;
  return isArray(icons)
    ? {
      [props.lowThreshold]: icons[0],
      [props.highThreshold]: {
        value: icons[1],
        excluded: true,
      },
      [props.max]: icons[2],
    }
    : icons;
});
const decimalIconComponent = computed(() =>
  getValueFromMap(props.value, componentMap.value),
);
const voidComponent = computed(() =>
  rateDisabled.value
    ? (isString(props.disabledVoidIcon)
      ? props.disabledVoidIcon
      : (markRaw(props.disabledVoidIcon) as typeof iconPropType))
    : (isString(props.voidIcon)
      ? props.voidIcon
      : (markRaw(props.voidIcon) as typeof iconPropType)),
);
const activeComponent = computed(() =>
  getValueFromMap(currentValue.value, componentMap.value),
);

function showDecimalIcon(item: number) {
  const showWhenDisabled =
    rateDisabled.value &&
    valueDecimal.value > 0 &&
    item - 1 < props.value &&
    item > props.value;
  const showWhenAllowHalf =
    props.allowHalf &&
    pointerAtLeftHalf.value &&
    item - 0.5 <= currentValue.value &&
    item > currentValue.value;
  return showWhenDisabled || showWhenAllowHalf;
}

function emitValue(value: number) {
  // if allow clear, and selected value is same as vModel:value, reset value to 0
  if (props.clearable && value === props.value) {
    value = 0;
  }

  emit(UPDATE_MODEL_EVENT, value);
  if (props.value !== value) {
    emit('change', value);
  }
}

function selectValue(value: number) {
  if (rateDisabled.value) {
    return;
  }
  if (props.allowHalf && pointerAtLeftHalf.value) {
    emitValue(currentValue.value);
  } else {
    emitValue(value);
  }
}

function handleKey(e: KeyboardEvent) {
  if (rateDisabled.value) {
    return;
  }
  let currentVal = currentValue.value;
  const code = e.code;
  if (code === EVENT_CODE.up || code === EVENT_CODE.right) {
    currentVal += props.allowHalf ? 0.5 : 1;
    e.stopPropagation();
    e.preventDefault();
  } else if (code === EVENT_CODE.left || code === EVENT_CODE.down) {
    currentVal -= props.allowHalf ? 0.5 : 1;
    e.stopPropagation();
    e.preventDefault();
  }
  currentVal = currentVal < 0 ? 0 : currentVal;
  currentVal = currentVal > props.max ? props.max : currentVal;
  emit(UPDATE_MODEL_EVENT, currentVal);
  emit('change', currentVal);
  return currentVal;
}

function setCurrentValue(value: number, event: MouseEvent) {
  if (rateDisabled.value) {
    return;
  }
  if (props.allowHalf) {
    // TODO: use cache via computed https://github.com/element-plus/element-plus/pull/5456#discussion_r786472092
    let target = event.target as HTMLElement;
    if (hasClass(target, ns.e('item'))) {
      target = target.querySelector(`.${ns.e('icon')}`)!;
    }
    if (target.clientWidth === 0 || hasClass(target, ns.e('decimal'))) {
      target = target.parentNode as HTMLElement;
    }
    pointerAtLeftHalf.value = event.offsetX * 2 <= target.clientWidth;
    currentValue.value = pointerAtLeftHalf.value ? value - 0.5 : value;
  } else {
    currentValue.value = value;
  }
  hoverIndex.value = value;
}

function resetCurrentValue() {
  if (rateDisabled.value) {
    return;
  }
  if (props.allowHalf) {
    pointerAtLeftHalf.value = props.value !== Math.floor(props.value);
  }
  currentValue.value = props.value;
  hoverIndex.value = -1;
}

watch(
  () => props.value,
  value => {
    currentValue.value = value;
    pointerAtLeftHalf.value = props.value !== Math.floor(props.value);
  },
);

if (!props.value) {
  emit(UPDATE_MODEL_EVENT, 0);
}

defineExpose({
  /** @description set current value */
  setCurrentValue,
  /** @description reset current value */
  resetCurrentValue,
});
</script>
