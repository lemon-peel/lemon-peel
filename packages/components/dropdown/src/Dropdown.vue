<template>
  <div :class="[ns.b(), ns.is('disabled', disabled)]">
    <lp-tooltip
      ref="popperRef"
      :role="role"
      :effect="effect"
      :fallback-placements="['bottom', 'top']"
      :popper-options="popperOptions"
      :gpu-acceleration="false"
      :hide-after="trigger === 'hover' ? hideTimeout : 0"
      :manual-mode="true"
      :placement="placement"
      :popper-class="[ns.e('popper'), popperClass]"
      :reference-element="referenceElementRef?.$el"
      :trigger="trigger"
      :trigger-keys="triggerKeys"
      :trigger-target-el="contentRef as HTMLElement"
      :show-after="trigger === 'hover' ? showTimeout : 0"
      :stop-popper-mouse-event="false"
      :virtual-ref="triggeringElementRef"
      :virtual-triggering="splitButton"
      :disabled="disabled"
      :transition="`${ns.namespace.value}-zoom-in-top`"
      :teleported="teleported"
      pure
      persistent
      @before-show="handleBeforeShowTooltip"
      @show="handleShowTooltip"
      @before-hide="handleBeforeHideTooltip"
    >
      <template #content>
        <lp-scrollbar
          ref="scrollbar"
          :wrap-style="wrapStyle"
          tag="div"
          :view-class="ns.e('list')"
        >
          <lp-roving-focus-group
            :loop="loop"
            :current-tab-id="currentTabId"
            orientation="horizontal"
            @current-tab-id-change="handleCurrentTabIdChange"
            @entry-focus="handleEntryFocus"
          >
            <lp-dropdown-collection>
              <slot name="dropdown" />
            </lp-dropdown-collection>
          </lp-roving-focus-group>
        </lp-scrollbar>
      </template>
      <template v-if="!splitButton" #default>
        <lp-only-child :id="triggerId" role="button" :tabindex="tabindex">
          <slot name="default" />
        </lp-only-child>
      </template>
    </lp-tooltip>
    <template v-if="splitButton">
      <lp-button-group>
        <lp-button
          ref="referenceElementRef"
          v-bind="buttonProps"
          :size="dropdownSize"
          :type="type"
          :disabled="disabled"
          :tabindex="tabindex"
          @click="handlerMainButtonClick"
        >
          <slot name="default" />
        </lp-button>
        <lp-button
          :id="triggerId"
          ref="triggeringElementRef"
          v-bind="buttonProps"
          role="button"
          :size="dropdownSize"
          :type="type"
          :class="ns.e('caret-button')"
          :disabled="disabled"
          :tabindex="tabindex"
          :aria-label="t('lp.dropdown.toggleDropdown')"
        >
          <lp-icon :class="ns.e('icon')"><arrow-down /></lp-icon>
        </lp-button>
      </lp-button-group>
    </template>
  </div>
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance, provide, ref, toRef, unref } from 'vue';
import LpButton from '@lemon-peel/components/button';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import LpTooltip from '@lemon-peel/components/tooltip';
import LpScrollbar from '@lemon-peel/components/scrollbar';
import LpIcon from '@lemon-peel/components/icon';
import LpRovingFocusGroup from '@lemon-peel/components/rovingFocusGroup';
import { LpOnlyChild } from '@lemon-peel/components/slot';
import { addUnit } from '@lemon-peel/utils';
import { ArrowDown } from '@element-plus/icons-vue';
import { EVENT_CODE } from '@lemon-peel/constants';
import { useId, useLocale, useNamespace, useSize } from '@lemon-peel/hooks';

import { LpCollection as LpDropdownCollection, dropdownProps } from './dropdown';
import { DROPDOWN_INJECTION_KEY } from './tokens';

import type { CSSProperties } from 'vue';

const { ButtonGroup: LpButtonGroup } = LpButton;

defineOptions({ name: 'LpDropdown' });
const emit = defineEmits(['visible-change', 'click', 'command']);
const props = defineProps(dropdownProps);

const vm = getCurrentInstance();
const ns = useNamespace('dropdown');
const { t } = useLocale();

const triggeringElementRef = ref();
const referenceElementRef = ref();
const popperRef = ref<InstanceType<typeof LpTooltip> | null>(null);
const contentRef = ref<HTMLElement>(null as any);
const scrollbar = ref(null);
const currentTabId = ref<string | null>(null);
const isUsingKeyboard = ref(false);
const triggerKeys = [EVENT_CODE.enter, EVENT_CODE.space, EVENT_CODE.down];

const wrapStyle = computed<CSSProperties>(() => ({
  maxHeight: addUnit(props.maxHeight),
}));
const dropdownSize = useSize();
const dropdownTriggerKls = computed(() => [ns.m(dropdownSize.value)]);

const defaultTriggerId = useId().value;
const triggerId = computed<string>(() => {
  return props.id || defaultTriggerId;
});

function handleClose() {
  popperRef.value?.onClose();
}

function handleClick() {
  handleClose();
}

function handleOpen() {
  popperRef.value?.onOpen();
}

function commandHandler(...arguments_: any[]) {
  emit('command', ...arguments_);
}

function onItemEnter() {
  // NOOP for now
}

function onItemLeave() {
  const contentElement = unref(contentRef);

  contentElement?.focus();
  currentTabId.value = null;
}

function handleCurrentTabIdChange(id: string) {
  currentTabId.value = id;
}

function handleEntryFocus(e: Event) {
  if (!isUsingKeyboard.value) {
    e.preventDefault();
    e.stopImmediatePropagation();
  }
}

function handleBeforeShowTooltip() {
  emit('visible-change', true);
}

function handleShowTooltip(event?: Event) {
  if (event?.type === 'keydown') {
    contentRef.value.focus();
  }
}

function handleBeforeHideTooltip() {
  emit('visible-change', false);
}

provide(DROPDOWN_INJECTION_KEY, {
  contentRef: contentRef as any,
  role: computed(() => props.role),
  triggerId,
  isUsingKeyboard,
  onItemEnter,
  onItemLeave,
});

provide('lpDropdown', {
  instance: vm,
  dropdownSize,
  handleClick,
  commandHandler,
  trigger: toRef(props, 'trigger'),
  hideOnClick: toRef(props, 'hideOnClick'),
});

const onFocusAfterTrapped = (e: Event) => {
  e.preventDefault();
  contentRef.value?.focus?.({
    preventScroll: true,
  });
};

const handlerMainButtonClick = (event: MouseEvent) => {
  emit('click', event);
};

defineExpose({
  open: handleOpen,
  close: handleClose,
});
</script>
