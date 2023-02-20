import { NOOP } from '@vue/shared';
import { buildProps, mutable } from '@lemon-peel/utils';
import { uploadListTypes } from './upload';

import type { ExtractPropTypes, PropType } from 'vue';
import type { UploadFile, UploadFiles, UploadHooks } from './upload';
import type UploadList from './UploadList.vue';

export const uploadListProps = buildProps({
  files: { type: Array as PropType<UploadFiles>, default: () => mutable([]) },
  disabled: { type: Boolean, default: false },
  handlePreview: { type: Function as PropType<UploadHooks['onPreview']>, default: NOOP },
  listType: { type: String, values: uploadListTypes, default: 'text' },
} as const);

export type UploadListProps = ExtractPropTypes<typeof uploadListProps>;
export const uploadListEmits = {
  remove: (file: UploadFile) => !!file,
};

export type UploadListEmits = typeof uploadListEmits;
export type UploadListInstance = InstanceType<typeof UploadList>;
