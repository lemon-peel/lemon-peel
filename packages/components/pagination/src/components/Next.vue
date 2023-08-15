<template>
  <button
    type="button"
    class="btn-next"
    :disabled="internalDisabled"
    :aria-disabled="internalDisabled"
    @click="$emit('click', $event)"
  >
    <span v-if="nextText">{{ nextText }}</span>
    <lp-icon v-else>
      <component :is="nextIcon" />
    </lp-icon>
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { LpIcon } from '@lemon-peel/components/icon';
import { paginationNextProps } from './next';

defineOptions({
  name: 'LpPaginationNext',
});

const props = defineProps(paginationNextProps);

defineEmits(['click']);

const internalDisabled = computed(
  () =>
    props.disabled ||
    props.currentPage === props.pageCount ||
    props.pageCount === 0,
);
</script>
