
import { defineComponent, h } from 'vue';
import { useNamespace } from '@lemon-peel/hooks';
import { hColgroup } from '../HHelper';
import useStyle from './styleHelper';

import type { PropType } from 'vue';
import type { DefaultRow, Sort, SummaryMethod } from '../table/defaults';
import type { Store } from '../store';

export interface TableFooter<T> {
  fixed: string;
  store: Store<T>;
  summaryMethod: SummaryMethod<T>;
  sumText: string;
  border: boolean;
  defaultSort: Sort;
}

export default defineComponent({
  name: 'LpTableFooter',

  props: {
    fixed: {
      type: String,
      default: '',
    },
    store: {
      required: true,
      type: Object as PropType<TableFooter<DefaultRow>['store']>,
    },
    summaryMethod: Function as PropType<TableFooter<DefaultRow>['summaryMethod']>,
    sumText: String,
    border: Boolean,
    defaultSort: {
      type: Object as PropType<TableFooter<DefaultRow>['defaultSort']>,
      default: () => {
        return {
          prop: '',
          order: '',
        };
      },
    },
  },
  setup(props) {
    const { getCellClasses, getCellStyles, columns } = useStyle(
      props as TableFooter<DefaultRow>,
    );
    const ns = useNamespace('table');
    return {
      ns,
      getCellClasses,
      getCellStyles,
      columns,
    };
  },
  render() {
    const {
      columns,
      getCellStyles,
      getCellClasses,
      summaryMethod,
      sumText,
      ns,
    } = this;
    const data = this.store.states.data.value;
    let sums = [];
    if (summaryMethod) {
      sums = summaryMethod({
        columns,
        data,
      });
    } else {
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = sumText;
          return;
        }
        const values = data.map(item => Number(item[column.property]));
        const precisions = [];
        let notNumber = true;
        values.forEach(value => {
          if (!Number.isNaN(+value)) {
            notNumber = false;
            const decimal = `${value}`.split('.')[1];
            precisions.push(decimal ? decimal.length : 0);
          }
        });
        const precision = Math.max.apply(null, precisions);
        sums[index] = notNumber ? '' : values.reduce((prev, curr) => {
          const value = Number(curr);
          return Number.isNaN(+value) ? prev : Number.parseFloat(
            (prev + curr).toFixed(Math.min(precision, 20)),
          );
        }, 0);
      });
    }
    return h(
      'table',
      {
        class: ns.e('footer'),
        cellspacing: '0',
        cellpadding: '0',
        border: '0',
      },
      [
        hColgroup({
          columns,
        }),
        h('tbody', [
          h('tr', {},
            columns.map((column, cellIndex) =>
              h(
                'td',
                {
                  key: cellIndex,
                  colspan: column.colSpan,
                  rowspan: column.rowSpan,
                  class: getCellClasses(columns, cellIndex),
                  style: getCellStyles(column, cellIndex),
                },
                [
                  h(
                    'div',
                    {
                      class: ['cell', column.labelClassName],
                    },
                    [sums[cellIndex]],
                  ),
                ],
              ),
            ),
          ),
        ]),
      ],
    );
  },
});
