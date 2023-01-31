<template>
  <teleport to="body" :disabled="!appendToBody">
    <transition
      name="dialog-fade"
      @after-enter="afterEnter"
      @after-leave="afterLeave"
      @before-leave="beforeLeave"
    >
      <lp-overlay
        v-show="visible"
        custom-mask-event
        :mask="modal"
        :overlay-class="modalClass"
        :z-index="zIndex"
      >
        <div
          role="dialog"
          aria-modal="true"
          :aria-label="title || undefined"
          :aria-labelledby="!title ? titleId : undefined"
          :aria-describedby="bodyId"
          :class="`${ns.namespace.value}-overlay-dialog`"
          :style="overlayDialogStyle"
          @click="overlayEvent.onClick"
          @mousedown="overlayEvent.onMousedown"
          @mouseup="overlayEvent.onMouseup"
        >
          <lp-focus-trap
            loop
            :trapped="visible"
            focus-start-el="container"
            @focus-after-trapped="onOpenAutoFocus"
            @focus-after-released="onCloseAutoFocus"
            @focusout-prevented="onFocusoutPrevented"
            @release-requested="onCloseRequested"
          >
            <lp-dialog-content
              v-if="rendered"
              ref="dialogContentRef"
              v-bind="$attrs"
              :custom-class="customClass"
              :center="center"
              :align-center="alignCenter"
              :close-icon="closeIcon"
              :draggable="draggable"
              :fullscreen="fullscreen"
              :show-close="showClose"
              :title="title"
              @close="handleClose"
            >
              <template #header>
                <slot
                  v-if="!$slots.title"
                  name="header"
                  :close="handleClose"
                  :title-id="titleId"
                  :title-class="ns.e('title')"
                />
                <slot v-else name="title" />
              </template>
              <slot />
              <template v-if="$slots.footer" #footer>
                <slot name="footer" />
              </template>
              </lp-dialog-content>
              </lp-focus-trap>
            </lp-dialog-content></lp-focus-trap></div>
        </lp-overlay>
      </lp-overlay></transition>
  </teleport>
</template>

<script lang="ts" setup>
import { computed, provide, ref, useSlots } from 'vue';
import { LpOverlay } from '@lemon-peel/components/overlay';
import { useDeprecated, useNamespace, useSameTarget } from '@lemon-peel/hooks';
import { dialogInjectionKey } from '@lemon-peel/tokens';
import LpFocusTrap from '@lemon-peel/components/focus-trap';
import LpDialogContent from './DialogContent.vue';
import { dialogEmits, dialogProps } from './Dialog.vue';
import { useDialog } from './useDialog;

defineOptions({
  name: 'LpDialog',
  inheritAttrs: false,
});

const props = defineProps(dialogProps);
defineEmits(dialogEmits);
const slots = useSlots();

useDeprecated(
  {
    scope: 'el-dialog',
    from: 'the title slot',
    replacement: 'the header slot',
    version: '3.0.0',
    ref: 'https://element-plus.org/en-US/component/dialog.html#slots',
  },
  computed(() => !!slots.title),
);

useDeprecated(
  {
    scope: 'el-dialog',
    from: 'custom-class',
    replacement: 'class',
    version: '2.3.0',
    ref: 'https://element-plus.org/en-US/component/dialog.html#attributes',
    type: 'Attribute',
  },
  computed(() => !!props.customClass),
);

const ns = useNamespace('dialog');
const dialogRef = ref<HTMLElement>();
const headerRef = ref<HTMLElement>();
const dialogContentRef = ref();

const {
  visible,
  titleId,
  bodyId,
  style,
  overlayDialogStyle,
  rendered,
  zIndex,
  afterEnter,
  afterLeave,
  beforeLeave,
  handleClose,
  onModalClick,
  onOpenAutoFocus,
  onCloseAutoFocus,
  onCloseRequested,
  onFocusoutPrevented,
} = useDialog(props, dialogRef);

provide(dialogInjectionKey, {
  dialogRef,
  headerRef,
  bodyId,
  ns,
  rendered,
  style,
});

const overlayEvent = useSameTarget(onModalClick);

const draggable = computed(() => props.draggable && !props.fullscreen);

defineExpose({
  /** @description whether the dialog is visible */
  visible,
  dialogContentRef,
});
</script>