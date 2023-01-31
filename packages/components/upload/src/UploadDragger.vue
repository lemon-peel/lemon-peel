<template>
  <div
    :class="[ns.b('dragger'), ns.is('dragover', dragover)]"
    @drop.prevent="onDrop"
    @dragover.prevent="onDragover"
    @dragleave.prevent="dragover = false"
  >
    <slot />
  </div>
</template>
<script lang="ts" setup>
import { inject, ref } from 'vue';
import { useNamespace } from '@lemon-peel/hooks';

import { uploadContextKey } from '@lemon-peel/tokens';
import { throwError } from '@lemon-peel/utils/error';

import { uploadDraggerEmits, uploadDraggerProps } from './uploadDragger';

const COMPONENT_NAME = 'LpUploadDrag';

defineOptions({
  name: COMPONENT_NAME,
});

const props = defineProps(uploadDraggerProps);
const emit = defineEmits(uploadDraggerEmits);

const uploaderContext = inject(uploadContextKey);
if (!uploaderContext) {
  throwError(
    COMPONENT_NAME,
    'usage: <lp-upload><lp-upload-dragger /></lp-upload>',
  );
}

const ns = useNamespace('upload');
const dragover = ref(false);

const onDrop = (e: DragEvent) => {
  if (props.disabled) return;
  dragover.value = false;

  const files = [...e.dataTransfer!.files];
  const accept = uploaderContext.accept.value;
  if (!accept) {
    emit('file', files);
    return;
  }

  const filesFiltered = files.filter(file => {
    const { type, name } = file;
    const extension = name.includes('.') ? `.${name.split('.').pop()}` : '';
    const baseType = type.replace(/\/.*$/, '');
    return accept
      .split(',')
      .map(i => i.trim())
      .filter(Boolean)
      .some(acceptedType => {
        if (acceptedType.startsWith('.')) {
          return extension === acceptedType;
        }
        if (/\/\*$/.test(acceptedType)) {
          return baseType === acceptedType.replace(/\/\*$/, '');
        }
        if (/^[^/]+\/[^/]+$/.test(acceptedType)) {
          return type === acceptedType;
        }
        return false;
      });
  });

  emit('file', filesFiltered);
};

const onDragover = () => {
  if (!props.disabled) dragover.value = true;
};
</script>
