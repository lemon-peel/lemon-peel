<template>
  <lp-radio-group v-model:value="size">
    <lp-radio label="large">Large</lp-radio>
    <lp-radio>Default</lp-radio>
    <lp-radio label="small">Small</lp-radio>
  </lp-radio-group>

  <lp-descriptions
    title="Vertical list with border"
    direction="vertical"
    :column="4"
    :size="size"
    border
  >
    <lp-descriptions-item label="Username">kooriookami</lp-descriptions-item>
    <lp-descriptions-item label="Telephone">18100000000</lp-descriptions-item>
    <lp-descriptions-item label="Place" :span="2">Suzhou</lp-descriptions-item>
    <lp-descriptions-item label="Remarks">
      <lp-tag size="small">School</lp-tag>
    </lp-descriptions-item>
    <lp-descriptions-item label="Address">No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
    </lp-descriptions-item>
  </lp-descriptions>

  <lp-descriptions
    title="Vertical list without border"
    :column="4"
    :size="size"
    direction="vertical"
    :style="blockMargin"
  >
    <lp-descriptions-item label="Username">kooriookami</lp-descriptions-item>
    <lp-descriptions-item label="Telephone">18100000000</lp-descriptions-item>
    <lp-descriptions-item label="Place" :span="2">Suzhou</lp-descriptions-item>
    <lp-descriptions-item label="Remarks">
      <lp-tag size="small">School</lp-tag>
    </lp-descriptions-item>
    <lp-descriptions-item label="Address">No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
    </lp-descriptions-item>
  </lp-descriptions>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

const size = ref('');
const blockMargin = computed(() => {
  const marginMap = {
    large: '32px',
    default: '28px',
    small: '24px',
  };
  return {
    marginTop: marginMap[size.value] || marginMap.default,
  };
});
</script>

<style scoped>
.lp-descriptions {
  margin-top: 20px;
}
</style>
