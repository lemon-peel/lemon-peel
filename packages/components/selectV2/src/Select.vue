<template>
  <div
    ref="selectRef"
    v-click-outside:[popperRef]="handleClickOutside"
    :class="[nsSelectV2.b(), nsSelectV2.m(selectSize)]"
    @click.stop="toggleMenu"
    @mouseenter="states.comboBoxHovering = true"
    @mouseleave="states.comboBoxHovering = false"
  >
    <lp-tooltip
      ref="popper"
      :visible="dropdownMenuVisible"
      :teleported="teleported"
      :popper-class="[nsSelectV2.e('popper'), popperClass]"
      :gpu-acceleration="false"
      :stop-popper-mouse-event="false"
      :popper-options="popperOptions"
      :fallback-placements="['bottom-start', 'top-start', 'right', 'left']"
      :effect="effect"
      :placement="placement"
      pure
      :transition="`${nsSelectV2.namespace.value}-zoom-in-top`"
      trigger="click"
      :persistent="persistent"
      @before-show="handleMenuEnter"
      @hide="states.inputValue = states.displayInputValue"
    >
      <template #default>
        <div
          ref="selectionRef"
          :class="[
            nsSelectV2.e('wrapper'),
            nsSelectV2.is('focused', states.isComposing || expanded),
            nsSelectV2.is('hovering', states.comboBoxHovering),
            nsSelectV2.is('filterable', filterable),
            nsSelectV2.is('disabled', selectDisabled),
          ]"
        >
          <div v-if="$slots.prefix">
            <slot name="prefix" />
          </div>
          <div v-if="multiple" :class="nsSelectV2.e('selection')">
            <template v-if="collapseTags && value.length > 0">
              <div :class="nsSelectV2.e('selected-item')">
                <lp-tag
                  :closable="
                    !selectDisabled && !states.cachedOptions[0]?.disable
                  "
                  :size="collapseTagSize"
                  type="info"
                  disable-transitions
                  @close="deleteTag($event, states.cachedOptions[0])"
                >
                  <span
                    :class="nsSelectV2.e('tags-text')"
                    :style="{
                      maxWidth: `${tagMaxWidth}px`,
                    }"
                  >{{ states.cachedOptions[0]?.label }}</span>
                </lp-tag>
                <lp-tag
                  v-if="value.length > 1"
                  :closable="false"
                  :size="collapseTagSize"
                  type="info"
                  disable-transitions
                >
                  <lp-tooltip
                    v-if="collapseTagsTooltip"
                    :disabled="dropdownMenuVisible"
                    :fallback-placements="['bottom', 'top', 'right', 'left']"
                    :effect="effect"
                    placement="bottom"
                    :teleported="false"
                  >
                    <template #default>
                      <span
                        :class="nsSelectV2.e('tags-text')"
                        :style="{
                          maxWidth: `${tagMaxWidth}px`,
                        }"
                      >+ {{ value.length - 1 }}</span>
                    </template>
                    <template #content>
                      <div :class="nsSelectV2.e('selection')">
                        <div
                          v-for="(selected, idx) in states.cachedOptions.slice(
                            1
                          )"
                          :key="idx"
                          :class="nsSelectV2.e('selected-item')"
                        >
                          <lp-tag
                            :key="getValueKey(selected)"
                            :closable="!selectDisabled && !selected.disabled"
                            :size="collapseTagSize"
                            class="in-tooltip"
                            type="info"
                            disable-transitions
                            @close="deleteTag($event, selected)"
                          >
                            <span
                              :class="nsSelectV2.e('tags-text')"
                              :style="{
                                maxWidth: `${tagMaxWidth}px`,
                              }"
                            >{{ getLabel(selected) }}</span>
                          </lp-tag>
                        </div>
                      </div>
                    </template>
                  </lp-tooltip>
                  <span
                    v-else
                    :class="nsSelectV2.e('tags-text')"
                    :style="{
                      maxWidth: `${tagMaxWidth}px`,
                    }"
                  >+ {{ value.length - 1 }}</span>
                </lp-tag>
              </div>
            </template>

            <template v-else>
              <div
                v-for="(selected, idx) in states.cachedOptions"
                :key="idx"
                :class="nsSelectV2.e('selected-item')"
              >
                <lp-tag
                  :key="getValueKey(selected)"
                  :closable="!selectDisabled && !selected.disabled"
                  :size="collapseTagSize"
                  type="info"
                  disable-transitions
                  @close="deleteTag($event, selected)"
                >
                  <span
                    :class="nsSelectV2.e('tags-text')"
                    :style="{
                      maxWidth: `${tagMaxWidth}px`,
                    }"
                  >{{ getLabel(selected) }}</span>
                </lp-tag>
              </div>
            </template>
            <div
              :class="[
                nsSelectV2.e('selected-item'),
                nsSelectV2.e('input-wrapper'),
              ]"
              :style="inputWrapperStyle"
            >
              <input
                :id="id"
                ref="inputRef"
                v-model-text="states.displayInputValue"
                :autocomplete="autocomplete"
                aria-autocomplete="list"
                aria-haspopup="listbox"
                autocapitalize="off"
                :aria-expanded="expanded"
                :aria-labelledby="label"
                :class="[
                  nsSelectV2.is(selectSize),
                  nsSelectV2.e('combobox-input'),
                ]"
                :disabled="disabled"
                role="combobox"
                :readonly="!filterable"
                spellcheck="false"
                type="text"
                :name="name"
                :unselectable="expanded ? 'on' : undefined"
                @update:value="onUpdateInputValue"
                @focus="handleFocus"
                @blur="handleBlur"
                @input="(onInput as any)"
                @compositionstart="handleCompositionStart"
                @compositionupdate="handleCompositionUpdate"
                @compositionend="handleCompositionEnd"
                @keydown.up.stop.prevent="onKeyboardNavigate('backward')"
                @keydown.down.stop.prevent="onKeyboardNavigate('forward')"
                @keydown.enter.stop.prevent="onKeyboardSelect"
                @keydown.esc.stop.prevent="handleEsc"
                @keydown.delete.stop="handleDel"
              >
              <span
                v-if="filterable"
                ref="calculatorRef"
                aria-hidden="true"
                :class="nsSelectV2.e('input-calculator')"
                v-text="states.displayInputValue"
              />
            </div>
          </div>
          <template v-else>
            <div
              :class="[
                nsSelectV2.e('selected-item'),
                nsSelectV2.e('input-wrapper'),
              ]"
            >
              <input
                :id="id"
                ref="inputRef"
                v-model-text="states.displayInputValue"
                aria-autocomplete="list"
                aria-haspopup="listbox"
                :aria-labelledby="label"
                :aria-expanded="expanded"
                autocapitalize="off"
                :autocomplete="autocomplete"
                :class="nsSelectV2.e('combobox-input')"
                :disabled="disabled"
                :name="name"
                role="combobox"
                :readonly="!filterable"
                spellcheck="false"
                type="text"
                :unselectable="expanded ? 'on' : undefined"
                @compositionstart="handleCompositionStart"
                @compositionupdate="handleCompositionUpdate"
                @compositionend="handleCompositionEnd"
                @focus="handleFocus"
                @blur="handleBlur"
                @input="(onInput as any)"
                @keydown.up.stop.prevent="onKeyboardNavigate('backward')"
                @keydown.down.stop.prevent="onKeyboardNavigate('forward')"
                @keydown.enter.stop.prevent="onKeyboardSelect"
                @keydown.esc.stop.prevent="handleEsc"
                @update:modelValue="onUpdateInputValue"
              >
            </div>
            <span
              v-if="filterable"
              ref="calculatorRef"
              aria-hidden="true"
              :class="[
                nsSelectV2.e('selected-item'),
                nsSelectV2.e('input-calculator'),
              ]"
              v-text="states.displayInputValue"
            />
          </template>
          <span
            v-if="shouldShowPlaceholder"
            :class="[
              nsSelectV2.e('placeholder'),
              nsSelectV2.is(
                'transparent',
                multiple ? value.length === 0 : !hasModelValue
              ),
            ]"
          >
            {{ currentPlaceholder }}
          </span>
          <span :class="nsSelectV2.e('suffix')">
            <lp-icon
              v-if="iconComponent"
              v-show="!showClearBtn"
              :class="[nsSelectV2.e('caret'), nsInput.e('icon'), iconReverse]"
            >
              <component :is="iconComponent" />
            </lp-icon>
            <lp-icon
              v-if="showClearBtn && clearIcon"
              :class="[nsSelectV2.e('caret'), nsInput.e('icon')]"
              @click.prevent.stop="handleClear"
            >
              <component :is="clearIcon" />
            </lp-icon>
            <lp-icon
              v-if="validateState && validateIcon"
              :class="[nsInput.e('icon'), nsInput.e('validateIcon')]"
            >
              <component :is="validateIcon" />
            </lp-icon>
          </span>
        </div>
      </template>
      <template #content>
        <lp-select-menu
          ref="menuRef"
          :data="filteredOptions"
          :width="popperSize"
          :hovering-index="states.hoveringIndex"
          :scrollbar-always-on="scrollbarAlwaysOn"
        >
          <template #default="scope">
            <slot v-bind="scope" />
          </template>
          <template #empty>
            <slot name="empty">
              <p :class="nsSelectV2.e('empty')">
                {{ emptyText ? emptyText : '' }}
              </p>
            </slot>
          </template>
        </lp-select-menu>
      </template>
    </lp-tooltip>
  </div>
