import { computed, defineComponent } from 'vue';
import { buildProps, isString } from '@lemon-peel/utils';
import { useNamespace } from '@lemon-peel/hooks';
import type { CSSProperties, ExtractPropTypes, PropType } from 'vue';

export const sliderMarkerProps = buildProps({
  mark: {
    type: [String, Object] as PropType<string | { style: CSSProperties, label: any }>,
    default: undefined,
  },
} as const);

export type SliderMarkerProps = ExtractPropTypes<typeof sliderMarkerProps>;

export default defineComponent({
  name: 'LpSliderMarker',
  props: sliderMarkerProps,
  setup(props) {
    const ns = useNamespace('slider');
    const label = computed(() => {
      return isString(props.mark) ? props.mark : props.mark!.label;
    });
    const style = computed(() =>
      isString(props.mark) ? undefined : props.mark!.style,
    );

    return () => <div class={ns.e('marks-text')} style={style.value}>
      {label.value}
    </div>;
  },
});
