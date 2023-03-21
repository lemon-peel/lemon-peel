<template>
  <lp-tooltip
    ref="tooltipRef"
    :visible="popperVisible"
    :teleported="teleported"
    :popper-class="[nsCascader.e('dropdown'), popperClass]"
    :popper-options="popperOptions"
    :fallback-placements="[
      'bottom-start',
      'bottom',
      'top-start',
      'top',
      'right',
      'left',
    ]"
    :stop-popper-mouse-event="false"
    :gpu-acceleration="false"
    placement="bottom-start"
    :transition="`${nsCascader.namespace.value}-zoom-in-top`"
    effect="light"
    pure
    persistent
    @hide="hideSuggestionPanel"
  >
    <template #default>
      <div
        v-click-outside:[popperPaneRef]="() => togglePopperVisible(false)"
        :class="[
          nsCascader.b(),
          nsCascader.m(realSize),
          nsCascader.is('disabled', isDisabled),
          $attrs.class,
        ]"
        v-bind="$attrs"
        @click="() => togglePopperVisible(isMutable ? undefined : true)"
        @keydown="handleKeyDown"
        @mouseenter="inputHover = true"
        @mouseleave="inputHover = false"
      >
        <lp-input
          ref="input"
          v-model:value="inputValue"
          :placeholder="currentPlaceholder"
          :readonly="isMutable"
          :disabled="isDisabled"
          :validate-event="false"
          :size="realSize"
          :class="nsCascader.is('focus', popperVisible)"
          @compositionstart="handleComposition"
          @compositionupdate="handleComposition"
          @compositionend="handleComposition"
          @focus="(e: Event) => $emit('focus', e)"
          @blur="(e: Event) => $emit('blur', e)"
          @input="handleInput"
        >
          <template #suffix>
            <lp-icon
              v-if="clearBtnVisible"
              key="clear"
              :class="[nsInput.e('icon'), 'icon-circle-close']"
              @click.stop="handleClear"
            >
              <circle-close />
            </lp-icon>
            <lp-icon
              v-else
              key="arrow-down"
              :class="[
                nsInput.e('icon'),
                'icon-arrow-down',
                nsCascader.is('reverse', popperVisible),
              ]"
              @click.stop="togglePopperVisible()"
            >
              <arrow-down />
            </lp-icon>
          </template>
        </lp-input>

        <div v-if="multiple" ref="tagWrapper" :class="nsCascader.e('tags')">
          <lp-tag
            v-for="tag in presentTags"
            :key="tag.key"
            :type="tagType"
            :size="tagSize"
            :hit="tag.hitState"
            :closable="tag.closable"
            disable-transitions
            @close="deleteTag(tag)"
          >
            <template v-if="tag.isCollapseTag === false">
              <span>{{ tag.text }}</span>
            </template>
            <template v-else>
              <lp-tooltip
                :teleported="false"
                :disabled="popperVisible || !collapseTagsTooltip"
                :fallback-placements="['bottom', 'top', 'right', 'left']"
                placement="bottom"
                effect="light"
              >
                <template #default>
                  <span>{{ tag.text }}</span>
                </template>
                <template #content>
                  <div :class="nsCascader.e('collapse-tags')">
                    <div
                      v-for="(tag2, idx) in allPresentTags.slice(1)"
                      :key="idx"
                      :class="nsCascader.e('collapse-tag')"
                    >
                      <lp-tag
                        :key="tag2.key"
                        class="in-tooltip"
                        :type="tagType"
                        :size="tagSize"
                        :hit="tag2.hitState"
                        :closable="tag2.closable"
                        disable-transitions
                        @close="deleteTag(tag2)"
                      >
                        <span>{{ tag2.text }}</span>
                      </lp-tag>
                    </div>
                  </div>
                </template>
              </lp-tooltip>
            </template>
          </lp-tag>
          <input
            v-if="filterable && !isDisabled"
            v-model="searchInputValue"
            type="text"
            :class="nsCascader.e('search-input')"
            :placeholder="presentText ? '' : inputPlaceholder"
            @input="(e) => handleInput(searchInputValue, e as KeyboardEvent)"
            @click.stop="togglePopperVisible(true)"
            @keydown.delete="handleDelete"
            @compositionstart="handleComposition"
            @compositionupdate="handleComposition"
            @compositionend="handleComposition"
          >
        </div>
      </div>
    </template>

    <template #content>
      <lp-cascader-panel
        v-show="!filtering"
        ref="panel"
        v-model:value="checkedValue"
        :options="options"
        :props="props"
        :border="false"
        :render-label="$slots.default"
        @expand-change="handleExpandChange"
        @close="$nextTick(() => togglePopperVisible(false))"
      />
      <lp-scrollbar
        v-if="filterable"
        v-show="filtering"
        ref="suggestionPanel"
        tag="ul"
        :class="nsCascader.e('suggestion-panel')"
        :view-class="nsCascader.e('suggestion-list')"
        @keydown="handleSuggestionKeyDown"
      >
        <template v-if="suggestions.length > 0">
          <li
            v-for="item in suggestions"
            :key="item.uid"
            :class="[
              nsCascader.e('suggestion-item'),
              nsCascader.is('checked', item.checked),
            ]"
            :tabindex="-1"
            @click="handleSuggestionClick(item)"
          >
            <span>{{ item.text }}</span>
            <lp-icon v-if="item.checked">
              <check />
            </lp-icon>
          </li>
        </template>
        <slot v-else name="empty">
          <li :class="nsCascader.e('empty-text')">
            {{ t('lp.cascader.noMatch') }}
          </li>
        </slot>
      </lp-scrollbar>
    </template>
  </lp-tooltip>
