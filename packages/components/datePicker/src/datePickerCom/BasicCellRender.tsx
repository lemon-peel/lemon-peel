import { defineComponent, inject } from 'vue';
import { ROOT_PICKER_INJECTION_KEY } from '@lemon-peel/tokens';
import { useNamespace } from '@lemon-peel/hooks';
import { basicCellProps } from '../props/basicCell';

export default defineComponent({
  name: 'LpDatePickerCell',
  props: basicCellProps,
  setup(props) {
    const ns = useNamespace('date-table-cell');
    const { slots } = inject(ROOT_PICKER_INJECTION_KEY)!;
    return () => {
      const { cell } = props;
      if (slots.default) {
        const list = slots.default(cell).filter(item => {
          return (
            item.patchFlag !== -2 && item.type.toString() !== 'Symbol(Comment)'
          );
        });
        if (list.length > 0) {
          return list;
        }
      }

      return (
        <div class={ns.b()}>
          <span class={ns.e('text')}>{cell?.text}</span>
        </div>
      );
    };
  },
});
