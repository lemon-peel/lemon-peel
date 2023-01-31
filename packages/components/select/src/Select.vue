<template>
  <div
    ref="selectWrapper"
    v-click-outside:[popperPaneRef]="handleClose"
    :class="wrapperKls"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @click.stop="toggleMenu"
  >
    <lp-tooltip
      ref="tooltipRef"
      :visible="dropMenuVisible"
      :placement="placement"
      :teleported="teleported"
      :popper-class="[nsSelect.e('popper'), popperClass]"
      :fallback-placements="['bottom-start', 'top-start', 'right', 'left']"
      :effect="effect"
      pure
      trigger="click"
      :transition="`${nsSelect.namespace.value}-zoom-in-top`"
      :stop-popper-mouse-event="false"
      :gpu-acceleration="false"
      :persistent="persistent"
      @show="handleMenuEnter"
    >
      <template #default>
        <div
          class="select-trigger"
          @mouseenter="inputHovering = true"
          @mouseleave="inputHovering = false"
        >
          <div
            v-if="multiple"
            ref="tags"
            :class="nsSelect.e('tags')"
            :style="selectTagsStyle"
          >
            <span
              v-if="collapseTags && selected.length > 0"
              :class="[
                nsSelect.b('tags-wrapper'),
                { 'has-prefix': prefixWidth && selected.length },
              ]"
            >
              <lp-tag
                :closable="!selectDisabled && !selected[0].isDisabled"
                :size="collapseTagSize"
                :hit="selected[0].hitState"
                :type="tagType"
                disable-transitions
                @close="deleteTag($event, selected[0])"
              >
                <span :class="nsSelect.e('tags-text')" :style="tagTextStyle">
                  {{ selected[0].currentLabel }}
                </span>
              </lp-tag>
              <lp-tag
                v-if="selected.length > 1"
                :closable="false"
                :size="collapseTagSize"
                :type="tagType"
                disable-transitions
              >
                <lp-tooltip
                  v-if="collapseTagsTooltip"
                  :disabled="dropMenuVisible"
                  :fallback-placements="['bottom', 'top', 'right', 'left']"
                  :effect="effect"
                  placement="bottom"
                  :teleported="teleported"
                >
                  <template #default>
                    <span :class="nsSelect.e('tags-text')">+ {{ selected.length - 1 }}</span>
                  </template>
                  <template #content>
                    <div :class="nsSelect.e('collapse-tags')">
                      <div
                        v-for="(item, idx) in selected.slice(1)"
                        :key="idx"
                        :class="nsSelect.e('collapse-tag')"
                      >
                        <lp-tag
                          :key="getValueKey(item)"
                          class="in-tooltip"
                          :closable="!selectDisabled && !item.isDisabled"
                          :size="collapseTagSize"
                          :hit="item.hitState"
                          :type="tagType"
                          disable-transitions
                          :style="{ margin: '2px' }"
                          @close="deleteTag($event, item)"
                        >
                          <span
                            :class="nsSelect.e('tags-text')"
                            :style="{
                              maxWidth: inputWidth - 75 + 'px',
                            }"
                          >{{ item.currentLabel }}</span>
                        </lp-tag>
                      </div>
                    </div>
                  </template>
                </lp-tooltip>
                <span v-else :class="nsSelect.e('tags-text')">+ {{ selected.length - 1 }}</span>
              </lp-tag>
            </span>
            <!-- <div> -->
            <transition v-if="!collapseTags" @after-leave="resetInputHeight">
              <span
                :class="[
                  nsSelect.b('tags-wrapper'),
                  { 'has-prefix': prefixWidth && selected.length },
                ]"
              >
                <lp-tag
                  v-for="item in selected"
                  :key="getValueKey(item)"
                  :closable="!selectDisabled && !item.isDisabled"
                  :size="collapseTagSize"
                  :hit="item.hitState"
                  :type="tagType"
                  disable-transitions
                  @close="deleteTag($event, item)"
                >
                  <span
                    :class="nsSelect.e('tags-text')"
                    :style="{ maxWidth: inputWidth - 75 + 'px' }"
                  >{{ item.currentLabel }}</span>
                </lp-tag>
              </span>
            </transition>
            <!-- </div> -->
            <input
              v-if="filterable"
              ref="input"
              v-model="query"
              type="text"
              :class="[nsSelect.e('input'), nsSelect.is(selectSize)]"
              :disabled="selectDisabled"
              :autocomplete="autocomplete"
              :style="{
                marginLeft:
                  (prefixWidth && selected.length === 0) || tagInMultiLine
                    ? `${prefixWidth}px`
                    : '',
                flexGrow: 1,
                width: `${inputLength / (inputWidth - 32)}%`,
                maxWidth: `${inputWidth - 42}px`,
              }"
              @focus="handleFocus"
              @blur="handleBlur"
              @keyup="managePlaceholder"
              @keydown="resetInputState"
              @keydown.down.prevent="navigateOptions('next')"
              @keydown.up.prevent="navigateOptions('prev')"
              @keydown.esc="handleKeydownEscape"
              @keydown.enter.stop.prevent="selectOption"
              @keydown.delete="deletePrevTag"
              @keydown.tab="visible = false"
              @compositionstart="handleComposition"
              @compositionupdate="handleComposition"
              @compositionend="handleComposition"
              @input="debouncedQueryChange"
            >
          </div>
          <lp-input
            :id="id"
            ref="reference"
            v-model="selectedLabel"
            type="text"
            :placeholder="currentPlaceholder"
            :name="name"
            :autocomplete="autocomplete"
            :size="selectSize"
            :disabled="selectDisabled"
            :readonly="readonly"
            :validate-event="false"
            :class="[nsSelect.is('focus', visible)]"
            :tabindex="multiple && filterable ? -1 : undefined"
            @focus="handleFocus"
            @blur="handleBlur"
            @input="debouncedOnInputChange"
            @paste="debouncedOnInputChange"
            @compositionstart="handleComposition"
            @compositionupdate="handleComposition"
            @compositionend="handleComposition"
            @keydown.down.stop.prevent="navigateOptions('next')"
            @keydown.up.stop.prevent="navigateOptions('prev')"
            @keydown.enter.stop.prevent="selectOption"
            @keydown.esc="handleKeydownEscape"
            @keydown.tab="visible = false"
          >
            <template v-if="$slots.prefix" #prefix>
              <div
                style="
                  height: 100%;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                "
              >
                <slot name="prefix" />
              </div>
            </template>
            <template #suffix>
              <lp-icon
                v-if="iconComponent && !showClose"
                :class="[nsSelect.e('caret'), nsSelect.e('icon'), iconReverse]"
              >
                <component :is="iconComponent" />
              </lp-icon>
              <lp-icon
                v-if="showClose && clearIcon"
                :class="[nsSelect.e('caret'), nsSelect.e('icon')]"
                @click="handleClearClick"
              >
                <component :is="clearIcon" />
              </lp-icon>
            </template>
          </lp-input>
        </div>
      </template>
      <template #content>
        <lp-select-menu>
          <lp-scrollbar
            v-show="options.size > 0 && !loading"
            ref="scrollbar"
            tag="ul"
            :wrap-class="nsSelect.be('dropdown', 'wrap')"
            :view-class="nsSelect.be('dropdown', 'list')"
            :class="[
              nsSelect.is(
                'empty',
                !allowCreate && Boolean(query) && filteredOptionsCount === 0
              ),
            ]"
          >
            <lp-option v-if="showNewOption" :value="query" :created="true" />
            <slot />
          </lp-scrollbar>
          <template
            v-if="
              emptyText &&
                (!allowCreate || loading || (allowCreate && options.size === 0))
            "
          >
            <slot v-if="$slots.empty" name="empty" />
            <p v-else :class="nsSelect.be('dropdown', 'empty')">
              {{ emptyText }}
            </p>
          </template>
        </lp-select-menu>
      </template>
    </lp-tooltip>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineExpose, nextTick, onMounted, provide, reactive, toRefs, unref } from 'vue';
