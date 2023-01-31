<template>
  <span :class="ns.e('jump')" :disabled="disabled">
    {{ t('el.pagination.goto') }}
    <lp-input
      size="small"
      :class="[ns.e('editor'), ns.is('in-pagination')]"
      :min="1"
      :max="pageCount"
      :disabled="disabled"
      :model-value="innerValue"
      :validate-event="false"
      type="number"
      @update:model-value="handleInput"
      @change="handleChange"
    />
    {{ t('el.pagination.pageClassifier') }}
  </span>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useLocale, useNamespace } from '@lemon-peel/hooks';
import LpInput from '@lemon-peel/components/input';
import { usePagination } from '../usePagination';

defineOptions({
  name: 'LpPaginationJumper',
});

const { t } = useLocale();
const ns = useNamespace('pagination');
const { pageCount, disabled, currentPage, changeEvent } = usePagination();
const userInput = ref<number>();
const innerValue = computed(() => userInput.value ?? currentPage?.value);

function handleInput(val: number | string) {
  userInput.value = +val;
}

function handleChange(val: number | string) {
  val = Math.trunc(+val);
  changeEvent?.(+val);
  userInput.value = undefined;
}
</script>
