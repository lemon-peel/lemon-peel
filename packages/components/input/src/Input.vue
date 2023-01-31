<template>
  <div
    v-show="type !== 'hidden'"
    v-bind="containerAttrs"
    :class="[
      type === 'textarea' ? nsTextarea.b() : nsInput.b(),
      nsInput.m(inputSize),
      nsInput.is('disabled', inputDisabled),
      nsInput.is('exceed', inputExceed),
      {
        [nsInput.b('group')]: $slots.prepend || $slots.append,
        [nsInput.bm('group', 'append')]: $slots.append,
        [nsInput.bm('group', 'prepend')]: $slots.prepend,
        [nsInput.m('prefix')]: $slots.prefix || prefixIcon,
        [nsInput.m('suffix')]:
          $slots.suffix || suffixIcon || clearable || showPassword,
        [nsInput.bm('suffix', 'password-clear')]: showClear && showPwdVisible,
      },
      $attrs.class,
    ]"
    :style="containerStyle"
    :role="containerRole"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
  >
    <!-- input -->
    <template v-if="type !== 'textarea'">
      <!-- prepend slot -->
      <div v-if="$slots.prepend" :class="nsInput.be('group', 'prepend')">
        <slot name="prepend" />
      </div>

      <div :class="[nsInput.e('wrapper'), nsInput.is('focus', focused)]">
        <!-- prefix slot -->
        <span v-if="$slots.prefix || prefixIcon" :class="nsInput.e('prefix')">
          <span :class="nsInput.e('prefix-inner')">
            <slot name="prefix" />
            <lp-icon v-if="prefixIcon" :class="nsInput.e('icon')">
              <component :is="prefixIcon" />
            </lp-icon>
          </span>
        </span>

        <input
          :id="inputId"
          ref="input"
          :class="nsInput.e('inner')"
          v-bind="attrs"
          :type="showPassword ? (passwordVisible ? 'text' : 'password') : type"
          :disabled="inputDisabled"
          :formatter="formatter"
          :parser="parser"
          :readonly="readonly"
          :autocomplete="autocomplete"
          :tabindex="tabindex"
          :aria-label="label"
          :placeholder="placeholder"
          :style="inputStyle"
          :form="props.form"
          @compositionstart="handleCompositionStart"
          @compositionupdate="handleCompositionUpdate"
          @compositionend="handleCompositionEnd"
          @input="handleInput"
          @focus="handleFocus"
          @blur="handleBlur"
          @change="handleChange"
          @keydown="handleKeydown"
        >

        <!-- suffix slot -->
        <span v-if="suffixVisible" :class="nsInput.e('suffix')">
          <span :class="nsInput.e('suffix-inner')">
            <template
              v-if="!showClear || !showPwdVisible || !isWordLimitVisible"
            >
              <slot name="suffix" />
              <lp-icon v-if="suffixIcon" :class="nsInput.e('icon')">
                <component :is="suffixIcon" />
              </lp-icon>
            </template>
            <lp-icon
              v-if="showClear"
              :class="[nsInput.e('icon'), nsInput.e('clear')]"
              @mousedown.prevent="NOOP"
              @click="clear"
            >
              <circle-close />
            </lp-icon>
            <lp-icon
              v-if="showPwdVisible"
              :class="[nsInput.e('icon'), nsInput.e('password')]"
              @click="handlePasswordVisible"
            >
              <component :is="passwordIcon" />
            </lp-icon>
            <span v-if="isWordLimitVisible" :class="nsInput.e('count')">
              <span :class="nsInput.e('count-inner')">
                {{ textLength }} / {{ attrs.maxlength }}
              </span>
            </span>
            <lp-icon
              v-if="validateState && validateIcon && needStatusIcon"
              :class="[
                nsInput.e('icon'),
                nsInput.e('validateIcon'),
                nsInput.is('loading', validateState === 'validating'),
              ]"
            >
              <component :is="validateIcon" />
            </lp-icon>
          </span>
        </span>
      </div>

      <!-- append slot -->
      <div v-if="$slots.append" :class="nsInput.be('group', 'append')">
        <slot name="append" />
      </div>
    </template>

    <!-- textarea -->
    <template v-else>
      <textarea
        :id="inputId"
        ref="textarea"
        :class="nsTextarea.e('inner')"
        v-bind="attrs"
        :tabindex="tabindex"
        :disabled="inputDisabled"
        :readonly="readonly"
        :autocomplete="autocomplete"
        :style="textareaStyle"
        :aria-label="label"
        :placeholder="placeholder"
        :form="props.form"
        @compositionstart="handleCompositionStart"
        @compositionupdate="handleCompositionUpdate"
        @compositionend="handleCompositionEnd"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        @change="handleChange"
        @keydown="handleKeydown"
      />
      <span
        v-if="isWordLimitVisible"
        :style="countStyle"
        :class="nsInput.e('count')"
      >
        {{ textLength }} / {{ attrs.maxlength }}
      </span>
    </template>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  nextTick,
  onMounted,
  ref,
  shallowRef,
  toRef,
  useAttrs as useRawAttributes,
  useSlots,
  watch,
} from 'vue';
import { isClient, useResizeObserver } from '@vueuse/core';
import { isNil } from 'lodash-unified';
import { LpIcon } from '@lemon-peel/components/icon';
import { CircleClose, Hide as IconHide, View as IconView } from '@element-plus/icons-vue';
import { NOOP, ValidateComponentsMap, debugWarn, isKorean, isObject } from '@lemon-peel/utils';
import { useAttrs, useCursor, useDisabled, useFormItem, useFormItemInputId, useNamespace, useSize } from '@lemon-peel/hooks';
import { UPDATE_MODEL_EVENT } from '@lemon-peel/constants';

