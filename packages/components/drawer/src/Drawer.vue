<template>
  <Teleport to="body" :disabled="!appendToBody">
    <Transition
      :name="ns.b('fade')"
      @after-enter="afterEnter"
      @after-leave="afterLeave"
      @before-leave="beforeLeave"
    >
      <lp-overlay
        v-show="isVisible"
        :mask="modal"
        :overlay-class="modalClass"
        :z-index="zIndex"
        @click="onModalClick"
      >
        <lp-focus-trap
          loop
          :trapped="isVisible"
          :focus-trap-el="drawerRef"
          :focus-start-el="focusStartRef"
          @release-requested="onCloseRequested"
        >
          <div
            ref="drawerRef"
            aria-modal="true"
            :aria-label="title || undefined"
            :aria-labelledby="!title ? titleId : undefined"
            :aria-describedby="bodyId"
            :class="[ns.b(), direction, visible && 'open', customClass]"
            :style="
              isHorizontal ? 'width: ' + drawerSize : 'height: ' + drawerSize
            "
            role="dialog"
            @click.stop
          >
            <span ref="focusStartRef" :class="ns.e('sr-focus')" tabindex="-1" />
            <header v-if="withHeader" :class="ns.e('header')">
              <slot
                v-if="!$slots.title"
                name="header"
                :close="handleClose"
                :title-id="titleId"
                :title-class="ns.e('title')"
              >
                <span
                  v-if="!$slots.title"
                  :id="titleId"
                  role="heading"
                  :class="ns.e('title')"
                >
                  {{ title }}
                </span>
              </slot>
              <slot v-else name="title">
                <!-- DEPRECATED SLOT -->
              </slot>
              <button
                v-if="showClose"
                :aria-label="t('lp.drawer.close')"
                :class="ns.e('close-btn')"
                type="button"
                @click="handleClose"
              >
                <lp-icon :class="ns.e('close')"><close /></lp-icon>
              </button>
            </header>
            <template v-if="rendered">
              <div :id="bodyId" :class="ns.e('body')">
                <slot />
              </div>
            </template>
            <div v-if="$slots.footer" :class="ns.e('footer')">
              <slot name="footer" />
            </div>
          </div>
        </lp-focus-trap>
      </lp-overlay>
    </Transition>
  </Teleport>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { Close } from '@element-plus/icons-vue';
import { LpOverlay } from '@lemon-peel/components/overlay';
import { useDialog } from '@lemon-peel/components/dialog';
import { useLocale, useNamespace } from '@lemon-peel/hooks';
import { addUnit } from '@lemon-peel/utils';
import LpFocusTrap from '@lemon-peel/components/focusTrap';
import LpIcon from '@lemon-peel/components/icon';

import { drawerEmits, drawerProps } from './drawer';

import type { Ref } from 'vue';

defineOptions({ name: 'LpDrawer' });

const props = defineProps(drawerProps);
const emit = defineEmits(drawerEmits);

const drawerRef: Ref<HTMLElement> = ref(null as any);
const focusStartRef: Ref<HTMLElement> = ref(null as any);
const ns = useNamespace('drawer');
const { t } = useLocale();

const isHorizontal = computed(
  () => props.direction === 'rtl' || props.direction === 'ltr',
);
const drawerSize = computed(() => addUnit(props.size));

const {
  isVisible,
  titleId,
  bodyId,
  rendered,
  beforeLeave,
  afterEnter,
  afterLeave,
  onModalClick,
  onCloseRequested,
  handleClose,
} = useDialog(props, drawerRef);

defineExpose({
  isVisible,
  rendered,
  afterEnter,
  afterLeave,
  onModalClick,
  onCloseRequested,
  close: handleClose,
});
</script>
