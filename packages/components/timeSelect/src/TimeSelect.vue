<template>
  <lp-select
    ref="select"
    :model-value="value"
    :disabled="isDisabled"
    :clearable="clearable"
    :clear-icon="clearIcon"
    :size="size"
    :effect="effect"
    :placeholder="placeholder"
    default-first-option
    :filterable="editable"
    @update:model-value="(event: Event) => $emit('update:modelValue', event)"
    @change="(event: Event) => $emit('change', event)"
    @blur="(event: Event) => $emit('blur', event)"
    @focus="(event: Event) => $emit('focus', event)"
  >
    <lp-option
      v-for="item in items"
      :key="item.value"
      :label="item.value"
      :value="item.value"
      :disabled="item.disabled"
    />
    <template #prefix>
      <lp-icon v-if="prefixIcon" :class="nsInput.e('prefix-icon')">
        <component :is="prefixIcon" />
      </lp-icon>
    </template>
  </lp-select>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { LpSelect, LpOption } from '@lemon-peel/components/select';
import LpIcon from '@lemon-peel/components/icon';
import { useDisabled, useNamespace } from '@lemon-peel/hooks';
import { timeSelectProps } from './timeSelect';
import { compareTime, formatTime, nextTime, parseTime } from './utils';

dayjs.extend(customParseFormat);

defineOptions({
  name: 'LpTimeSelect',
});

defineEmits(['change', 'blur', 'focus', 'update:modelValue']);

const props = defineProps(timeSelectProps);

const nsInput = useNamespace('input');
const select = ref<InstanceType<typeof LpSelect>>(null as any);

const isDisabled = useDisabled();

const value = computed(() => props.modelValue);
const start = computed(() => {
  const time = parseTime(props.start);
  return time ? formatTime(time) : null;
});

const end = computed(() => {
  const time = parseTime(props.end);
  return time ? formatTime(time) : null;
});

const step = computed(() => {
  const time = parseTime(props.step);
  return time ? formatTime(time) : null;
});

const minTime = computed(() => {
  const time = parseTime(props.minTime || '');
  return time ? formatTime(time) : null;
});

const maxTime = computed(() => {
  const time = parseTime(props.maxTime || '');
  return time ? formatTime(time) : null;
});

const items = computed(() => {
  const result: { value: string, disabled: boolean }[] = [];
  if (props.start && props.end && props.step) {
    let current = start.value;
    let currentTime: string;
    while (current && end.value && compareTime(current, end.value) <= 0) {
      currentTime = dayjs(current, 'HH:mm').format(props.format);
      result.push({
        value: currentTime,
        disabled:
          compareTime(current, minTime.value || '-1:-1') <= 0 ||
          compareTime(current, maxTime.value || '100:100') >= 0,
      });
      current = nextTime(current, step.value!);
    }
  }
  return result;
});

const blur = () => {
  select.value?.blur?.();
};

const focus = () => {
  select.value?.focus?.();
};

defineExpose({
  blur,
  focus,
});
</script>