import { calcTextareaHeight } from './utils';
import { inputEmits, inputProps } from './input';

import type { StyleValue } from 'vue';

type TargetElement = HTMLInputElement | HTMLTextAreaElement;

defineOptions({
  name: 'LpInput',
  inheritAttrs: false,
});
const props = defineProps(inputProps);
const emit = defineEmits(inputEmits);

const rawAttributes = useRawAttributes();
const slots = useSlots();

const containerAttributes = computed(() => {
  const comboBoxAttributes: Record<string, unknown> = {};
  if (props.containerRole === 'combobox') {
    comboBoxAttributes['aria-haspopup'] = rawAttributes['aria-haspopup'];
    comboBoxAttributes['aria-owns'] = rawAttributes['aria-owns'];
    comboBoxAttributes['aria-expanded'] = rawAttributes['aria-expanded'];
  }
  return comboBoxAttributes;
});

const attributes = useAttrs({
  excludeKeys: computed<string[]>(() => {
    return Object.keys(containerAttributes.value);
  }),
});
const { form, formItem } = useFormItem();
const { inputId } = useFormItemInputId(props, {
  formItemContext: formItem,
});
const inputSize = useSize();
const inputDisabled = useDisabled();
const nsInput = useNamespace('input');
const nsTextarea = useNamespace('textarea');

const input = shallowRef<HTMLInputElement>();
const textarea = shallowRef<HTMLTextAreaElement>();

const focused = ref(false);
const hovering = ref(false);
const isComposing = ref(false);
const passwordVisible = ref(false);
const countStyle = ref<StyleValue>();
const textareaCalcStyle = shallowRef(props.inputStyle);

const _ref = computed(() => input.value || textarea.value);

const needStatusIcon = computed(() => form?.statusIcon ?? false);
const validateState = computed(() => formItem?.validateState || '');
const validateIcon = computed(
  () => validateState.value && ValidateComponentsMap[validateState.value],
);
const passwordIcon = computed(() =>
  passwordVisible.value ? IconView : IconHide,
);
const containerStyle = computed<StyleValue>(() => [
  rawAttributes.style as StyleValue,
  props.inputStyle,
]);
const textareaStyle = computed<StyleValue>(() => [
  props.inputStyle,
  textareaCalcStyle.value,
  { resize: props.resize },
]);
const nativeInputValue = computed(() =>
  isNil(props.modelValue) ? '' : String(props.modelValue),
);
const showClear = computed(
  () =>
    props.clearable &&
    !inputDisabled.value &&
    !props.readonly &&
    !!nativeInputValue.value &&
    (focused.value || hovering.value),
);
const showPwdVisible = computed(
  () =>
    props.showPassword &&
    !inputDisabled.value &&
    !props.readonly &&
    !!nativeInputValue.value &&
    (!!nativeInputValue.value || focused.value),
);
const isWordLimitVisible = computed(
  () =>
    props.showWordLimit &&
    !!attributes.value.maxlength &&
    (props.type === 'text' || props.type === 'textarea') &&
    !inputDisabled.value &&
    !props.readonly &&
    !props.showPassword,
);
const textLength = computed(() => [...nativeInputValue.value].length);
const inputExceed = computed(
  () =>
    // show exceed style if length of initial value greater then maxlength
    !!isWordLimitVisible.value &&
    textLength.value > Number(attributes.value.maxlength),
);
const suffixVisible = computed(
  () =>
    !!slots.suffix ||
    !!props.suffixIcon ||
    showClear.value ||
    props.showPassword ||
    isWordLimitVisible.value ||
    (!!validateState.value && needStatusIcon.value),
);

const [recordCursor, setCursor] = useCursor(input);

useResizeObserver(textarea, entries => {
  if (!isWordLimitVisible.value || props.resize !== 'both') return;
  const entry = entries[0];
  const { width } = entry.contentRect;
  countStyle.value = {
    /** right: 100% - width + padding(15) + right(6) */
    right: `calc(100% - ${width + 15 + 6}px)`,
  };
});