import { useResizeObserver } from '@vueuse/core';
import { ClickOutside } from '@lemon-peel/directives';
import { useFocus, useLocale, useNamespace } from '@lemon-peel/hooks';
import LpInput from '@lemon-peel/components/input';
import LpTooltip from '@lemon-peel/components/tooltip';
import LpScrollbar from '@lemon-peel/components/scrollbar';
import LpTag, { tagProps } from '@lemon-peel/components/tag';
import LpIcon from '@lemon-peel/components/icon';
import { CHANGE_EVENT, UPDATE_MODEL_EVENT } from '@lemon-peel/constants';

import LpOption from './Option.vue';
import LpSelectMenu from './SelectDropdown.vue';
import { useSelect, useSelectStates } from './useSelect';
import { selectKey } from './token';
import { selectEmits, selectProps } from './select';

import type { SelectContext } from './token';

const COMPONENT_NAME = 'LpSelect';

defineOptions({
  name: COMPONENT_NAME,
  directives: { ClickOutside },
});

const props = defineProps(selectProps);
const emit = defineEmits(selectEmits);

const nsSelect = useNamespace('select');
const nsInput = useNamespace('input');
const { t } = useLocale();
const states = useSelectStates(props);
const {
  optionsArray,
  selectSize,
  readonly,
  handleResize,
  collapseTagSize,
  debouncedOnInputChange,
  debouncedQueryChange,
  deletePrevTag,
  deleteTag,
  deleteSelected,
  handleOptionSelect,
  scrollToOption,
  setSelected,
  resetInputHeight,
  managePlaceholder,
  showClose,
  selectDisabled,
  iconComponent,
  iconReverse,
  showNewOption,
  emptyText,
  toggleLastOptionHitState,
  resetInputState,
  handleComposition,
  onOptionCreate,
  onOptionDestroy,
  handleMenuEnter,
  handleFocus,
  blur,
  handleBlur,
  handleClearClick,
  handleClose,
  handleKeydownEscape,
  toggleMenu,
  selectOption,
  getValueKey,
  navigateOptions,
  dropMenuVisible,

  reference,
  input,
  tooltipRef,
  tags,
  selectWrapper,
  scrollbar,
  queryChange,
  groupQueryChange,
  handleMouseEnter,
  handleMouseLeave,
} = useSelect(props, states, emit);

