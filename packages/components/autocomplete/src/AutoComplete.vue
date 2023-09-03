<template>
  <lp-tooltip
    ref="popperRef"
    :visible="suggestionVisible"
    :placement="placement"
    :fallback-placements="['bottom-start', 'top-start']"
    :popper-class="[ns.e('popper'), popperClass]"
    :teleported="teleported"
    :gpu-acceleration="false"
    pure
    manual-mode
    effect="light"
    trigger="click"
    :transition="`${ns.namespace.value}-zoom-in-top`"
    persistent
    @before-show="onSuggestionShow"
    @show="onShow"
    @hide="onHide"
  >
    <div
      ref="listboxRef"
      :class="[ns.b(), $attrs.class]"
      :style="styles"
      role="combobox"
      aria-haspopup="listbox"
      :aria-expanded="suggestionVisible"
      :aria-owns="listboxId"
    >
      <lp-input
        ref="inputRef"
        v-bind="$attrs"
        :value="value"
        @input="handleInput"
        @change="handleChange"
        @focus="handleFocus"
        @blur="handleBlur"
        @clear="handleClear"
        @keydown.up.prevent="highlight(highlightedIndex - 1)"
        @keydown.down.prevent="highlight(highlightedIndex + 1)"
        @keydown.enter="handleKeyEnter"
        @keydown.tab="close"
        @keydown.esc="handleKeyEscape"
        @mousedown="handleMouseDown"
      >
        <template v-if="$slots.prepend" #prepend>
          <slot name="prepend" />
        </template>
        <template v-if="$slots.append" #append>
          <slot name="append" />
        </template>
        <template v-if="$slots.prefix" #prefix>
          <slot name="prefix" />
        </template>
        <template v-if="$slots.suffix" #suffix>
          <slot name="suffix" />
        </template>
      </lp-input>
    </div>
    <template #content>
      <div
        ref="regionRef"
        :class="[ns.b('suggestion'), ns.is('loading', suggestionLoading)]"
        :style="{
          [fitInputWidth ? 'width' : 'minWidth']: dropdownWidth,
          outline: 'none',
        }"
        role="region"
      >
        <lp-scrollbar
          :id="listboxId"
          tag="ul"
          :wrap-class="ns.be('suggestion', 'wrap')"
          :view-class="ns.be('suggestion', 'list')"
          role="listbox"
        >
          <li v-if="suggestionLoading">
            <lp-icon :class="ns.is('loading')"><Loading /></lp-icon>
          </li>
          <template v-else>
            <li
              v-for="(item, index) in suggestions"
              :id="`${listboxId}-item-${index}`"
              :key="index"
              :class="{ highlighted: highlightedIndex === index }"
              role="option"
              :aria-selected="highlightedIndex === index"
              @click="handleSelect(item)"
            >
              <slot :item="item">{{ item[valueKey] }}</slot>
            </li>
          </template>
        </lp-scrollbar>
      </div>
    </template>
  </lp-tooltip>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, useAttrs as useRawAttrs } from 'vue';
import { debounce } from 'lodash';
import { onClickOutside } from '@vueuse/core';
import { useAttrs, useDisabled, useNamespace } from '@lemon-peel/hooks';
import { generateId, isArray, throwError } from '@lemon-peel/utils';
import { CHANGE_EVENT, INPUT_EVENT, UPDATE_MODEL_EVENT } from '@lemon-peel/constants';
import { autocompleteEmits, autocompleteProps } from './autoComplete';
import { Loading } from '@element-plus/icons-vue';
import LpIcon from '@lemon-peel/components/icon';
import LpInput from '@lemon-peel/components/input';
import LpScrollbar from '@lemon-peel/components/scrollbar';
import LpTooltip from '@lemon-peel/components/tooltip';

import type { StyleValue } from 'vue';
import type { TooltipInstance } from '@lemon-peel/components/tooltip';
import type { InputInstance } from '@lemon-peel/components/input';
import type { AutocompleteData } from './autoComplete';

const COMPONENT_NAME = 'LpAutocomplete';
defineOptions({
  name: COMPONENT_NAME,
  inheritAttrs: false,
});

const props = defineProps(autocompleteProps);
const emit = defineEmits(autocompleteEmits);

const rawAttrs = useRawAttrs();
const disabled = useDisabled();
const ns = useNamespace('autocomplete');

const inputRef = ref<InputInstance>();
const regionRef = ref<HTMLElement>();
const popperRef = ref<TooltipInstance>();
const listboxRef = ref<HTMLElement>();

let readonly = false;
let ignoreFocusEvent = false;
const suggestions = ref<AutocompleteData>([]);
const highlightedIndex = ref(-1);
const dropdownWidth = ref('');
const activated = ref(false);
const suggestionDisabled = ref(false);
const loading = ref(false);

const listboxId = computed(() => ns.b(String(generateId())));
const styles = computed(() => rawAttrs.style as StyleValue);

const suggestionVisible = computed(() => {
  const isValidData = suggestions.value.length > 0;
  return (isValidData || loading.value) && activated.value;
});

const suggestionLoading = computed(() => !props.hideLoading && loading.value);

const refInput = computed<HTMLInputElement[]>(() => {
  if (inputRef.value) {
    return [...inputRef.value.$el.querySelectorAll('input')];
  }
  return [];
});

const onSuggestionShow = async () => {
  await nextTick();
  if (suggestionVisible.value) {
    dropdownWidth.value = `${inputRef.value!.$el.offsetWidth}px`;
  }
};

const onShow = () => {
  ignoreFocusEvent = true;
};

const onHide = () => {
  ignoreFocusEvent = false;
  highlightedIndex.value = -1;
};

