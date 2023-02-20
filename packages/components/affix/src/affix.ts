import { buildProps, isBoolean, isNumber } from '@lemon-peel/utils';
import { CHANGE_EVENT } from '@lemon-peel/constants';
import type { ExtractPropTypes, PropType } from 'vue';
import type { ZIndexProperty } from 'csstype';

export const affixProps = buildProps({
  /**
   * @description affix element zIndex value
   * */
  zIndex: { type: [Number, String] as PropType<ZIndexProperty>, default: 100 },
  /**
   * @description target container. (CSS selector)
   */
  target: { type: String, default: '' },
  /**
   * @description offset distance
   * */
  offset: { type: Number, default: 0 },
  /**
   * @description position of affix
   * */
  position: {
    type: String,
    values: ['top', 'bottom'],
    default: 'top',
  },
} as const);

export type AffixProps = Readonly<ExtractPropTypes<typeof affixProps>>;

export const affixEmits = {
  scroll: ({ scrollTop, fixed }: { scrollTop: number, fixed: boolean }) =>
    isNumber(scrollTop) && isBoolean(fixed),
  [CHANGE_EVENT]: (fixed: boolean) => isBoolean(fixed),
};

export type AffixEmits = typeof affixEmits;
