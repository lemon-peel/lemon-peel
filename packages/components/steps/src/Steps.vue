<template>
  <div :class="[ns.b(), ns.m(simple ? 'simple' : direction)]">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { provide, ref, watch } from 'vue';
import { CHANGE_EVENT } from '@lemon-peel/constants';
import { useNamespace } from '@lemon-peel/hooks';
import { stepsEmits, stepsProps } from './steps';

import type { Ref } from 'vue';
import type { StepItemState } from './item';

defineOptions({
  name: 'LpSteps',
});

const props = defineProps(stepsProps);
const emit = defineEmits(stepsEmits);

const ns = useNamespace('steps');

const steps: Ref<StepItemState[]> = ref([]);

watch(steps, () => {
  steps.value.forEach((instance: StepItemState, index: number) => {
    instance.setIndex(index);
  });
});

provide('LpSteps', { props, steps });

watch(
  () => props.active,
  (newValue: number, oldValue: number) => {
    emit(CHANGE_EVENT, newValue, oldValue);
  },
);
</script>
