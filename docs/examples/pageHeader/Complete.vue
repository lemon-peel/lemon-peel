<template>
  <div aria-label="A complete example of page header">
    <lp-page-header @back="onBack">
      <template #breadcrumb>
        <lp-breadcrumb separator="/">
          <lp-breadcrumb-item :to="{ path: './page-header.html' }">
            homepage
          </lp-breadcrumb-item>
          <lp-breadcrumb-item><a href="./page-header.html">route 1</a></lp-breadcrumb-item>
          <lp-breadcrumb-item>route 2</lp-breadcrumb-item>
        </lp-breadcrumb>
      </template>
      <template #content>
        <div class="flex items-center">
          <lp-avatar
            class="mr-3"
            :size="32"
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          />
          <span class="text-large font-600 mr-3"> Title </span>
          <span
            class="text-sm mr-2"
            style="color: var(--el-text-color-regular)"
          >
            Sub title
          </span>
          <lp-tag>Default</lp-tag>
        </div>
      </template>
      <template #extra>
        <div class="flex items-center">
          <lp-button>Print</lp-button>
          <lp-button type="primary" class="ml-2">Edit</lp-button>
        </div>
      </template>

      <lp-descriptions :column="3" size="small" class="mt-4">
        <lp-descriptions-item label="Username">kooriookami</lp-descriptions-item>
        <lp-descriptions-item label="Telephone">18100000000</lp-descriptions-item>
        <lp-descriptions-item label="Place">Suzhou</lp-descriptions-item>
        <lp-descriptions-item label="Remarks">
          <lp-tag size="small">School</lp-tag>
        </lp-descriptions-item>
        <lp-descriptions-item label="Address">No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
        </lp-descriptions-item>
      </lp-descriptions>
      <p class="mt-4 text-sm">
        Element Plus team uses <b>weekly</b> release strategy under normal
        circumstance, but critical bug fixes would require hotfix so the actual
        release number <b>could be</b> more than 1 per week.
      </p>
    </lp-page-header>
  </div>
</template>

<script setup lang="ts">
import { LpNotification as notify } from 'lemon-peel';

const onBack = () => {
  notify('Back');
};
</script>
