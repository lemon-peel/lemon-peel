<template>
  <div
    :ref="composedDialogRef"
    :class="[
      ns.b(),
      ns.is('fullscreen', fullscreen),
      ns.is('draggable', draggable),
      ns.is('align-center', alignCenter),
      { [ns.m('center')]: center },
      customClass,
    ]"
    :style="style"
    tabindex="-1"
  >
    <header ref="headerRef" :class="ns.e('header')">
      <slot name="header">
        <span role="heading" :class="ns.e('title')">
          {{ title }}
        </span>
      </slot>
      <button
        v-if="showClose"
        :aria-label="t('el.dialog.close')"
        :class="ns.e('headerbtn')"
        type="button"
        @click="$emit('close')"
      >
        <lp-icon :class="ns.e('close')">
          <component :is="closeIcon || Close" />
        </lp-icon>
      </button>
    </header>
    <div :id="bodyId" :class="ns.e('body')">
      <slot />
    </div>
    <footer v-if="$slots.footer" :class="ns.e('footer')">
      <slot name="footer" />
    </footer>
  </div>
</template>

<script lang="ts" setup>
import { computed, inject } from 'vue';
import { LpIcon } from '@lemon-peel/components/icon';
import { FOCUS_TRAP_INJECTION_KEY } from '@lemon-peel/components/focusTrap';
import { useDraggable, useLocale } from '@lemon-peel/hooks';
import { CloseComponents, composeRefs } from '@lemon-peel/utils';
import { dialogInjectionKey } from '@lemon-peel/tokens';
import { dialogContentEmits, dialogContentProps } from './dialogContent';

const { t } = useLocale();
const { Close } = CloseComponents;

defineOptions({ name: 'LpDialogContent' });
const props = defineProps(dialogContentProps);
defineEmits(dialogContentEmits);

const { dialogRef, headerRef, bodyId, ns, style } = inject(dialogInjectionKey)!;
const { focusTrapRef } = inject(FOCUS_TRAP_INJECTION_KEY)!;

const composedDialogRef = composeRefs(focusTrapRef, dialogRef);

const draggable = computed(() => props.draggable);
useDraggable(dialogRef, headerRef, draggable);
</script>
