
import { afterEach, describe, expect, test, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { defineComponent, ref } from 'vue';
import triggerEvent from '@lemon-peel/test-utils/triggerEvent';

import { doubleWait, getTestData } from './lib';
import LpTableColumn from '../src/tableColumn';
import LpTable from '../src/table/Table.vue';

import type { ComponentPublicInstance, PropType } from 'vue';
import type { VueWrapper } from '@vue/test-utils';
import type { TableProps, RenderRowData } from '../src/table/defaults';
import type { TableColumnProps  } from '../src/tableColumn/defaults';

vi.useFakeTimers();
vi.mock('lodash-es', async () => {
  return {
    ...((await vi.importActual('lodash-es')) as Record<string, any>),
    debounce: vi.fn(fn => {
      fn.cancel = vi.fn();
      fn.flush = vi.fn();
      return fn;
    }),
  };
});

let wrapper: VueWrapper<ComponentPublicInstance>;
afterEach(() => {
  wrapper?.unmount();
  document.body.innerHTML = '';
});

describe('table column', () => {
  describe('column attributes', () => {
    const createTable = (
      props1: Partial<TableColumnProps> = {},
      props2: Partial<TableColumnProps> = {},
      props3: Partial<TableColumnProps> = {},
      props4: Partial<TableColumnProps> = {},
      opts: Record<string, any> = {},
      tableProps: Partial<TableProps> = {},
    ) => {
      return mount(
        () => (<LpTable data={getTestData()} rowKey="id" {...tableProps}>
          <LpTableColumn prop="name" {...props1} />
          <LpTableColumn prop="release" {...props2} />
          <LpTableColumn prop="director" {...props3} />
          <LpTableColumn prop="runtime" {...props4} />
        </LpTable>),
        { attachTo: 'body', ...opts },
      );
    };

    test('label', async () => {
      wrapper = createTable({ label: '啊哈哈哈' }, { label: '啊啦啦啦' });
      await doubleWait();
      const thList = wrapper
        .findAll('thead th')
        .map(node => node.text())
        .filter(Boolean);

      expect(thList).toEqual(['啊哈哈哈', '啊啦啦啦']);
      wrapper.unmount();
    });

    test('width', async () => {
      const wrapper = createTable(
        { width: '123px' },
        { width: '102px' },
        { width: '39px' },
      );
      await doubleWait();
      const ths = wrapper
        .findAll('.lp-table__header-wrapper col')
        .map(node => node.attributes('width'))
        .filter(Boolean);
      expect(ths).toContain('123');
      expect(ths).toContain('102');
      expect(ths).toContain('39');
      wrapper.unmount();
    });

    test('fixed', async () => {
      wrapper = createTable(
        { fixed: true, label: 'test1', width: '100px' },
        { fixed: 'right', label: 'test2' },
        { fixed: 'left', label: 'test3' },
      );

      await doubleWait();
      const leftFixedHeaderColumns = wrapper.findAll('.lp-table__header .lp-table-fixed-column--left');
      expect(leftFixedHeaderColumns).toHaveLength(2);
      expect(leftFixedHeaderColumns.at(0)!.text()).toBe('test1');
      expect(leftFixedHeaderColumns.at(1)!.text()).toBe('test3');
      expect(leftFixedHeaderColumns.at(1)!.classes()).toContain('is-last-column');
      expect(getComputedStyle(leftFixedHeaderColumns.at(0)!.element).left)
        .toBe('0px');
      expect(getComputedStyle(leftFixedHeaderColumns.at(1)!.element).left)
        .toBe('100px');

      const leftFixedBodyColumns = wrapper.findAll('.lp-table__body .lp-table-fixed-column--left');
      expect(leftFixedBodyColumns).toHaveLength(10);

      const rightFixedHeaderColumns = wrapper.findAll('.lp-table__header .lp-table-fixed-column--right');
      expect(rightFixedHeaderColumns).toHaveLength(1);
      expect(rightFixedHeaderColumns.at(0)!.text()).toBe('test2');
      expect(rightFixedHeaderColumns.at(0)!.classes()).toContain('is-first-column');
      expect(getComputedStyle(rightFixedHeaderColumns.at(0)!.element).right).toBe('0px');

      const rightFixedBodyColumns = wrapper.findAll('.lp-table__body .lp-table-fixed-column--right');
      expect(rightFixedBodyColumns).toHaveLength(5);
    });

    test('resizable', async () => {
      const wrapper = createTable(
        { resizable: true },
        { resizable: false },
        {},
        {},
        {},
        { border: true },
      );

      await doubleWait();
      const firstCol = wrapper.find('thead th');
      triggerEvent(firstCol.element, 'mousemove');
      triggerEvent(firstCol.element, 'mousedown');
      wrapper.unmount();
    });

    test('formatter', async () => {
      const wrapper = createTable({ formatter: (row: any) => `[${row.name}]` });

      await doubleWait();
      const cells = wrapper.findAll('.lp-table__body-wrapper tbody tr td:first-child');
      expect(cells.map(n => n.text()))
        .toEqual(getTestData().map(o => `[${o.name}]`));
      wrapper.unmount();
    });

    test('show-overflow-tooltip', async () => {
      const wrapper = createTable({ showOverflowTooltip: true });
      await doubleWait();
      expect(wrapper.findAll('.lp-tooltip').length).toEqual(5);
      wrapper.unmount();
    });

    test('show-tooltip-when-overflow', async () => {
      // old version prop name
      const wrapper = createTable({ showTooltipWhenOverflow: true });
      await doubleWait();
      expect(wrapper.findAll('.lp-tooltip').length).toEqual(5);
      wrapper.unmount();
    });

    test('align', async () => {
      const wrapper = createTable(
        { align: 'left' },
        { align: 'right' },
        { align: 'center' },
      );

      await doubleWait();
      const len = getTestData().length + 1;
      expect(wrapper.findAll('.is-left').length).toEqual(len);
      expect(wrapper.findAll('.is-right').length).toEqual(len);
      expect(wrapper.findAll('.is-center').length).toEqual(len);
      wrapper.unmount();
    });

    test('class-name', async () => {
      const wrapper = createTable(
        { className: 'column-1' },
        { className: 'column-2 column-class-a' },
        { className: 'column-class-a' },
      );

      await doubleWait();
      const len = getTestData().length + 1;
      expect(wrapper.findAll('.column-1').length).toEqual(len);
      expect(wrapper.findAll('.column-2').length).toEqual(len);
      expect(wrapper.findAll('.column-class-a').length).toEqual(len * 2);
      wrapper.unmount();
    });

    test('selectable === false & check selectAll status', async () => {
      const selected = ref<any[]>([]);
      const filterSelect = () => {
        return false;
      };
      const change = (rows: any[]) => {
        selected.value = rows;
      };
      const wrapper = mount(
        () => (<LpTable data={getTestData()} rowKey="id" onSelectonChange={change}>
          <LpTableColumn type="selection" selectable={filterSelect} />
          <LpTableColumn prop="name" label="name" />
          <LpTableColumn prop="release" label="release" />
          <LpTableColumn prop="director" label="director" />
          <LpTableColumn prop="runtime" label="runtime" />
        </LpTable>),
        { attachTo: document.body },
      );

      await doubleWait();
      expect(wrapper.find('.lp-checkbox').attributes('checked')).toBeFalsy();
      await doubleWait();
      expect(selected.value.length).toEqual(0);
      wrapper.unmount();
    });

    describe('type', () => {
      const createTable = (type: string) => {
        const selected = ref<any[]>([]);
        const change = (rows: any[]) => {
          selected.value = rows;
        };

        const wrapper = mount(
          () => (<LpTable data={getTestData()} rowKey="id" onSelectionChange={change}>
            <LpTableColumn type={type} />
            <LpTableColumn prop="name" label="name" />
            <LpTableColumn prop="release" label="release" />
            <LpTableColumn prop="director" label="director" />
            <LpTableColumn prop="runtime" label="runtime" />
          </LpTable>),
          { attachTo: document.body },
        );

        return { wrapper, selected };
      };

      describe('= selection', () => {
        test('render', async () => {
          ({ wrapper } = createTable('selection'));
          await doubleWait();
          expect(wrapper.findAll('.lp-checkbox').length)
            .toEqual(getTestData().length + 1);
        });

        test('select all', async () => {
          const res = createTable('selection');
          ({ wrapper } = res);
          await doubleWait();

          wrapper.find('.lp-checkbox').trigger('click');

          await vi.runAllTimersAsync();
          await doubleWait();

          expect(res.selected.value.length).toEqual(5);
        });

        test('select one', async () => {
          const res = createTable('selection');
          ({ wrapper } = res);

          await doubleWait();

          wrapper.findAll('.lp-checkbox').at(1)!
            .trigger('click');

          await doubleWait();

          expect(res.selected.value.length).toEqual(1);
          expect(res.selected.value[0].name)
            .toEqual(getTestData()[0].name);
        });
      });

      describe('= index', () => {
        const { wrapper } = createTable('index');

        test('render', async () => {
          await doubleWait();
          expect(
            wrapper
              .findAll('.lp-table__body-wrapper tbody tr td:first-child')
              .map(node => node.text()),
          ).toEqual(['1', '2', '3', '4', '5']);
          wrapper.unmount();
        });
      });

      describe('= expand', () => {
        test('works', async () => {
          const wrapper = mount(
            () => (
              <LpTable row-key="id" data={getTestData()}>
                <LpTableColumn type="expand" v-slots={{ default: (props: RenderRowData) => <div>{props.row.name}</div> }} />
                <LpTableColumn prop="release" label="release" />
                <LpTableColumn prop="director" label="director" />
                <LpTableColumn prop="runtime" label="runtime" />
              </LpTable>
            ),
            { attachTo: document.body },
          );
          await doubleWait();
          expect(wrapper.findAll('td.lp-table__expand-column').length).toEqual(5);
          wrapper.unmount();
        });
      });
    });

    describe('sortable', () => {
      test('render', async () => {
        const wrapper = createTable({}, {}, {}, { sortable: true });
        await doubleWait();
        expect(wrapper.findAll('.caret-wrapper').length).toEqual(1);
        wrapper.unmount();
      });

      test('sortable orders', async () => {
        const wrapper = createTable({}, {}, {}, { sortable: true, sortOrders: ['descending', 'ascending'] });

        await doubleWait();
        const elm = wrapper.find('.caret-wrapper');
        elm.trigger('click');

        await doubleWait();
        const lastCells = wrapper.findAll(
          '.lp-table__body-wrapper tbody tr td:last-child',
        );
        expect(lastCells.map(node => node.text()))
          .toEqual(['100', '95', '92', '92', '80']);
        wrapper.unmount();
      });

      test('sortable method', async () => {
        const sortMethod = (a: any, b: any) => {
          // sort method should return number
          if (a.runtime < b.runtime) {
            return 1;
          }
          if (a.runtime > b.runtime) {
            return -1;
          }
          return 0;
        };

        const wrapper = createTable({ sortable: true, sortMethod });

        await doubleWait();
        const elm = wrapper.find('.caret-wrapper');
        elm.trigger('click');

        await doubleWait();
        const lastCells = wrapper.findAll(
          '.lp-table__body-wrapper tbody tr td:last-child',
        );
        expect(lastCells.map(node => node.text()))
          .toEqual(['100', '95', '92', '92', '80']);
        wrapper.unmount();
      });

      test('sortable by method', async () => {
        const sortBy = (a: any) => {
          return -a.runtime;
        };

        const wrapper = createTable({ sortable: true, sortBy: sortBy as any });

        await doubleWait();
        const elm = wrapper.find('.caret-wrapper');
        elm.trigger('click');

        await doubleWait();
        const lastCells = wrapper.findAll(
          '.lp-table__body-wrapper tbody tr td:last-child',
        );
        expect(lastCells.map(node => node.text()))
          .toEqual(['100', '95', '92', '92', '80']);
        wrapper.unmount();
      });

      test('sortable by property', async () => {
        const wrapper = createTable({ sortable: true, sortBy: 'runtime' });

        await doubleWait();
        const elm = wrapper.find('.caret-wrapper');
        elm.trigger('click');

        await doubleWait();
        const lastCells = wrapper.findAll('.lp-table__body-wrapper tbody tr td:last-child');
        expect(lastCells.map(node => node.text()))
          .toEqual(['80', '92', '92', '95', '100']);
        wrapper.unmount();
      });
    });

    describe('click sortable column', () => {
      const wrapper = createTable({}, {}, {}, { sortable: true });

      test('ascending', async () => {
        const elm = wrapper.find('.caret-wrapper');

        elm.trigger('click');
        await doubleWait();
        const lastCells = wrapper.findAll('.lp-table__body-wrapper tbody tr td:last-child');
        expect(lastCells.map(node => node.text()))
          .toEqual(['80', '92', '92', '95', '100']);
      });

      test('descending', async () => {
        const elm = wrapper.find('.caret-wrapper');

        elm.trigger('click');
        await doubleWait();
        const lastCells = wrapper.findAll('.lp-table__body-wrapper tbody tr td:last-child');
        expect(lastCells.map(node => node.text()))
          .toEqual(['100', '95', '92', '92', '80']);
        wrapper.unmount();
      });
    });

    test('change column configuration', async () => {
      const cols = ref(['a', 'v', 'b']);
      const data = ref([{ a: 1, v: 2, b: 3 }]);
      const wrapper = mount(
        () => (
          <LpTable data={data.value}>
              {cols.value.map(item =>
                (<LpTableColumn prop={item} label={item} key={item} />))}
          </LpTable>
        ),
        { attachTo: document.body },
      );

      await doubleWait();
      expect(wrapper.findAll('.lp-table__header-wrapper th').length).toEqual(3);

      cols.value.push('b');
      await doubleWait();
      expect(wrapper.findAll('.lp-table__header-wrapper th').length).toEqual(4);
      cols.value.push('b');
      await doubleWait();
      expect(wrapper.findAll('.lp-table__header-wrapper th').length).toEqual(5);
      cols.value.pop();
      await doubleWait();
      expect(wrapper.findAll('.lp-table__header-wrapper th').length).toEqual(4);
      cols.value.pop();
      await doubleWait();
      expect(wrapper.findAll('.lp-table__header-wrapper th').length).toEqual(3);
    });
  });

  describe('multi level column', () => {
    test('should works', async () => {
      wrapper = mount(() => (
        <LpTable data={[]}>
          <LpTableColumn prop="name" />
          <LpTableColumn prop="group" label="group">
            <LpTableColumn prop="release" />
            <LpTableColumn prop="director" />
          </LpTableColumn>
          <LpTableColumn prop="runtime" />
        </LpTable>
      ), { attachTo: document.body });

      await doubleWait();
      const trs = wrapper.findAll('.lp-table__header tr');
      expect(trs.length).toEqual(2);
      const firstRowHeader = trs[0].findAll('th .cell').length;
      const secondRowHeader = trs[1].findAll('th .cell').length;
      expect(firstRowHeader).toEqual(3);
      expect(secondRowHeader).toEqual(2);

      expect(trs[0].find('th:first-child').attributes('rowspan')).toEqual('2');
      expect(trs[0].find('th:nth-child(2)').attributes('colspan')).toEqual('2');
    });

    test('should works', async () => {
      wrapper = mount(() => (
        <LpTable data={[]}>
          <LpTableColumn prop="name" />
          <LpTableColumn label="group">
            <LpTableColumn label="group's group">
              <LpTableColumn prop="release" />
              <LpTableColumn prop="runtime"/>
            </LpTableColumn>
            <LpTableColumn prop="director" />
          </LpTableColumn>
          <LpTableColumn prop="runtime"/>
        </LpTable>
      ), { attachTo: document.body });

      await doubleWait();
      const trs = wrapper.findAll('.lp-table__header tr');
      expect(trs.length).toEqual(3);
      const firstRowHeader = trs[0].findAll('th .cell').length;
      const secondRowHeader = trs[1].findAll('th .cell').length;
      const thirdRowHeader = trs[2].findAll('th .cell').length;
      expect(firstRowHeader).toEqual(3);
      expect(secondRowHeader).toEqual(2);
      expect(thirdRowHeader).toEqual(2);

      expect(trs[0].find('th:first-child').attributes('rowspan')).toEqual('3');
      expect(trs[0].find('th:nth-child(2)').attributes('colspan')).toEqual('3');
      expect(trs[1].find('th:first-child').attributes('colspan')).toEqual('2');
      expect(trs[1].find('th:nth-child(2)').attributes('rowspan')).toEqual('2');
    });

    test('should work in one column', async () => {
      wrapper = mount(() => (
        <LpTable data={[]}>
          <LpTableColumn label="group">
            <LpTableColumn prop="release" />
          </LpTableColumn>
        </LpTable>
      ), { attachTo: document.body });

      await doubleWait();
      const trs = wrapper.findAll('.lp-table__header tr');
      expect(trs.length).toEqual(2);
      const firstRowLength = trs[0].findAll('th .cell').length;
      const secondRowLength = trs[1].findAll('th .cell').length;
      expect(firstRowLength).toEqual(1);
      expect(secondRowLength).toEqual(1);

      expect(trs[0].find('th:first-child').attributes('rowspan')).toEqual('1');
      expect(trs[0].find('th:first-child').attributes('colspan')).toEqual('1');
    });

    test('should work with fixed', async () => {
      wrapper = mount(() => (
        <LpTable data={getTestData()}>
          <LpTableColumn prop="name" />
          <LpTableColumn label="group" fixed="left">
            <LpTableColumn label="group's group">
              <LpTableColumn prop="runtime" width="100" fixed="right"/>
              <LpTableColumn prop="director" width="100" fixed="right"/>
            </LpTableColumn>
            <LpTableColumn prop="director"/>
          </LpTableColumn>
          <LpTableColumn prop="director"/>
          <LpTableColumn prop="runtime"/>
          <LpTableColumn label="group2" fixed="right">
            <LpTableColumn prop="release" width="100" fixed="left"/>
            <LpTableColumn prop="director" width="50"/>
          </LpTableColumn>
          <LpTableColumn prop="runtime"/>
        </LpTable>
      ), { attachTo: document.body });

      await doubleWait();
      await doubleWait();

      const lfhcolumns = wrapper
        .findAll('.lp-table__header tr')
        .map(item => item.findAll('.lp-table-fixed-column--left'));
      expect(lfhcolumns.at(0)!.at(0)!.classes()).toContain('is-last-column');
      expect(lfhcolumns.at(1)!.at(1)!.classes()).toContain('is-last-column');
      expect(getComputedStyle(lfhcolumns.at(1)!.at(1)!.element).left).toBe('200px');
      expect(getComputedStyle(lfhcolumns.at(2)!.at(1)!.element).left).toBe('100px');

      const lfbcolumns = wrapper.findAll('.lp-table__body .lp-table-fixed-column--left');
      expect(lfbcolumns).toHaveLength(15);

      const rfhcolumns = wrapper
        .findAll('.lp-table__header tr')
        .map(item => item.findAll('.lp-table-fixed-column--right'));
      expect(rfhcolumns.at(0)!.at(0)!.classes()).toContain('is-first-column');
      expect(rfhcolumns.at(1)!.at(0)!.classes()).toContain('is-first-column');
      expect(getComputedStyle(rfhcolumns.at(1)!.at(0)!.element).right).toBe('50px');

      const rfbcolumns = wrapper.findAll('.lp-table__body .lp-table-fixed-column--right');
      expect(rfbcolumns).toHaveLength(10);
    });

    test('lp-table-column should callback itself', async () => {
      const data = ref([
        { date: '2016-05-03', name: 'Tom', address: 'No. 189, Grove St, Los Angeles' },
        { date: '2016-05-02', name: 'Tom', address: 'No. 189, Grove St, Los Angeles' },
        { date: '2016-05-04', name: 'Tom', address: 'No. 189, Grove St, Los Angeles' },
        { date: '2016-05-01', name: 'Tom', address: 'No. 189, Grove St, Los Angeles' },
      ]);
      type LocalColumn = {
        label: string;
        prop: string;
        children?: LocalColumn[];
      };
      const column = ref<LocalColumn[]>([
        { label: '日期', prop: 'date' },
        {
          label: '用户',
          prop: 'user',
          children: [
            { label: '姓名', prop: 'name' },
            { label: '地址', prop: 'address' },
          ],
        },
      ]);

      const TableColumn = defineComponent({
        name: 'TableColumn',
        props: {
          item: { type: Object as PropType<LocalColumn>, required: true },
        },
        setup(props) {
          return () => {
            const { item } = props;
            return (<LpTableColumn prop={item.prop} label={item.label}>
              {item.children
                ? item.children.map(cur => (<TableColumn key={cur.prop} item={cur}></TableColumn>))
                : null }
            </LpTableColumn>);
          };
        },
      });

      const wrapper = mount(() => (
        <LpTable data={data.value}>
          {column.value.map(cur => (<TableColumn key={cur.prop} item={cur}></TableColumn>))}
        </LpTable>
      ), { attachTo: document.body });

      await doubleWait();
      expect(wrapper.find('.lp-table__header-wrapper').text()).toMatch('姓名');
      expect(wrapper.find('.lp-table__header-wrapper').text()).toMatch('地址');
    });

    test('should not rendered other components in hidden-columns', async () => {
      const OrtherCom = defineComponent({
        template: `<div class="other-component"></div>`,
      });

      const wrapper = mount(() => (
        <LpTable data={getTestData()}>
          <LpTableColumn prop="name">
            <OrtherCom></OrtherCom>
          </LpTableColumn>
        </LpTable>
      ), { attachTo: document.body });

      await doubleWait();
      expect(wrapper.find('.hidden-columns').find('.other-component').exists())
        .toBeFalsy();
    });

    test('should not rendered text in hidden-columns', async () => {
      const TableColumn = defineComponent({
        name: 'TableColumn',
        setup(props, ctx) {
          return () => (<LpTableColumn v-slots={{ default: (scope: any) => ctx.slots.default?.(scope) }} />);
        },
      });

      const wrapper = mount(() => (
        <LpTable data={getTestData()}>
          <TableColumn><div>Hello World</div></TableColumn>
        </LpTable>
      ), { attachTo: document.body });

      await doubleWait();
      expect(wrapper.find('.hidden-columns').text().trim()).not.toContain(
        'Hello World',
      );
    });
  });

  describe('dynamic column attribtes', () => {
    test('label', async () => {
      const label = ref('name');
      wrapper = mount(() => (
        <LpTable data={getTestData()}>
          <LpTableColumn prop="name" label={label.value} />
          <LpTableColumn prop="release" />
          <LpTableColumn prop="director" />
          <LpTableColumn prop="runtime" />
        </LpTable>
      ), { attachTo: document.body });

      await doubleWait();
      expect(wrapper.find('.lp-table__header th .cell').text())
        .toEqual('name');

      label.value = 'NAME';
      await doubleWait();
      expect(wrapper.find('.lp-table__header th .cell').text())
        .toEqual('NAME');
    });

    test('align', async () => {
      const align = ref('left');
      wrapper = mount(() => (
        <LpTable data={getTestData()}>
          <LpTableColumn prop="name" align={align.value} />
          <LpTableColumn prop="release" />
        </LpTable>
      ), { attachTo: document.body });

      await doubleWait();
      expect(wrapper.findAll('.lp-table__body td.is-right').length).toEqual(0);

      align.value = 'right';
      await doubleWait();
      expect(wrapper.findAll('.lp-table__body td.is-right').length > 0)
        .toBeTruthy();
    });

    test('header-align', async () => {
      const headerAlign: any = ref('left');
      const align = ref('left');
      wrapper = mount(() => (
        <LpTable data={getTestData()}>
          <LpTableColumn prop="name" align={align.value} header-align={headerAlign.value} />
        </LpTable>
      ), { attachTo: document.body });

      await doubleWait();
      expect(wrapper.findAll('.lp-table__header th.is-left').length).toBeGreaterThanOrEqual(0);
      expect(wrapper.findAll('.lp-table__header th.is-center').length).toEqual(0);
      expect(wrapper.findAll('.lp-table__header th.is-right').length).toEqual(0);

      headerAlign.value = 'right';
      await doubleWait();
      expect(wrapper.findAll('.lp-table__header th.is-left').length).toEqual(0);
      expect(wrapper.findAll('.lp-table__header th.is-center').length).toEqual(0);
      expect(wrapper.findAll('.lp-table__header th.is-right').length).toBeGreaterThanOrEqual(0);

      headerAlign.value = 'center';
      await doubleWait();
      expect(wrapper.findAll('.lp-table__header th.is-left').length).toEqual(0);
      expect(wrapper.findAll('.lp-table__header th.is-center').length).toBeGreaterThanOrEqual(0);
      expect(wrapper.findAll('.lp-table__header th.is-right').length).toEqual(0);

      align.value = 'right';
      headerAlign.value = null;
      await doubleWait();
      expect(wrapper.findAll('.lp-table__header th.is-left').length).toEqual(0);
      expect(wrapper.findAll('.lp-table__header th.is-center').length).toEqual(0);
      expect(wrapper.findAll('.lp-table__header th.is-right').length).toBeGreaterThanOrEqual(0);
    });

    test('width', async () => {
      wrapper = mount(() => (
        <LpTable data={getTestData()} fit={false}>
          <LpTableColumn prop="name" width={199} />
        </LpTable>
      ), { attachTo: document.body });

      await doubleWait();
      const col = wrapper.find('.lp-table__body col');
      expect(col.attributes('width'))
        .toEqual('199');
    });

    test('min-width', async () => {
      const wrapper = mount(() => (
        <LpTable data={getTestData()} fit={false}>
          <LpTableColumn prop="name" minWidth={199} />
        </LpTable>
      ), { attachTo: document.body });

      await doubleWait();
      expect(wrapper.find('.lp-table__body col').attributes('width'))
        .toEqual('199');
    });

    test('fixed', async () => {
      const fixed = ref(false);
      wrapper = mount(() => (
        <LpTable data={getTestData()} fit={false}>
          <LpTableColumn prop="name" fixed={fixed.value} />
          <LpTableColumn prop="release" />
          <LpTableColumn prop="director" />
          <LpTableColumn prop="runtime" />
        </LpTable>
      ), { attachTo: document.body });

      await doubleWait();
      expect(wrapper.find('.lp-table-fixed-column--left').exists()).toBeFalsy();

      fixed.value = true;
      wrapper.unmount();
      wrapper = mount(() => (
        <LpTable data={getTestData()} fit={false}>
          <LpTableColumn prop="name" fixed={fixed.value} />
          <LpTableColumn prop="release" />
          <LpTableColumn prop="director" />
          <LpTableColumn prop="runtime" />
        </LpTable>
      ), { attachTo: document.body });

      await doubleWait();
      expect(wrapper.find('.lp-table-fixed-column--left').exists()).toBeTruthy();
    });

    test('prop', async () => {
      const prop = ref('name');
      wrapper = mount(
        () => (
          <LpTable data={getTestData()} rowKey="id">
            <LpTableColumn prop={prop.value} />
            <LpTableColumn prop="release" />
            <LpTableColumn prop="director" />
            <LpTableColumn prop="runtime" />
          </LpTable>
        ),
        { attachTo: document.body },
      );

      await doubleWait();
      let firstColumnContent = wrapper.find('.lp-table__body td .cell').text();
      let secondColumnContent = wrapper
        .find('.lp-table__body td:nth-child(2) .cell')
        .text();
      expect(firstColumnContent).not.toEqual(secondColumnContent);
      prop.value = 'release';
      await doubleWait();
      firstColumnContent = wrapper.find('.lp-table__body td .cell').text();
      secondColumnContent = wrapper
        .find('.lp-table__body td:nth-child(2) .cell')
        .text();
      expect(firstColumnContent).toEqual(secondColumnContent);
    });
  });

  describe('tree table', () => {
    const getTableData = () => {
      return [
        {
          id: 1,
          date: '2016-05-02',
          name: 'Wangxiaohu',
          address: '1518 Jinshajiang Road, Putuo District, Shanghai',
          index: 1,
        },
        {
          id: 2,
          date: '2016-05-04',
          name: 'Wangxiaohu',
          address: '1518 Jinshajiang Road, Putuo District, Shanghai',
          index: 2,
        },
        {
          id: 3,
          date: '2016-05-01',
          name: 'Wangxiaohu',
          address: '1518 Jinshajiang Road, Putuo District, Shanghai',
          index: 3,
          children: [
            {
              id: 31,
              date: '2016-05-01',
              name: 'Wangxiaohu',
              address: '1518 Jinshajiang Road, Putuo District, Shanghai',
              index: 4,
              children: [
                {
                  id: 311,
                  date: '2016-05-01',
                  name: 'Wangxiaohu',
                  address: '1518 Jinshajiang Road, Putuo District, Shanghai',
                  index: 5,
                },
                {
                  id: 312,
                  date: '2016-05-01',
                  name: 'Wangxiaohu',
                  address: '1518 Jinshajiang Road, Putuo District, Shanghai',
                  index: 6,
                },
                {
                  id: 313,
                  date: '2016-05-01',
                  name: 'Wangxiaohu',
                  address: '1518 Jinshajiang Road, Putuo District, Shanghai',
                  index: 7,
                  disabled: true,
                },
              ],
            },
            {
              id: 32,
              date: '2016-05-01',
              name: 'Wangxiaohu',
              address: '1518 Jinshajiang Road, Putuo District, Shanghai',
              index: 8,
            },
          ],
        },
        {
          id: 4,
          date: '2016-05-03',
          name: 'Wangxiaohu',
          address: '1518 Jinshajiang Road, Putuo District, Shanghai',
          index: 9,
        },
      ];
    };

    const createTable = function (methods: Record<string, any>) {
      return mount(() => (
        <LpTable
          ref="table"
          data={getTableData()}
          rowKey="id"
          border
          defaultExpandAll
          treeProps={{ children: 'children', hasChildren: 'hasChildren' }}
        >
          <LpTableColumn type="index"></LpTableColumn>
          <LpTableColumn type="selection" sortable={methods.sortable}></LpTableColumn>
          <LpTableColumn prop="id" label="id"></LpTableColumn>
          <LpTableColumn prop="date" label="Date" sortable width="180">
          </LpTableColumn>
          <LpTableColumn prop="name" label="Name" sortable width="180">
          </LpTableColumn>
          <LpTableColumn prop="address" label="Address"></LpTableColumn>
        </LpTable>
      ), { attachTo: document.body });
    };

    test('selectable index parameter should be correct', async () => {
      const result: boolean[] = [];
      wrapper = createTable({
        selectable(row: any, index: number) {
          result.push(row.index - 1 === index);
          return !row.disabled;
        },
      });
      await doubleWait();
      const table = wrapper.findComponent(LpTable);
      table.vm.toggleAllSelection();
      expect(result.every(Boolean)).toBeTruthy();
      wrapper.unmount();
    });
  });
});
