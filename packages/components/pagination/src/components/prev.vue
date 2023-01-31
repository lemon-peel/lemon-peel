<template>
  <button
    type="button"
    class="btn-prev"
    :disabled="internalDisabled"
    :aria-disabled="internalDisabled"
    @click="$emit('click', $event)"
  >
    <span v-if="prevText">{{ prevText }}</span>
    <lp-icon v-else>
      <component :is="prevIcon" />
    </lp-icon>
  </button>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { LpIcon } from '@lemon-peel/components/icon';
import { paginationPrevEmits, paginationPrevProps } from './prev.vue';

defineOptions({
  name: 'LpPaginationPrev',
});

const props = defineProps(paginationPrevProps);
defineEmits(paginationPrevEmits);

const internalDisabled = computed(
  () => props.disabled || props.currentPage <= 1,
);
</script>