</template>

<script lang="ts" setup>
import { computed, defineComponent, provide, reactive, toRefs, vModelText } from 'vue';
import { isArray } from '@lemon-peel/utils';
import { ClickOutside } from '@lemon-peel/directives';
import LpTooltip from '@lemon-peel/components/tooltip';
import LpTag from '@lemon-peel/components/tag';
import LpIcon from '@lemon-peel/components/icon';

import { selectV2InjectionKey } from './token';
import { selectEmits } from './select';
import { selectProps } from './defaults';
import LpSelectMenu from './SelectDropdown.vue';
import useSelect from './useSelect';

const vClickOutside = ClickOutside;

defineOptions({
  name: 'LpSelectV2',
});

const props = defineProps(selectProps);
const emit = defineEmits(selectEmits);

const modelValue = computed(() => {
  const { value: rawModelValue, multiple } = props;
  const fallback = multiple ? [] : undefined;
  // When it is array, we check if this is multi-select.
  // Based on the result we get
  if (isArray(rawModelValue)) {
    return multiple ? rawModelValue : fallback;
  }
  return multiple ? fallback : rawModelValue;
});

const {

  // data exports
  collapseTagSize,
  currentPlaceholder,
  expanded,
  emptyText,
  popupHeight,
  debounce,
  filteredOptions,
  iconComponent,
  iconReverse,
  inputWrapperStyle,
  popperSize,
  dropdownMenuVisible,
  hasModelValue,
  // readonly,
  shouldShowPlaceholder,
  selectDisabled,
  selectSize,
  showClearBtn,
  states,
  tagMaxWidth,
  nsSelectV2,
  nsInput,

  // refs items exports
  calculatorRef,
  inputRef,
  menuRef,
  popper,
  selectRef,
  selectionRef,

  popperRef,

  validateState,
  validateIcon,

  // methods exports
  debouncedOnInputChange,
  deleteTag,
  getLabel,
  getValueKey,
  handleBlur,
  handleClear,
  handleClickOutside,
  handleDel,
  handleEsc,
  handleFocus,
  handleMenuEnter,
  handleResize,
  toggleMenu,
  scrollTo,
  onInput,
  onKeyboardNavigate,
  onKeyboardSelect,
  onSelect,
  onHover,
  onUpdateInputValue,
  handleCompositionStart,
  handleCompositionEnd,
  handleCompositionUpdate,
} = useSelect(reactive({ ...toRefs(props), modelValue }), emit);

// TODO, remove the any cast to align the actual API.
provide(selectV2InjectionKey, {
  props: reactive({
    ...toRefs(props),
    height: popupHeight,
    modelValue,
  }),
  popper,
  onSelect,
  onHover,
  onKeyboardNavigate,
  onKeyboardSelect,
} as any);

</script>
