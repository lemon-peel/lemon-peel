<template>
  <transition
    :name="ns.b('fade')"
    @before-leave="onClose"
    @after-leave="$emit('destroy')"
  >
    <div
      v-show="visible"
      :id="id"
      :class="[ns.b(), customClass, horizontalClass]"
      :style="positionStyle"
      role="alert"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
      @click="onClick"
    >
      <lp-icon v-if="iconComponent" :class="[ns.e('icon'), typeClass]">
        <component :is="iconComponent" />
      </lp-icon>
      <div :class="ns.e('group')">
        <h2 :class="ns.e('title')" v-text="title" />
        <div
          v-show="message"
          :class="ns.e('content')"
          :style="!!title ? undefined : { margin: 0 }"
        >
          <slot>
            <p v-if="!dangerouslyUseHTMLString">{{ message }}</p>
            <!-- Caution here, message could've been compromised, never use user's input as message -->
            <p v-else v-html="message" />
          </slot>
        </div>
        <lp-icon v-if="showClose" :class="ns.e('closeBtn')" @click.stop="close">
          <Close />
        </lp-icon>
      </div>
    </div>
  </transition>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref } from 'vue';
import { useEventListener, useTimeoutFn } from '@vueuse/core';
import { CloseComponents, TypeComponentsMap } from '@lemon-peel/utils';
import { EVENT_CODE } from '@lemon-peel/constants';
import { LpIcon } from '@lemon-peel/components/icon';
import { useNamespace } from '@lemon-peel/hooks';
import { notificationEmits, notificationProps } from './notification';

import type { CSSProperties } from 'vue';

defineOptions({
  name: 'LpNotification',
});

const props = defineProps(notificationProps);
defineEmits(notificationEmits);

const ns = useNamespace('notification');
const { Close } = CloseComponents;

const visible = ref(false);
let timer: (() => void) | undefined;

const typeClass = computed(() => {
  const type = props.type;
  return type && TypeComponentsMap[props.type] ? ns.m(type) : '';
});

const iconComponent = computed(() => {
  if (!props.type) return props.icon;
  return TypeComponentsMap[props.type] || props.icon;
});

const horizontalClass = computed(() =>
  props.position.endsWith('right') ? 'right' : 'left',
);

const verticalProperty = computed(() =>
  props.position.startsWith('top') ? 'top' : 'bottom',
);

const positionStyle = computed<CSSProperties>(() => {
  return {
    [verticalProperty.value]: `${props.offset}px`,
    zIndex: props.zIndex,
  };
});

function close() {
  visible.value = false;
}

function startTimer() {
  if (props.duration > 0) {
    ({ stop: timer } = useTimeoutFn(() => {
      if (visible.value) close();
    }, props.duration));
  }
}

function clearTimer() {
  timer?.();
}

function onKeydown({ code }: KeyboardEvent) {
  if (code === EVENT_CODE.delete || code === EVENT_CODE.backspace) {
    clearTimer(); // press delete/backspace clear timer
  } else if (code === EVENT_CODE.esc) {
    // press esc to close the notification
    if (visible.value) {
      close();
    }
  } else {
    startTimer(); // resume timer
  }
}

// lifecycle
onMounted(() => {
  startTimer();
  visible.value = true;
});

useEventListener(document, 'keydown', onKeydown);

defineExpose({
  visible,
  /** @description close notification */
  close,
});
</script>