</template>

<script lang="ts" setup>
import { computed, defineComponent, nextTick, onMounted, ref, VNode, watch } from 'vue';
import { isPromise } from '@vue/shared';
import { cloneDeep, debounce } from 'lodash-es';

import { isClient, useCssVar, useResizeObserver } from '@vueuse/core';
/* eslint-disable @typescript-eslint/consistent-type-imports */
import LpCascaderPanel from '@lemon-peel/components/cascaderPanel';
import LpInput from '@lemon-peel/components/input';
import LpTooltip from '@lemon-peel/components/tooltip';
import LpScrollbar from '@lemon-peel/components/scrollbar';
/* eslint-enable @typescript-eslint/consistent-type-imports */
import { useTooltipContentProps } from '@lemon-peel/components/tooltip';
import LpTag, { tagProps } from '@lemon-peel/components/tag';
import LpIcon from '@lemon-peel/components/icon';

import { ClickOutside as vClickOutside } from '@lemon-peel/directives';
import { useFormItem, useLocale, useNamespace, useSize } from '@lemon-peel/hooks';

import { debugWarn, focusNode, getSibling, isKorean } from '@lemon-peel/utils';
import { CHANGE_EVENT, EVENT_CODE, UPDATE_MODEL_EVENT } from '@lemon-peel/constants';
import { ArrowDown, Check, CircleClose } from '@element-plus/icons-vue';
import { cascaderProps, cascaderEmits } from './cascader';

import type { Options } from '@lemon-peel/components/popper';
import type { ComputedRef, Ref } from 'vue';
import type { CascaderNode, CascaderValue, Tag } from '@lemon-peel/components/cascaderPanel';

type CascaderPanelType = InstanceType<typeof LpCascaderPanel>;
type TooltipType = InstanceType<typeof LpTooltip>;
type InputType = InstanceType<typeof LpInput>;
type SuggestionPanelType = InstanceType<typeof LpScrollbar>;

const popperOptions: Partial<Options> = {
  modifiers: [
    {
      name: 'arrowPosition',
      enabled: true,
      phase: 'main',
      fn: ({ state }) => {
        const { modifiersData, placement } = state as any;
        if (['right', 'left', 'bottom', 'top'].includes(placement)) return;
        modifiersData.arrow.x = 35;
      },
      requires: ['arrow'],
    },
  ],
};

const COMPONENT_NAME = 'LpCascader';

defineOptions({
  name: COMPONENT_NAME,
  inheritAttrs: false,
});

const props = defineProps(cascaderProps);
const emit = defineEmits(cascaderEmits);

let inputInitialHeight = 0;
let pressDeleteCount = 0;

const nsCascader = useNamespace('cascader');
const nsInput = useNamespace('input');

const { t } = useLocale();
const { form, formItem } = useFormItem();

const tooltipRef: Ref<TooltipType | null> = ref(null);
const input: Ref<InputType | null> = ref(null);
const tagWrapper = ref(null);
const panel: Ref<CascaderPanelType | null> = ref(null);
const suggestionPanel: Ref<SuggestionPanelType | null> = ref(null);
const popperVisible = ref(false);
const inputHover = ref(false);
const filtering = ref(false);
const inputValue = ref('');
const searchInputValue = ref('');
const presentTags: Ref<Tag[]> = ref([]);
const allPresentTags: Ref<Tag[]> = ref([]);
const suggestions: Ref<CascaderNode[]> = ref([]);
const isOnComposition = ref(false);

