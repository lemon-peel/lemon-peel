<template>
  <transition name="fade-in-linear" @after-leave="$emit('vanish')">
    <lp-overlay
      v-show="visible"
      :z-index="zIndex"
      :overlay-class="[ns.is('message-box'), modalClass]"
      :mask="modal"
    >
      <div
        role="dialog"
        :aria-label="title"
        aria-modal="true"
        :aria-describedby="!showInput ? contentId : undefined"
        :class="`${ns.namespace.value}-overlay-message-box`"
        @click="overlayEvent.onClick"
        @mousedown="overlayEvent.onMousedown"
        @mouseup="overlayEvent.onMouseup"
      >
        <lp-focus-trap
          loop
          :trapped="visible"
          :focus-trap-el="rootRef as HTMLElement"
          :focus-start-el="focusStartRef as HTMLElement"
          @release-requested="onCloseRequested"
        >
          <div
            ref="rootRef"
            :class="[
              ns.b(),
              customClass,
              ns.is('draggable', draggable),
              { [ns.m('center')]: center },
            ]"
            :style="customStyle"
            tabindex="-1"
            @click.stop=""
          >
            <div
              v-if="title !== null && title !== undefined"
              ref="headerRef"
              :class="ns.e('header')"
            >
              <div :class="ns.e('title')">
                <lp-icon
                  v-if="iconComponent && center"
                  :class="[ns.e('status'), typeClass]"
                >
                  <component :is="iconComponent" />
                </lp-icon>
                <span>{{ title }}</span>
              </div>
              <button
                v-if="showClose"
                type="button"
                :class="ns.e('headerbtn')"
                :aria-label="t('lp.messagebox.close')"
                @click="
                  handleAction(distinguishCancelAndClose ? 'close' : 'cancel')
                "
                @keydown.prevent.enter="
                  handleAction(distinguishCancelAndClose ? 'close' : 'cancel')
                "
              >
                <lp-icon :class="ns.e('close')">
                  <close />
                </lp-icon>
              </button>
            </div>
            <div :id="contentId" :class="ns.e('content')">
              <div :class="ns.e('container')">
                <lp-icon
                  v-if="iconComponent && !center && hasMessage"
                  :class="[ns.e('status'), typeClass]"
                >
                  <component :is="iconComponent" />
                </lp-icon>
                <div v-if="hasMessage" :class="ns.e('message')">
                  <slot>
                    <component
                      :is="showInput ? 'label' : 'p'"
                      v-if="!dangerouslyUseHTMLString"
                      :for="showInput ? inputId : undefined"
                    >
                      {{ !dangerouslyUseHTMLString ? message : '' }}
                    </component>
                    <component
                      :is="showInput ? 'label' : 'p'"
                      v-else
                      :for="showInput ? inputId : undefined"
                      v-html="message"
                    />
                  </slot>
                </div>
              </div>
              <div v-show="showInput" :class="ns.e('input')">
                <lp-input
                  :id="inputId"
                  ref="inputRef"
                  v-model="inputValue"
                  :type="inputType"
                  :placeholder="inputPlaceholder"
                  :aria-invalid="validateError"
                  :class="{ invalid: validateError }"
                  @keydown.enter="handleInputEnter as any"
                />
                <div
                  :class="ns.e('errormsg')"
                  :style="{
                    visibility: !!editorErrorMessage ? 'visible' : 'hidden',
                  }"
                >
                  {{ editorErrorMessage }}
                </div>
              </div>
            </div>
            <div :class="ns.e('btns')">
              <lp-button
                v-if="showCancelButton"
                :loading="cancelButtonLoading"
                :class="[cancelButtonClass]"
                :round="roundButton"
                :size="btnSize"
                @click="handleAction('cancel')"
                @keydown.prevent.enter="handleAction('cancel')"
              >
                {{ cancelButtonText || t('lp.messagebox.cancel') }}
              </lp-button>
              <lp-button
                v-show="showConfirmButton"
                ref="confirmRef"
                type="primary"
                :loading="confirmButtonLoading"
                :class="[confirmButtonClasses]"
                :round="roundButton"
                :disabled="confirmButtonDisabled"
                :size="btnSize"
                @click="handleAction('confirm')"
                @keydown.prevent.enter="handleAction('confirm')"
              >
                {{ confirmButtonText || t('lp.messagebox.confirm') }}
              </lp-button>
            </div>
          </div>
        </lp-focus-trap>
      </div>
    </lp-overlay>
  </transition>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onBeforeUnmount, onMounted, reactive, ref, toRefs, watch } from 'vue';
