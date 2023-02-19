import { watch } from 'vue';
import { isNil } from 'lodash-es';
import { useVModel } from '@vueuse/core';
import { debugWarn, throwError } from '@lemon-peel/utils';
import { genFileId } from './upload';
import type { ShallowRef } from 'vue';
import type { UploadContentInstance, UploadContentProps } from './uploadContent';
import type { UploadFile, UploadFiles, UploadProps, UploadRawFile, UploadStatus } from './upload';

const SCOPE = 'LpUpload';

const revokeObjectURL = (file: UploadFile) => {
  if (file.url?.startsWith('blob:')) {
    URL.revokeObjectURL(file.url);
  }
};

export const useHandlers = (
  props: UploadProps,
  uploadRef: ShallowRef<UploadContentInstance | undefined>,
) => {
  const uploadFiles = useVModel(
    props as Omit<UploadProps, 'fileList'> & { fileList: UploadFiles },
    'fileList',
    undefined,
    { passive: true },
  );

  const getFile = (rawFile: UploadRawFile) =>
    uploadFiles.value.find(file => file.uid === rawFile.uid);

  function abort(file: UploadFile) {
    uploadRef.value?.abort(file);
  }

  function clearFiles(
    /** @default ['ready', 'uploading', 'success', 'fail'] */
    states: UploadStatus[] = ['ready', 'uploading', 'success', 'fail'],
  ) {
    uploadFiles.value = uploadFiles.value.filter(
      row => !states.includes(row.status),
    );
  }

  const handleError: UploadContentProps['onError'] = (error, rawFile) => {
    const file = getFile(rawFile);
    if (!file) return;

    console.error(error);
    file.status = 'fail';
    uploadFiles.value.splice(uploadFiles.value.indexOf(file), 1);
    props.onError(error, file, uploadFiles.value);
    props.onChange(file, uploadFiles.value);
  };

  const handleProgress: UploadContentProps['onProgress'] = (event_, rawFile) => {
    const file = getFile(rawFile);
    if (!file) return;

    props.onProgress(event_, file, uploadFiles.value);
    file.status = 'uploading';
    file.percentage = Math.round(event_.percent);
  };

  const handleSuccess: UploadContentProps['onSuccess'] = (
    response,
    rawFile,
  ) => {
    const file = getFile(rawFile);
    if (!file) return;

    file.status = 'success';
    file.response = response;
    props.onSuccess(response, file, uploadFiles.value);
    props.onChange(file, uploadFiles.value);
  };

  const handleStart: UploadContentProps['onStart'] = file => {
    if (isNil(file.uid)) file.uid = genFileId();
    const uploadFile: UploadFile = {
      name: file.name,
      percentage: 0,
      status: 'ready',
      size: file.size,
      raw: file,
      uid: file.uid,
    };
    if (props.listType === 'picture-card' || props.listType === 'picture') {
      try {
        uploadFile.url = URL.createObjectURL(file);
      } catch (error: unknown) {
        debugWarn(SCOPE, (error as Error).message);
        props.onError(error as Error, uploadFile, uploadFiles.value);
      }
    }
    uploadFiles.value = [...uploadFiles.value, uploadFile];
    props.onChange(uploadFile, uploadFiles.value);
  };

  const handleRemove: UploadContentProps['onRemove'] = async (
    file,
  ): Promise<void> => {
    const uploadFile = file instanceof File ? getFile(file) : file;
    if (!uploadFile) throwError(SCOPE, 'file to be removed not found');

    const doRemove = (file: UploadFile) => {
      abort(file);
      const fileList = uploadFiles.value;
      fileList.splice(fileList.indexOf(file), 1);
      props.onRemove(file, fileList);
      revokeObjectURL(file);
    };

    if (props.beforeRemove) {
      const before = await props.beforeRemove(uploadFile, uploadFiles.value);
      if (before !== false) doRemove(uploadFile);
    } else {
      doRemove(uploadFile);
    }
  };

  function submit() {
    for (const { raw } of uploadFiles.value
      .filter(({ status }) => status === 'ready')) raw && uploadRef.value?.upload(raw);
  }

  watch(
    () => props.listType,
    value => {
      if (value !== 'picture-card' && value !== 'picture') {
        return;
      }

      uploadFiles.value = uploadFiles.value.map(file => {
        const { raw, url } = file;
        if (!url && raw) {
          try {
            file.url = URL.createObjectURL(raw);
          } catch (error: unknown) {
            props.onError(error as Error, file, uploadFiles.value);
          }
        }
        return file;
      });
    },
  );

  watch(
    uploadFiles,
    files => {
      for (const file of files) {
        file.uid ||= genFileId();
        file.status ||= 'success';
      }
    },
    { immediate: true, deep: true },
  );

  return {
    /** @description two-way binding ref from props `fileList` */
    uploadFiles,
    abort,
    clearFiles,
    handleError,
    handleProgress,
    handleStart,
    handleSuccess,
    handleRemove,
    submit,
  };
};