const isDisabled = computed(() => props.disabled || form?.disabled);
const inputPlaceholder = computed(
  () => props.placeholder || t('lp.cascader.placeholder'),
);
const currentPlaceholder = computed(() =>
  searchInputValue.value || presentTags.value.length > 0
    ? ''
    : inputPlaceholder.value,
);
const realSize = useSize();
const tagSize = computed(() =>
  ['small'].includes(realSize.value) ? 'small' : 'default',
);
const multiple = computed(() => !!props.props.multiple);
const isMutable = computed(() => !props.filterable || multiple.value);
const searchKeyword = computed(() =>
  multiple.value ? searchInputValue.value : inputValue.value,
);

const checkedNodes: ComputedRef<CascaderNode[]> = computed(
  () => panel.value?.checkedNodes || [],
);

const clearBtnVisible = computed(() => {
  if (
    !props.clearable ||
        isDisabled.value ||
        filtering.value ||
        !inputHover.value
  )
    return false;

  return checkedNodes.value.length > 0;
});

const presentText = computed(() => {
  const { showAllLevels, separator } = props;
  const nodes = checkedNodes.value;
  return nodes.length > 0
    ? (multiple.value
      ? ''
      : nodes[0].calcText(showAllLevels, separator))
    : '';
});

const checkedValue = computed<CascaderValue>({
  get() {
    return cloneDeep(props.value) as CascaderValue;
  },
  set(value) {
    emit(UPDATE_MODEL_EVENT, value);
    emit(CHANGE_EVENT, value);
    if (props.validateEvent) {
      formItem?.validate('change').catch(error => debugWarn(error));
    }
  },
});

const popperPaneRef = computed(() => {
  return tooltipRef.value?.popperRef?.contentRef;
});

const updatePopperPosition = () => {
  nextTick(() => {
    tooltipRef.value?.updatePopper();
  });
};

const syncPresentTextValue = () => {
  const { value } = presentText;
  inputValue.value = value;
  searchInputValue.value = value;
};

const togglePopperVisible = (visible?: boolean) => {
  if (isDisabled.value) return;

  visible = visible ?? !popperVisible.value;

  if (visible !== popperVisible.value) {
    popperVisible.value = visible;
    input.value?.input?.setAttribute('aria-expanded', `${visible}`);

    if (visible) {
      updatePopperPosition();
      nextTick(panel.value?.scrollToExpandingNode);
    } else if (props.filterable) {
      syncPresentTextValue();
    }

    emit('visible-change', visible);
  }
};

const hideSuggestionPanel = () => {
  filtering.value = false;
};

const genTag = (node: CascaderNode): Tag => {
  const { showAllLevels, separator } = props;
  return {
    node,
    key: node.uid,
    text: node.calcText(showAllLevels, separator),
    hitState: false,
    closable: !isDisabled.value && !node.isDisabled,
    isCollapseTag: false,
  };
};

const deleteTag = (tag: Tag) => {
  const node = tag.node as CascaderNode;
  node.doCheck(false);
  panel.value?.calculateCheckedValue();
  emit('remove-tag', node.valueByOption);
};

const calculatePresentTags = () => {
  if (!multiple.value) return;

  const nodes = checkedNodes.value;
  const tags: Tag[] = [];

  const allTags: Tag[] = [];
  for (const node of nodes) allTags.push(genTag(node));
  allPresentTags.value = allTags;

  if (nodes.length > 0) {
    const [first, ...rest] = nodes;
    const restCount = rest.length;

    tags.push(genTag(first));

    if (restCount) {
      if (props.collapseTags) {
        tags.push({
          key: -1,
          text: `+ ${restCount}`,
          closable: false,
          isCollapseTag: true,
        });
      } else {
        for (const node of rest) tags.push(genTag(node));
      }
    }
  }

  presentTags.value = tags;
};

const calculateSuggestions = () => {
  const { filterMethod, showAllLevels, separator } = props;
  const res = panel.value
    ?.getFlattedNodes(!props.props.checkStrictly)
    ?.filter(node => {
      if (node.isDisabled) return false;
      node.calcText(showAllLevels, separator);
      return filterMethod(node, searchKeyword.value);
    });

  if (multiple.value) {
    for (const tag of presentTags.value) {
      tag.hitState = false;
    }
    for (const tag of allPresentTags.value) {
      tag.hitState = false;
    }
  }

  filtering.value = true;
  suggestions.value = res!;
  updatePopperPosition();
};

const focusFirstNode = () => {
  const firstNode: HTMLElement = filtering.value && suggestionPanel.value
    ? suggestionPanel.value.$el.querySelector(
      `.${nsCascader.e('suggestion-item')}`,
    )
    : panel.value?.$el.querySelector(
      `.${nsCascader.b('node')}[tabindex="-1"]`,
    );

  if (firstNode) {
    firstNode.focus();
    !filtering.value && firstNode.click();
  }
};

