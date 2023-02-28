<template>
  <transition :name="ns.b('fade')">
    <div v-show="visible" :class="[ns.b(), ns.m(type), ns.is('center', center), ns.is(effect)]" role="alert">
      <lp-icon v-if="showIcon && iconComponent" :class="iconClass">
        <component :is="iconComponent" />
      </lp-icon>

      <div :class="ns.e('content')">
        <span v-if="title || $slots.title" :class="[ns.e('title'), isBoldTitle]">
          <slot name="title">{{ title }}</slot>
        </span>
        <p v-if="$slots.default || description" :class="ns.e('description')">
          <slot>{{ description }}</slot>
        </p>
        <template v-if="closable">
          <div v-if="closeText" :class="[ns.e('close-btn'), ns.is('customed')]" @click="close">
            {{ closeText }}
          </div>
          <lp-icon v-else :class="ns.e('close-btn')" @click="close">
            <Close />
          </lp-icon>
        </template>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import { computed, ref, useSlots } from 'vue';
import { TypeComponents, TypeComponentsMap } from '@lemon-peel/utils';
import { useNamespace } from '@lemon-peel/hooks';
import { LpIcon } from '@lemon-peel/components/icon';

import { alertEmits, alertProps } from './alert';

const { Close } = TypeComponents;

defineOptions({
  name: 'LpAlert',
});

const props = defineProps(alertProps);
const emit = defineEmits(alertEmits);
const slots = useSlots();

const ns = useNamespace('alert');

const visible = ref(true);

const iconComponent = computed(() => TypeComponentsMap[props.type]);

const iconClass = computed(() => [
  ns.e('icon'),
  { [ns.is('big')]: !!props.description || !!slots.default },
]);

const isBoldTitle = computed(() => {
  return { [ns.is('bold')]: props.description || slots.default };
});

const close = (event_: MouseEvent) => {
  visible.value = false;
  emit('close', event_);
};
</script>
