<template>
  <lp-focus-group-collection>
    <lp-roving-focus-group-impl v-bind="$attrs">
      <slot />
    </lp-roving-focus-group-impl>
  </lp-focus-group-collection>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import LpRovingFocusGroupImpl from './RovingFocusGroupImpl.vue';
import { LpCollection as LpFocusGroupCollection } from './rovingFocusGroup';

export default defineComponent({
  name: 'LpRovingFocusGroup',
  components: {
    LpFocusGroupCollection,
    LpRovingFocusGroupImpl,
  },
});
</script>
