<template>
  <div>
    <upload-list
      v-if="isPictureCard && showFileList"
      :disabled="disabled"
      :list-type="listType"
      :files="uploadFiles"
      :handle-preview="onPreview"
      @remove="handleRemove"
    >
      <template v-if="$slots.file" #default="{ file }">
        <slot name="file" :file="file" />
      </template>
      <template #append>
        <upload-content ref="uploadRef" v-bind="uploadContentProps">
          <slot v-if="slots.trigger" name="trigger" />
          <slot v-if="!slots.trigger && slots.default" />
        </upload-content>
      </template>
    </upload-list>

    <upload-content
      v-if="!isPictureCard || (isPictureCard && !showFileList)"
      ref="uploadRef"
      v-bind="uploadContentProps"
    >
      <slot v-if="slots.trigger" name="trigger" />
      <slot v-if="!slots.trigger && slots.default" />
    </upload-content>

    <slot v-if="$slots.trigger" />
    <slot name="tip" />
    <upload-list
      v-if="!isPictureCard && showFileList"
      :disabled="disabled"
      :list-type="listType"
      :files="uploadFiles"
      :handle-preview="onPreview"
      @remove="handleRemove"
    >
      <template v-if="$slots.file" #default="{ file }">
        <slot name="file" :file="file" />
      </template>
    </upload-list>
  </div>
</template>

<script lang="ts" setup>
import {
  computed,
  onBeforeUnmount,
  provide,
  shallowRef,
  toRef,
  useSlots,
} from 'vue';
import { uploadContextKey } from '@lemon-peel/tokens';
import { useDisabled } from '@lemon-peel/hooks';

import UploadList from './UploadList.vue';
import UploadContent from './UploadContent.vue';
import { useHandlers } from './useHandlers';
import { uploadProps } from './upload';
import type { UploadContentInstance, UploadContentProps } from './uploadContent';

defineOptions({
  name: 'LpUpload',
});

const props = defineProps(uploadProps);

const slots = useSlots();
const disabled = useDisabled();

const uploadRef = shallowRef<UploadContentInstance>();
const {
  abort,
  submit,
  clearFiles,
  uploadFiles,
  handleStart,
  handleError,
  handleRemove,
  handleSuccess,
  handleProgress,
} = useHandlers(props, uploadRef);

const isPictureCard = computed(() => props.listType === 'picture-card');

const uploadContentProps = computed<UploadContentProps>(() => ({
  ...props,
  fileList: uploadFiles.value,
  onStart: handleStart,
  onProgress: handleProgress,
  onSuccess: handleSuccess,
  onError: handleError,
  onRemove: handleRemove,
}));

onBeforeUnmount(() => {
  for (const { url } of uploadFiles.value) {
    if (url?.startsWith('blob:')) URL.revokeObjectURL(url);
  }
});

provide(uploadContextKey, {
  accept: toRef(props, 'accept'),
});

defineExpose({
  /** @description cancel upload request */
  abort,
  /** @description upload the file list manually */
  submit,
  /** @description clear the file list  */
  clearFiles,
  /** @description select the file manually */
  handleStart,
  /** @description remove the file manually */
  handleRemove,
});
</script>