const resizeTextarea = () => {
  const { type, autosize } = props;

  if (!isClient || type !== 'textarea') return;

  if (autosize) {
    const minRows = isObject(autosize) ? autosize.minRows : undefined;
    const maxRows = isObject(autosize) ? autosize.maxRows : undefined;
    textareaCalcStyle.value = {
      ...calcTextareaHeight(textarea.value!, minRows, maxRows),
    };
  } else {
    textareaCalcStyle.value = {
      minHeight: calcTextareaHeight(textarea.value!).minHeight,
    };
  }
};

const setNativeInputValue = () => {
  const input = _ref.value;
  if (!input || input.value === nativeInputValue.value) return;
  input.value = nativeInputValue.value;
};

const handleInput = async (event: Event) => {
  recordCursor();

  let { value } = event.target as TargetElement;

  if (props.formatter) {
    value = props.parser ? props.parser(value) : value;
    value = props.formatter(value);
  }

  // should not emit input during composition
  // see: https://github.com/ElemeFE/element/issues/10516
  if (isComposing.value) return;

  // hack for https://github.com/ElemeFE/element/issues/8548
  // should remove the following line when we don't support IE
  if (value === nativeInputValue.value) {
    setNativeInputValue();
    return;
  }

  emit(UPDATE_MODEL_EVENT, value);
  emit('input', value);

  // ensure native input value is controlled
  // see: https://github.com/ElemeFE/element/issues/12850
  await nextTick();
  setNativeInputValue();
  setCursor();
};

const handleChange = (event: Event) => {
  emit('change', (event.target as TargetElement).value);
};

const handleCompositionStart = (event: CompositionEvent) => {
  emit('compositionstart', event);
  isComposing.value = true;
};

const handleCompositionUpdate = (event: CompositionEvent) => {
  emit('compositionupdate', event);
  const text = (event.target as HTMLInputElement)?.value;
  const lastCharacter = text[text.length - 1] || '';
  isComposing.value = !isKorean(lastCharacter);
};

const handleCompositionEnd = (event: CompositionEvent) => {
  emit('compositionend', event);
  if (isComposing.value) {
    isComposing.value = false;
    handleInput(event);
  }
};

const handlePasswordVisible = () => {
  passwordVisible.value = !passwordVisible.value;
  focus();
};

const focus = async () => {
  // see: https://github.com/ElemeFE/element/issues/18573
  await nextTick();
  _ref.value?.focus();
};

const blur = () => _ref.value?.blur();

const handleFocus = (event: FocusEvent) => {
  focused.value = true;
  emit('focus', event);
};

const handleBlur = (event: FocusEvent) => {
  focused.value = false;
  emit('blur', event);
  if (props.validateEvent) {
    formItem?.validate?.('blur').catch(error => debugWarn(error));
  }
};

const handleMouseLeave = (event_: MouseEvent) => {
  hovering.value = false;
  emit('mouseleave', event_);
};

const handleMouseEnter = (event_: MouseEvent) => {
  hovering.value = true;
  emit('mouseenter', event_);
};

const handleKeydown = (event_: KeyboardEvent) => {
  emit('keydown', event_);
};

const select = () => {
  _ref.value?.select();
};

const clear = () => {
  emit(UPDATE_MODEL_EVENT, '');
  emit('change', '');
  emit('clear');
  emit('input', '');
};

watch(
  () => props.modelValue,
  () => {
    nextTick(() => resizeTextarea());
    if (props.validateEvent) {
      formItem?.validate?.('change').catch(error => debugWarn(error));
    }
  },
);

// native input value is set explicitly
// do not use v-model / :value in template
// see: https://github.com/ElemeFE/element/issues/14521
watch(nativeInputValue, () => setNativeInputValue());

// when change between <input> and <textarea>,
// update DOM dependent value and styles
// https://github.com/ElemeFE/element/issues/14857
watch(
  () => props.type,
  async () => {
    await nextTick();
    setNativeInputValue();
    resizeTextarea();
  },
);

onMounted(() => {
  if (!props.formatter && props.parser) {
    debugWarn(
      'LpInput',
      'If you set the parser, you also need to set the formatter.',
    );
  }
  setNativeInputValue();
  nextTick(resizeTextarea);
});

defineExpose({
  /** @description HTML input element */
  input,
  /** @description HTML textarea element */
  textarea,
  /** @description HTML element, input or textarea */
  ref: _ref,
  /** @description style of textarea. */
  textareaStyle,

  /** @description from props (used on unit test) */
  autosize: toRef(props, 'autosize'),

  /** @description HTML input element native method */
  focus,
  /** @description HTML input element native method */
  blur,
  /** @description HTML input element native method */
  select,
  /** @description clear input value */
  clear,
  /** @description resize textarea. */
  resizeTextarea,
});
</script>