const updateStyle = () => {
  const inputInner = input.value?.input;
  const tagWrapperElement = tagWrapper.value;
  const suggestionPanelElement = suggestionPanel.value?.$el;

  if (!isClient || !inputInner) return;

  if (suggestionPanelElement) {
    const suggestionList = suggestionPanelElement.querySelector(
      `.${nsCascader.e('suggestion-list')}`,
    );
    suggestionList.style.minWidth = `${inputInner.offsetWidth}px`;
  }

  if (tagWrapperElement) {
    const { offsetHeight } = tagWrapperElement;
    const height =
          presentTags.value.length > 0
            ? `${Math.max(offsetHeight + 6, inputInitialHeight)}px`
            : `${inputInitialHeight}px`;
    inputInner.style.height = height;
    updatePopperPosition();
  }
};

const getCheckedNodes = (leafOnly: boolean) => {
  return panel.value?.getCheckedNodes(leafOnly);
};

const handleExpandChange = (value: CascaderValue) => {
  updatePopperPosition();
  emit('expand-change', value);
};

const handleFilter = debounce(() => {
  const { value } = searchKeyword;

  if (!value) return;

  const passed = props.beforeFilter(value);

  if (isPromise(passed)) {
    passed.then(calculateSuggestions).catch(() => {
      /* prevent log error */
    });
  } else if (passed === false) {
    hideSuggestionPanel();
  } else {
    calculateSuggestions();
  }
}, props.debounce);

const handleInput = (value: string, e?: KeyboardEvent) => {
  !popperVisible.value && togglePopperVisible(true);

  if (e?.isComposing) return;

  value ? handleFilter() : hideSuggestionPanel();
};

const handleComposition = (event: CompositionEvent) => {
  const text = (event.target as HTMLInputElement)?.value;
  if (event.type === 'compositionend') {
    isOnComposition.value = false;
    nextTick(() => handleInput(text));
  } else {
    const lastCharacter = text[text.length - 1] || '';
    isOnComposition.value = !isKorean(lastCharacter);
  }
};

const handleKeyDown = (e: KeyboardEvent) => {
  if (isOnComposition.value) return;

  switch (e.code) {
    case EVENT_CODE.enter: {
      togglePopperVisible();
      break;
    }
    case EVENT_CODE.down: {
      togglePopperVisible(true);
      nextTick(focusFirstNode);
      e.preventDefault();
      break;
    }
    case EVENT_CODE.esc: {
      if (popperVisible.value === true) {
        e.preventDefault();
        e.stopPropagation();
        togglePopperVisible(false);
      }
      break;
    }
    case EVENT_CODE.tab: {
      togglePopperVisible(false);
      break;
    }
  }
};

const handleClear = () => {
  panel.value?.clearCheckedNodes();
  if (!popperVisible.value && props.filterable) {
    syncPresentTextValue();
  }
  togglePopperVisible(false);
};

const handleSuggestionClick = (node: CascaderNode) => {
  const { checked } = node;

  if (multiple.value) {
    panel.value?.handleCheckChange(node, !checked, false);
  } else {
    !checked && panel.value?.handleCheckChange(node, true, false);
    togglePopperVisible(false);
  }
};

const handleSuggestionKeyDown = (e: KeyboardEvent) => {
  const target = e.target as HTMLElement;
  const { code } = e;

  switch (code) {
    case EVENT_CODE.up:
    case EVENT_CODE.down: {
      const distance = code === EVENT_CODE.up ? -1 : 1;
      focusNode(
        getSibling(
          target,
          distance,
          `.${nsCascader.e('suggestion-item')}[tabindex="-1"]`,
        ) as HTMLElement,
      );
      break;
    }
    case EVENT_CODE.enter: {
      target.click();
      break;
    }
  }
};

const handleDelete = () => {
  const tags = presentTags.value;
  const lastTag = tags[tags.length - 1];
  pressDeleteCount = searchInputValue.value ? 0 : pressDeleteCount + 1;

  if (
    !lastTag ||
        !pressDeleteCount ||
        (props.collapseTags && tags.length > 1)
  )
    return;

  if (lastTag.hitState) {
    deleteTag(lastTag);
  } else {
    lastTag.hitState = true;
  }
};

watch(filtering, updatePopperPosition);

watch([checkedNodes, isDisabled], calculatePresentTags);

watch(presentTags, () => {
  nextTick(() => updateStyle());
});

watch(presentText, syncPresentTextValue, { immediate: true });

onMounted(() => {
  const inputInner = input.value!.input!;

  const inputInnerHeight =
        Number.parseFloat(
          useCssVar(nsInput.cssVarName('input-height'), inputInner).value,
        ) - 2;

  inputInitialHeight = inputInner.offsetHeight || inputInnerHeight;
  useResizeObserver(inputInner, updateStyle);
});

defineExpose({
  getCheckedNodes,
});
</script>
