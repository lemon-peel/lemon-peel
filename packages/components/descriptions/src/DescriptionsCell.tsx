import { defineComponent, inject } from 'vue';
import { addUnit, buildProps, getNormalizedProps } from '@lemon-peel/utils';
import { useNamespace } from '@lemon-peel/hooks/src';
import { descriptionsKey } from './token';

import type { VNode } from 'vue';
import type { IDescriptionsInject } from './descriptions.type';
import type { DescriptionsItemProps } from './descriptionItem';

const descriptionsCellProps = buildProps({
  cell: { type: Object },
  tag: { type: String, default: 'td' },
  type: { type: String },
});

export default defineComponent({
  name: 'LpDescriptionsCell',
  props: descriptionsCellProps,
  setup(props) {
    const { border, direction } = inject(descriptionsKey, {} as IDescriptionsInject)!;
    const ns = useNamespace('descriptions');

    return () =>  {
      const item = getNormalizedProps(props.cell as VNode) as DescriptionsItemProps;
      const { className, labelClassName, span } = item;
      const isVertical = direction === 'vertical';
      const label = props.cell?.children?.label?.() || item.label;
      const content = props.cell?.children?.default?.();
      const align = item.align ? `is-${item.align}` : '';
      const labelAlign = item.labelAlign ? `is-${item.labelAlign}` : '' || align;
      const style = {
        width: addUnit(item.width),
        minWidth: addUnit(item.minWidth),
      };

      return props.type === 'label'
        ? <props.tag
          class={[
            ns.e('cell'),
            ns.e('label'),
            ns.is('bordered-label', border),
            ns.is('vertical-label', isVertical),
            labelAlign,
            labelClassName,
          ]}
          style={style}
          colSpan={isVertical ? span : 1}>
            {label}
          </props.tag>
        : props.type === 'content'
          ? <props.tag
              class={[
                ns.e('cell'),
                ns.e('content'),
                ns.is('bordered-content', border),
                ns.is('vertical-content', isVertical),
                align,
                className,
              ]}
              style={style}
              colSpan={isVertical ? span : span * 2 - 1}>
                {content}
            </props.tag>
          : <td
            style={style}
            class={[ns.e('cell'), align]}
            colSpan={span}>
              <span class={[ns.e('label'), labelClassName]}>label</span>
              <span class={[ns.e('content'), className]}>content</span>
            </td>;
    };
  },
});
