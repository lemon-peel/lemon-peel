<template>
  <lp-radio-group v-model="size">
    <lp-radio label="large">Large</lp-radio>
    <lp-radio>Default</lp-radio>
    <lp-radio label="small">Small</lp-radio>
  </lp-radio-group>

  <lp-descriptions
    class="margin-top"
    title="With border"
    :column="3"
    :size="size"
    border
  >
    <template #extra>
      <lp-button type="primary">Operation</lp-button>
    </template>
    <lp-descriptions-item>
      <template #label>
        <div class="cell-item">
          <lp-icon :style="iconStyle">
            <user />
          </lp-icon>
          Username
        </div>
      </template>
      kooriookami
    </lp-descriptions-item>
    <lp-descriptions-item>
      <template #label>
        <div class="cell-item">
          <lp-icon :style="iconStyle">
            <iphone />
          </lp-icon>
          Telephone
        </div>
      </template>
      18100000000
    </lp-descriptions-item>
    <lp-descriptions-item>
      <template #label>
        <div class="cell-item">
          <lp-icon :style="iconStyle">
            <location />
          </lp-icon>
          Place
        </div>
      </template>
      Suzhou
    </lp-descriptions-item>
    <lp-descriptions-item>
      <template #label>
        <div class="cell-item">
          <lp-icon :style="iconStyle">
            <tickets />
          </lp-icon>
          Remarks
        </div>
      </template>
      <lp-tag size="small">School</lp-tag>
    </lp-descriptions-item>
    <lp-descriptions-item>
      <template #label>
        <div class="cell-item">
          <lp-icon :style="iconStyle">
            <office-building />
          </lp-icon>
          Address
        </div>
      </template>
      No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
    </lp-descriptions-item>
  </lp-descriptions>

  <lp-descriptions
    class="margin-top"
    title="Without border"
    :column="3"
    :size="size"
    :style="blockMargin"
  >
    <template #extra>
      <lp-button type="primary">Operation</lp-button>
    </template>
    <lp-descriptions-item label="Username">kooriookami</lp-descriptions-item>
    <lp-descriptions-item label="Telephone">18100000000</lp-descriptions-item>
    <lp-descriptions-item label="Place">Suzhou</lp-descriptions-item>
    <lp-descriptions-item label="Remarks">
      <lp-tag size="small">School</lp-tag>
    </lp-descriptions-item>
    <lp-descriptions-item label="Address">No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
    </lp-descriptions-item>
  </lp-descriptions>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import {
  Iphone,
  Location,
  OfficeBuilding,
  Tickets,
  User,
} from '@element-plus/icons-vue';

const size = ref('');
const iconStyle = computed(() => {
  const marginMap = {
    large: '8px',
    default: '6px',
    small: '4px',
  };
  return {
    marginRight: marginMap[size.value] || marginMap.default,
  };
});
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
.cell-item {
  display: flex;
  align-items: center;
}
.margin-top {
  margin-top: 20px;
}
</style>
