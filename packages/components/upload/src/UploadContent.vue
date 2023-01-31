<template>
  <div
    :class="[ns.b(), ns.m(listType), ns.is('drag', drag)]"
    tabindex="0"
    @click="handleClick"
    @keydown.self.enter.space="handleKeydown"
  >
    <template v-if="drag">
      <upload-dragger :disabled="disabled" @file="uploadFiles">
        <slot />
      </upload-dragger>
    </template>
    <template v-else>
      <slot />
    </template>
    <input
      ref="inputRef"
      :class="ns.e('input')"
      :name="name"
      :multiple="multiple"
      :accept="accept"
      type="file"
      @change="handleChange"
      @click.stop
    >
  </div>
</template>

<script lang="ts" setup>
import { shallowRef } from 'vue';
import { useNamespace } from '@lemon-peel/hooks';
import { entriesOf } from '@lemon-peel/utils';
import UploadDragger from './UploadDragger.vue';
import { uploadContentProps } from './uploadContent';
import { genFileId } from './upload';

import type { UploadFile, UploadHooks, UploadRawFile, UploadRequestOptions } from './upload';

defineOptions({
  name: 'LpUploadContent',
  inheritAttrs: false,
});

const props = defineProps(uploadContentProps);
const ns = useNamespace('upload');

const requests = shallowRef<Record<string, XMLHttpRequest | Promise<unknown>>>(
  {},
);
const inputRef = shallowRef<HTMLInputElement>();

const doUpload = (rawFile: UploadRawFile) => {
  const {
    headers,
    data,
    method,
    withCredentials,
    name: filename,
    action,
    onProgress,
    onSuccess,
    onError,
    httpRequest,
  } = props;

  const { uid } = rawFile;
  const options: UploadRequestOptions = {
    headers: headers || {},
    withCredentials,
    file: rawFile,
    data,
    method,
    filename,
    action,
    onProgress: event_ => {
      onProgress(event_, rawFile);
    },
    onSuccess: res => {
      onSuccess(res, rawFile);
      delete requests.value[uid];
    },
    onError: error => {
      onError(error, rawFile);
      delete requests.value[uid];
    },
  };
  const request = httpRequest!(options);
  requests.value[uid] = request;
  if (request instanceof Promise) {
    request.then(options.onSuccess, options.onError);
  }
};

const upload = async (rawFile: UploadRawFile) => {
  inputRef.value!.value = '';

  if (!props.beforeUpload) {
    return doUpload(rawFile);
  }

  let hookResult: Exclude<ReturnType<UploadHooks['beforeUpload']>, Promise<any>>;
  try {
    hookResult = await props.beforeUpload(rawFile);
  } catch {
    hookResult = false;
  }

  if (hookResult === false) {
    props.onRemove(rawFile);
    return;
  }

  let file: File = rawFile;
  if (hookResult instanceof Blob) {
    file = hookResult instanceof File ? hookResult : new File([hookResult], rawFile.name, {
      type: rawFile.type,
    });
  }

  doUpload(
    Object.assign(file, {
      uid: rawFile.uid,
    }),
  );
};

const uploadFiles = (files: File[]) => {
  if (files.length === 0) return;

  const { autoUpload, limit, fileList, multiple, onStart, onExceed } = props;

  if (limit && fileList.length + files.length > limit) {
    onExceed(files, fileList);
    return;
  }

  if (!multiple) {
    files = files.slice(0, 1);
  }

  for (const file of files) {
    const rawFile = file as UploadRawFile;
    rawFile.uid = genFileId();
    onStart(rawFile);
    if (autoUpload) upload(rawFile);
  }
};

const handleChange = (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (!files) return;
  uploadFiles([...files]);
};

const handleClick = () => {
  if (!props.disabled) {
    inputRef.value!.value = '';
    inputRef.value!.click();
  }
};

const handleKeydown = () => {
  handleClick();
};

const abort = (file?: UploadFile) => {
  const reqs = entriesOf(requests.value).filter(
    file ? ([uid]) => String(file.uid) === uid : () => true,
  );
  for (const [uid, request] of reqs) {
    if (request instanceof XMLHttpRequest) request.abort();
    delete requests.value[uid];
  }
};

defineExpose({
  abort,
  upload,
});
</script>