const getData = async (queryString: string) => {
  if (suggestionDisabled.value) return;

  const callback = (suggestionList: AutocompleteData) => {
    loading.value = false;
    if (suggestionDisabled.value) return;

    if (isArray(suggestionList)) {
      suggestions.value = suggestionList;
      highlightedIndex.value = props.highlightFirstItem ? 0 : -1;
    } else {
      throwError(COMPONENT_NAME, 'autocomplete suggestions must be an array');
    }
  };

  loading.value = true;
  if (isArray(props.fetchSuggestions)) {
    callback(props.fetchSuggestions);
  } else {
    const result = await props.fetchSuggestions(queryString, callback);
    if (isArray(result)) callback(result);
  }
};
const debouncedGetData = debounce(getData, props.debounce);

const handleInput = (value: string) => {
  const valuePresented = !!value;

  emit(INPUT_EVENT, value);
  emit(UPDATE_MODEL_EVENT, value);

  suggestionDisabled.value = false;
  activated.value ||= valuePresented;

  if (!props.triggerOnFocus && !value) {
    suggestionDisabled.value = true;
    suggestions.value = [];
    return;
  }

  debouncedGetData(value);
};

const handleMouseDown = (event: MouseEvent) => {
  if (disabled.value) return;
  if (
    (event.target as HTMLElement)?.tagName !== 'INPUT' ||
    refInput.value.includes(document.activeElement as HTMLInputElement)
  ) {
    activated.value = true;
  }
};

const handleChange = (value: string) => {
  emit(CHANGE_EVENT, value);
};

const handleFocus = (event_: FocusEvent) => {
  if (ignoreFocusEvent) return;

  activated.value = true;
  emit('focus', event_);
  // fix https://github.com/element-plus/element-plus/issues/8278
  if (props.triggerOnFocus && !readonly) {
    debouncedGetData(String(props.value));
  }
};

const handleBlur = (event_: FocusEvent) => {
  if (ignoreFocusEvent) return;
  emit('blur', event_);
};

const handleClear = () => {
  activated.value = false;
  emit(UPDATE_MODEL_EVENT, '');
  emit('clear');
};

const handleSelect = async (item: any) => {
  emit(INPUT_EVENT, item[props.valueKey]);
  emit(UPDATE_MODEL_EVENT, item[props.valueKey]);
  emit('select', item);
  suggestions.value = [];
  highlightedIndex.value = -1;
};

const handleKeyEnter = async () => {
  if (
    suggestionVisible.value &&
    highlightedIndex.value >= 0 &&
    highlightedIndex.value < suggestions.value.length
  ) {
    handleSelect(suggestions.value[highlightedIndex.value]);
  } else if (props.selectWhenUnmatched) {
    emit('select', { value: props.value });
    suggestions.value = [];
    highlightedIndex.value = -1;
  }
};

const close = () => {
  activated.value = false;
};

const handleKeyEscape = (event_: Event) => {
  if (suggestionVisible.value) {
    event_.preventDefault();
    event_.stopPropagation();
    close();
  }
};

const focus = () => {
  inputRef.value?.focus();
};

const blur = () => {
  inputRef.value?.blur();
};

const highlight = (index: number) => {
  if (!suggestionVisible.value || loading.value) return;

  if (index < 0) {
    highlightedIndex.value = -1;
    return;
  }

  if (index >= suggestions.value.length) {
    index = suggestions.value.length - 1;
  }
  const suggestion = regionRef.value!.querySelector(
    `.${ns.be('suggestion', 'wrap')}`,
  )!;
  const suggestionList = suggestion.querySelectorAll<HTMLElement>(
    `.${ns.be('suggestion', 'list')} li`,
  )!;
  const highlightItem = suggestionList[index];
  const scrollTop = suggestion.scrollTop;
  const { offsetTop, scrollHeight } = highlightItem;

  if (offsetTop + scrollHeight > scrollTop + suggestion.clientHeight) {
    suggestion.scrollTop += scrollHeight;
  }
  if (offsetTop < scrollTop) {
    suggestion.scrollTop -= scrollHeight;
  }
  highlightedIndex.value = index
  // TODO: use Volar generate dts to fix it.
  ;(inputRef.value as any).ref!.setAttribute(
    'aria-activedescendant',
    `${listboxId.value}-item-${highlightedIndex.value}`,
  );
};

onClickOutside(listboxRef, () => {
  suggestionVisible.value && close();
});

onMounted(() => {
  // TODO: use Volar generate dts to fix it.
  (inputRef.value as any).ref!.setAttribute('role', 'textbox')
  ;(inputRef.value as any).ref!.setAttribute('aria-autocomplete', 'list')
  ;(inputRef.value as any).ref!.setAttribute('aria-controls', 'id')
  ;(inputRef.value as any).ref!.setAttribute(
    'aria-activedescendant',
    `${listboxId.value}-item-${highlightedIndex.value}`,
  );
  // get readonly attr
  readonly = (inputRef.value as any).ref!.hasAttribute('readonly');
});

defineExpose({
  /** @description the index of the currently highlighted item */
  highlightedIndex,
  /** @description autocomplete whether activated */
  activated,
  /** @description remote search loading status */
  loading,
  /** @description lp-input component instance */
  inputRef,
  /** @description lp-tooltip component instance */
  popperRef,
  /** @description fetch suggestions result */
  suggestions,
  /** @description triggers when a suggestion is clicked */
  handleSelect,
  /** @description handle keyboard enter event */
  handleKeyEnter,
  /** @description focus the input element */
  focus,
  /** @description blur the input element */
  blur,
  /** @description close suggestion */
  close,
  /** @description highlight an item in a suggestion */
  highlight,
});
</script>
