<template>
  <lp-upload
    ref="uploadRef"
    class="upload-demo"
    action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
    :auto-upload="false"
  >
    <template #trigger>
      <lp-button type="primary">select file</lp-button>
    </template>

    <lp-button class="ml-3" type="success" @click="submitUpload">
      upload to server
    </lp-button>

    <template #tip>
      <div class="el-upload__tip">
        jpg/png files with a size less than 500kb
      </div>
    </template>
  </lp-upload>
</template>
<script lang="ts" setup>
import { ref } from 'vue';
import type { UploadInstance } from 'lemon-peel';

const uploadRef = ref<UploadInstance>();

const submitUpload = () => {
  uploadRef.value!.submit();
};
</script>
