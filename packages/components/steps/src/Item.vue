<template>
  <div
    :style="style"
    :class="[
      ns.b(),
      ns.is(isSimple ? 'simple' : parent.props.direction),
      ns.is('flex', isLast && !space && !isCenter),
      ns.is('center', isCenter && !isVertical && !isSimple),
    ]"
  >
    <!-- icon & line -->
    <div :class="[ns.e('head'), ns.is(currentStatus)]">
      <div v-if="!isSimple" :class="ns.e('line')">
        <i :class="ns.e('line-inner')" :style="lineStyle" />
      </div>

      <div
        :class="[ns.e('icon'), ns.is(icon || $slots.icon ? 'icon' : 'text')]"
      >
        <slot name="icon">
          <lp-icon v-if="icon" :class="ns.e('icon-inner')">
            <component :is="icon" />
          </lp-icon>
          <lp-icon
            v-else-if="currentStatus === 'success'"
            :class="[ns.e('icon-inner'), ns.is('status')]"
          >
            <Check />
          </lp-icon>
          <lp-icon
            v-else-if="currentStatus === 'error'"
            :class="[ns.e('icon-inner'), ns.is('status')]"
          >
            <Close />
          </lp-icon>
          <div v-else-if="!isSimple" :class="ns.e('icon-inner')">
            {{ index + 1 }}
          </div>
        </slot>
      </div>
    </div>
    <!-- title & description -->
    <div :class="ns.e('main')">
      <div :class="[ns.e('title'), ns.is(currentStatus)]">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="isSimple" :class="ns.e('arrow')" />
      <div v-else :class="[ns.e('description'), ns.is(currentStatus)]">
        <slot name="description">{{ description }}</slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, getCurrentInstance, inject, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import { useNamespace } from '@lemon-peel/hooks';
import { LpIcon } from '@lemon-peel/components/icon';
import { Check, Close } from '@element-plus/icons-vue';

import { stepProps } from './item';

import type { CSSProperties, Ref } from 'vue';
import type { StepItemState } from './item';

export interface IStepsProps {
  space: number | string;
  active: number;
  direction: string;
  alignCenter: boolean;
  simple: boolean;
  finishStatus: string;
  processStatus: string;
}

export interface IStepsInject {
  props: IStepsProps;
  steps: Ref<StepItemState[]>;
}

defineOptions({
  name: 'LpStep',
});

const props = defineProps(stepProps);
const ns = useNamespace('step');
const index = ref(-1);
const lineStyle = ref({});
const internalStatus = ref('');
const parent = inject('LpSteps') as IStepsInject;
const currentInstance = getCurrentInstance();

const prevStatus = computed(() => {
  const prevStep = parent.steps.value[index.value - 1];
  return prevStep ? prevStep.currentStatus : 'wait';
});

const updateStatus = (activeIndex: number) => {
  if (activeIndex > index.value) {
    internalStatus.value = parent.props.finishStatus;
  } else if (activeIndex === index.value && prevStatus.value !== 'error') {
    internalStatus.value = parent.props.processStatus;
  } else {
    internalStatus.value = 'wait';
  }
  const prevChild = parent.steps.value[index.value - 1];
  if (prevChild) prevChild.calcProgress(internalStatus.value);
};

onMounted(() => {
  watch(
    [
      () => parent.props.active,
      () => parent.props.processStatus,
      () => parent.props.finishStatus,
    ],
    ([active]) => {
      updateStatus(active);
    },
    { immediate: true },
  );
});

onBeforeUnmount(() => {
  parent.steps.value = parent.steps.value.filter(
    instance => instance.uid !== currentInstance?.uid,
  );
});

const currentStatus = computed(() => {
  return props.status || internalStatus.value;
});

const isCenter = computed(() => {
  return parent.props.alignCenter;
});

const isVertical = computed(() => {
  return parent.props.direction === 'vertical';
});

const isSimple = computed(() => {
  return parent.props.simple;
});

const stepsCount = computed(() => {
  return parent.steps.value.length;
});

const isLast = computed(() => {
  return parent.steps.value[stepsCount.value - 1]?.uid === currentInstance?.uid;
});

const space = computed(() => {
  return isSimple.value ? '' : parent.props.space;
});

const style = computed(() => {
  const styleObj: CSSProperties = {
    flexBasis:
      typeof space.value === 'number'
        ? `${space.value}px`
        : space.value ?? `${100 / (stepsCount.value - (isCenter.value ? 0 : 1))}%`,
  };
  if (isVertical.value) return styleObj;
  if (isLast.value) {
    styleObj.maxWidth = `${100 / stepsCount.value}%`;
  }
  return styleObj;
});

const setIndex = (val: number) => {
  index.value = val;
};

const calcProgress = (status: string) => {
  let step = 100;
  const styleObj: CSSProperties = {};
  styleObj.transitionDelay = `${150 * index.value}ms`;
  if (status === parent.props.processStatus) {
    step = 0;
  } else if (status === 'wait') {
    step = 0;
    styleObj.transitionDelay = `${-150 * index.value}ms`;
  }
  styleObj.borderWidth = step && !isSimple.value ? '1px' : 0;
  styleObj[parent.props.direction === 'vertical' ? 'height' : 'width'] = `${step}%`;
  lineStyle.value = styleObj;
};

const stepItemState = reactive({
  uid: computed(() => currentInstance?.uid),
  currentStatus,
  setIndex,
  calcProgress,
});

parent.steps.value = [...parent.steps.value, stepItemState];
</script>
