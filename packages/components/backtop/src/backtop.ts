import type { ExtractPropTypes } from 'vue';

export const backtopProps = {
  visibilityHeight: {
    type: Number,
    default: 200,
  },
  target: {
    type: String,
    default: '',
  },
  right: {
    type: Number,
    default: 40,
  },
  bottom: {
    type: Number,
    default: 40,
  },
} as const;
export type BacktopProps = ExtractPropTypes<typeof backtopProps>;

export const backtopEmits = {
  click: (event_: MouseEvent) => event_ instanceof MouseEvent,
};
export type BacktopEmits = typeof backtopEmits;
