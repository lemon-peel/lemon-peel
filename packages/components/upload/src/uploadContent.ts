import { NOOP } from '@vue/shared';
import { buildProps } from '@lemon-peel/utils';
import { uploadBaseProps } from './upload';

import type { ExtractPropTypes, PropType } from 'vue';
import type { UploadFile, UploadHooks, UploadProgressEvent, UploadRawFile } from './upload';
import type UploadContent from './UploadContent.vue';
import type { UploadAjaxError } from './ajax';

export const uploadContentProps = buildProps({
  ...uploadBaseProps,
  beforeUpload: {
    type: Function as PropType<UploadHooks['beforeUpload']>,
    default: NOOP,
  },
  onRemove: {
    type: Function as PropType<(file: UploadFile | UploadRawFile, rawFile?: UploadRawFile) => void>,
    default: NOOP,
  },
  onStart: {
    type: Function as PropType<(rawFile: UploadRawFile) => void>,
    default: NOOP,
  },
  onSuccess: {
    type: Function as PropType<(response: any, rawFile: UploadRawFile) => unknown>,
    default: NOOP,
  },
  onProgress: {
    type: Function as PropType<(evt: UploadProgressEvent, rawFile: UploadRawFile) => void>,
    default: NOOP,
  },
  onError: {
    type: Function as PropType<(err: UploadAjaxError, rawFile: UploadRawFile) => void>,
    default: NOOP,
  },
  onExceed: {
    type: Function as PropType<UploadHooks['onExceed']>,
    default: NOOP,
  },
} as const);

export type UploadContentProps = ExtractPropTypes<typeof uploadContentProps>;

export type UploadContentInstance = InstanceType<typeof UploadContent>;
