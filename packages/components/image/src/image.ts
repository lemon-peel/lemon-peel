import { buildProps, isNumber, mutable } from '@lemon-peel/utils';

import type { ExtractPropTypes, PropType } from 'vue';

export const imageProps = buildProps({
  hideOnClickModal: { type: Boolean, default: false },
  src: { type: String, default: '' },
  fit: { type: String, values: ['', 'contain', 'cover', 'fill', 'none', 'scale-down'], default: '' },
  loading: { type: String, values: ['eager', 'lazy', undefined] },
  lazy: { type: Boolean, default: false },
  scrollContainer: { type: [String, Object] as PropType<string | HTMLElement | undefined> },
  previewSrcList: { type: Array as PropType<string[]>, default: () => mutable([] as const) },
  previewTeleported: { type: Boolean, default: false },
  zIndex: { type: Number },
  initialIndex: { type: Number, default: 0 },
  infinite: { type: Boolean, default: true },
  closeOnPressEscape: { type: Boolean, default: true },
});

export type ImageProps = ExtractPropTypes<typeof imageProps>;

export const imageEmits = {
  load: (evt: Event) => evt instanceof Event,
  error: (evt: Event) => evt instanceof Event,
  switch: (val: number) => isNumber(val),
  close: () => true,
  show: () => true,
};

export type ImageEmits = typeof imageEmits;