const { focus } = useFocus(reference);

const {
  inputWidth,
  selected,
  inputLength,
  filteredOptionsCount,
  visible,
  softFocus,
  selectedLabel,
  hoverIndex,
  query,
  inputHovering,
  currentPlaceholder,
  menuVisibleOnFocus,
  isOnComposition,
  isSilentBlur,
  options,
  cachedOptions,
  optionsCount,
  prefixWidth,
  tagInMultiLine,
} = toRefs(states);

const wrapperKls = computed(() => {
  const classList = [nsSelect.b()];
  const size = unref(selectSize);
  if (size) {
    classList.push(nsSelect.m(size));
  }
  if (props.disabled) {
    classList.push(nsSelect.m('disabled'));
  }
  return classList;
});

const selectTagsStyle = computed(() => ({
  maxWidth: `${unref(inputWidth) - 32}px`,
  width: '100%',
}));

const tagTextStyle = computed(() => {
  const maxWidth =
        unref(inputWidth) > 123
          ? unref(inputWidth) - 123
          : unref(inputWidth) - 75;
  return { maxWidth: `${maxWidth}px` };
});

provide(
  selectKey,
  reactive({
    props,
    options,
    optionsArray,
    cachedOptions,
    optionsCount,
    filteredOptionsCount,
    hoverIndex,
    handleOptionSelect,
    onOptionCreate,
    onOptionDestroy,
    selectWrapper,
    selected,
    setSelected,
    queryChange,
    groupQueryChange,
  }) as unknown as SelectContext,
);

const slots = useSlots();

onMounted(() => {
  states.cachedPlaceHolder = currentPlaceholder.value =
        props.placeholder || t('el.select.placeholder');
  if (
    props.multiple &&
        Array.isArray(props.modelValue) &&
        props.modelValue.length > 0
  ) {
    currentPlaceholder.value = '';
  }

  useResizeObserver(selectWrapper as any, handleResize);

  if (props.remote && props.multiple) {
    resetInputHeight();
  }

  nextTick(() => {
    const referenceElement = reference.value && reference.value.$el;
    if (!referenceElement) return;
    inputWidth.value = referenceElement.getBoundingClientRect().width;

    if (slots.prefix) {
      const prefix = referenceElement.querySelector(`.${nsInput.e('prefix')}`);
      prefixWidth.value = Math.max(
        prefix.getBoundingClientRect().width + 5,
        30,
      );
    }
  });
  setSelected();
});

if (props.multiple && !Array.isArray(props.modelValue)) {
  emit(UPDATE_MODEL_EVENT, []);
}

if (!props.multiple && Array.isArray(props.modelValue)) {
  emit(UPDATE_MODEL_EVENT, '');
}

const popperPaneReference = computed(() => {
  return tooltipRef.value?.popperRef?.contentRef;
});

defineExpose({
  focus,
  blur,
});
</script>
