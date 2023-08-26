<template>
  <label for="" :class="[ns.b('demo')]">
    <input v-model:value="checked" type="checkbox"> {{ c.i }}
  </label>
</template>

<script lang="ts" setup>
import { defineComponent, ref } from 'vue';
import { useNamespace } from '@lemon-peel/hooks';

const ns = useNamespace('tree');
const c = ref({ i: 'someStr' });
const checked = ref(false);
</script>
