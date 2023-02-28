import { buildProps, isNumber, mutable } from '@lemon-peel/utils';

import type { Component, ExtractPropTypes, PropType } from 'vue';
import type ImageViewer from './ImageViewer.vue';

export type ImageViewerAction =
  | 'zoomIn'
  | 'zoomOut'
  | 'clockwise'
  | 'anticlockwise';

export const imageViewerProps = buildProps({
  urlList: { type: Array as PropType<string[]>, default: () => mutable([] as const) },
  zIndex: { type: Number },
  initialIndex: { type: Number, default: 0 },
  infinite: { type: Boolean, default: true },
  hideOnClickModal: { type: Boolean, default: false },
  teleported: { type: Boolean, default: false },
  closeOnPressEscape: { type: Boolean, default: true },
} as const);
export type ImageViewerProps = ExtractPropTypes<typeof imageViewerProps>;

export const imageViewerEmits = {
  close: () => true,
  switch: (index: number) => isNumber(index),
};
export type ImageViewerEmits = typeof imageViewerEmits;

export interface ImageViewerMode {
  name: string;
  icon: Component;
}

export type ImageViewerInstance = InstanceType<typeof ImageViewer>;
