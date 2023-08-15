<template>
  <lp-upload action="#" list-type="picture-card" :auto-upload="false">
    <lp-icon><Plus /></lp-icon>

    <template #file="{ file }">
      <div>
        <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
        <span class="el-upload-list__item-actions">
          <span
            class="el-upload-list__item-preview"
            @click="handlePictureCardPreview(file)"
          >
            <lp-icon><zoom-in /></lp-icon>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleDownload(file)"
          >
            <lp-icon><Download /></lp-icon>
          </span>
          <span
            v-if="!disabled"
            class="el-upload-list__item-delete"
            @click="handleRemove(file)"
          >
            <lp-icon><Delete /></lp-icon>
          </span>
        </span>
      </div>
    </template>
  </lp-upload>

  <lp-dialog v-model="dialogVisible">
    <img w-full :src="dialogImageUrl" alt="Preview Image">
  </lp-dialog>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { Delete, Download, Plus, ZoomIn } from '@element-plus/icons-vue';

import type { UploadFile } from 'element-plus';

const dialogImageUrl = ref('');
const dialogVisible = ref(false);
const disabled = ref(false);

const handleRemove = (file: UploadFile) => {
  console.log(file);
};

const handlePictureCardPreview = (file: UploadFile) => {
  dialogImageUrl.value = file.url!;
  dialogVisible.value = true;
};

const handleDownload = (file: UploadFile) => {
  console.log(file);
};
</script>