import LpButton from '@lemon-peel/components/button';
import { TrapFocus } from '@lemon-peel/directives';
import { useDraggable, useId, useLocale, useLockscreen, useNamespace, useRestoreActive, useSameTarget, useSize, useZIndex } from '@lemon-peel/hooks';
import LpInput from '@lemon-peel/components/input';
import { LpOverlay } from '@lemon-peel/components/overlay';
import { TypeComponents, TypeComponentsMap, isValidComponentSize } from '@lemon-peel/utils';
import { LpIcon } from '@lemon-peel/components/icon';
import LpFocusTrap from '@lemon-peel/components/focusTrap';

import type { Component, ComponentPublicInstance, PropType, ToRefs, Ref } from 'vue';
import type { ComponentSize } from '@lemon-peel/constants';
import type { Action, MessageBoxState, MessageBoxType } from './messageBox.type';

export default defineComponent({
  name: 'LpMessageBox',
  directives: {
    TrapFocus,
  },
  components: {
    LpButton,
    LpFocusTrap,
    LpInput,
    LpOverlay,
    LpIcon,
    ...TypeComponents,
  },
  inheritAttrs: false,
  props: {
    buttonSize: {
      type: String as PropType<ComponentSize>,
      validator: isValidComponentSize,
      default: 'default',
    },
    modal: {
      type: Boolean,
      default: true,
    },
    lockScroll: {
      type: Boolean,
      default: true,
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    closeOnClickModal: {
      type: Boolean,
      default: true,
    },
    closeOnPressEscape: {
      type: Boolean,
      default: true,
    },
    closeOnHashChange: {
      type: Boolean,
      default: true,
    },
    center: Boolean,
    draggable: Boolean,
    roundButton: {
      default: false,
      type: Boolean,
    },
    container: {
      type: String, // default append to body
      default: 'body',
    },
    boxType: {
      type: String as PropType<MessageBoxType>,
      default: '',
    },
  },
  emits: ['vanish', 'action'],
  setup(props, { emit }) {
    // const popup = usePopup(props, doClose)
    const { t } = useLocale();
    const ns = useNamespace('message-box');
    const visible = ref(false);
    const { nextZIndex } = useZIndex();
    // s represents state
    const state = reactive<MessageBoxState>({
      // autofocus element when open message-box
      autofocus: true,
      beforeClose: null,
      callback: null,
      cancelButtonText: '',
      cancelButtonClass: '',
      confirmButtonText: '',
      confirmButtonClass: '',
      customClass: '',
      customStyle: {},
      dangerouslyUseHTMLString: false,
      distinguishCancelAndClose: false,
      icon: '',
      inputPattern: null,
      inputPlaceholder: '',
      inputType: 'text',
      inputValue: null,
      inputValidator: null,
      inputErrorMessage: '',
      message: null,
      modalFade: true,
      modalClass: '',
      showCancelButton: false,
      showConfirmButton: true,
      type: null,
      title: undefined,
      showInput: false,
      action: '' as Action,
      confirmButtonLoading: false,
      cancelButtonLoading: false,
      confirmButtonDisabled: false,
      editorErrorMessage: '',
      // refer to: https://github.com/ElemeFE/element/commit/2999279ae34ef10c373ca795c87b020ed6753eed
      // seemed ok for now without this state.
      // isOnComposition: false, // temporary remove
      validateError: false,
      zIndex: nextZIndex(),
    });

    const typeClass = computed(() => {
      const type = state.type;
      return { [ns.bm('icon', type || '')]: type && TypeComponentsMap[type] };
    });

    const contentId = useId();
    const inputId = useId();

    const btnSize = useSize(
      computed(() => props.buttonSize),
      { prop: true, form: true, formItem: true },
    );

    const iconComponent = computed<string | Component>(
      () => state.icon || (state.type ? TypeComponentsMap[state.type] : ''),
    );

    const hasMessage = computed(() => !!state.message);
    const rootRef: Ref<HTMLElement> = ref(null as any);
    const headerRef: Ref<HTMLElement> = ref(null as any);
    const focusStartRef = ref<HTMLElement | null>(null);
    const inputRef = ref<ComponentPublicInstance>(null as any);
    const confirmRef = ref<ComponentPublicInstance>();

    const confirmButtonClasses = computed(() => state.confirmButtonClass);

    const validate = () => {
      if (props.boxType === 'prompt') {
        const inputPattern = state.inputPattern;
        if (inputPattern && !inputPattern.test(state.inputValue || '')) {
          state.editorErrorMessage =
            state.inputErrorMessage || t('lp.messagebox.error');
          state.validateError = true;
          return false;
        }
        const inputValidator = state.inputValidator;
        if (typeof inputValidator === 'function') {
          const validateResult = inputValidator(state.inputValue || '');
          if (validateResult === false) {
            state.editorErrorMessage =
              state.inputErrorMessage || t('lp.messagebox.error');
            state.validateError = true;
            return false;
          }
          if (typeof validateResult === 'string') {
            state.editorErrorMessage = validateResult;
            state.validateError = true;
            return false;
          }
        }
      }
      state.editorErrorMessage = '';
      state.validateError = false;
      return true;
    };

    watch(
      () => state.inputValue,
      async val => {
        await nextTick();
        if (props.boxType === 'prompt' && val !== null) {
          validate();
        }
      },
      { immediate: true },
    );

    const getInputElement = () => {
      const inputRefs = inputRef.value.$refs;
      return (inputRefs.input || inputRefs.textarea) as HTMLElement;
    };

    watch(
      () => visible.value,
      val => {
        if (val) {
          if (props.boxType !== 'prompt') {
            focusStartRef.value = state.autofocus ? confirmRef.value?.$el ?? rootRef.value : rootRef.value;
          }
          state.zIndex = nextZIndex();
        }
        if (props.boxType !== 'prompt') return;
        if (val) {
          nextTick().then(() => {
            if (inputRef.value && inputRef.value.$el) {
              focusStartRef.value = state.autofocus ? getInputElement() ?? rootRef.value : rootRef.value;
            }
          });
        } else {
          state.editorErrorMessage = '';
          state.validateError = false;
        }
      },
    );

    const draggable = computed(() => props.draggable);
    useDraggable(rootRef, headerRef, draggable);


    function doClose() {
      if (!visible.value) return;
      visible.value = false;
      nextTick(() => {
        if (state.action) emit('action', state.action);
      });
    }

    onMounted(async () => {
      await nextTick();
      if (props.closeOnHashChange) {
        window.addEventListener('hashchange', doClose);
      }
    });

    onBeforeUnmount(() => {
      if (props.closeOnHashChange) {
        window.removeEventListener('hashchange', doClose);
      }
    });

    const handleAction = (action: Action) => {
      if (props.boxType === 'prompt' && action === 'confirm' && !validate()) {
        return;
      }

      state.action = action;

      if (state.beforeClose) {
        state.beforeClose?.(action, state, doClose);
      } else {
        doClose();
      }
    };

    const handleWrapperClick = () => {
      if (props.closeOnClickModal) {
        handleAction(state.distinguishCancelAndClose ? 'close' : 'cancel');
      }
    };

    const overlayEvent = useSameTarget(handleWrapperClick);

    const handleInputEnter = (e: KeyboardEvent) => {
      if (state.inputType !== 'textarea') {
        e.preventDefault();
        return handleAction('confirm');
      }
    };

    const handleClose = () => {
      handleAction('close');
    };

    // when close on press escape is disabled, pressing esc should not callout
    // any other message box and close any other dialog-ish elements
    // e.g. Dialog has a close on press esc feature, and when it closes, it calls
    // props.beforeClose method to make a intermediate state by callout a message box
    // for some verification or alerting. then if we allow global event liek this
    // to dispatch, it could callout another message box.
    const onCloseRequested = () => {
      if (props.closeOnPressEscape) {
        handleClose();
      }
    };

    // locks the screen to prevent scroll
    if (props.lockScroll) {
      useLockscreen(visible);
    }

    // restore to prev active element.
    useRestoreActive(visible);

    const refs = toRefs(state);
    const otherProps = {
      ns,
      overlayEvent,
      visible,
      hasMessage,
      typeClass,
      contentId,
      inputId,
      btnSize,
      iconComponent,
      confirmButtonClasses,
      rootRef,
      focusStartRef,
      headerRef,
      inputRef,
      confirmRef,
      doClose, // for outside usage
      handleClose, // for out side usage
      onCloseRequested,
      handleWrapperClick,
      handleInputEnter,
      handleAction,
      t,
    };

    return {
      ...refs,
      ...otherProps,
    } as (ToRefs<MessageBoxState> & typeof otherProps);
  },
});
</script>
