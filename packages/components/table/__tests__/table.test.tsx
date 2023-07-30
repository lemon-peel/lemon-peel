import { nextTick, ref } from 'vue';
import { afterEach, beforeEach, describe, expect, vi, test } from 'vitest';
import LpCheckbox from '@lemon-peel/components/checkbox';
import triggerEvent from '@lemon-peel/test-utils/triggerEvent';
import { rAF } from '@lemon-peel/test-utils/tick';
import { mount } from '@vue/test-utils';
import { upperFirst } from 'lodash-es';

import { doubleWait, getTestData } from './lib';
import LpTable from '../src/table/Table.vue';
import LpTableColumn from '../src/tableColumn';

import type { VueWrapper } from '@vue/test-utils';
import type { ComponentPublicInstance } from 'vue';
import type { RowStyleGenerator, SummaryMethod, TableProps, TableLoadChildren } from '../src/table/defaults';

const { CheckboxGroup: LpCheckboxGroup } = LpCheckbox;

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

describe('Table', () => {
  describe('rendering data is correct', () => {
    const testData = getTestData();
    const wrapper = mount(() => (
      <LpTable data={testData}>
        <LpTableColumn prop="id" />
        <LpTableColumn prop="name" label="片名" />
        <LpTableColumn prop="release" label="发行日期" />
        <LpTableColumn prop="director" label="导演" />
        <LpTableColumn prop="runtime" label="时长（分）" />
      </LpTable>
    ), { attachTo: 'body' });

    test('head', async () => {
      await doubleWait();
      const ths = wrapper.findAll('thead th');
      expect(ths.map(node => node.text()).filter(Boolean)).toEqual([
        '片名',
        '发行日期',
        '导演',
        '时长（分）',
      ]);
    });

    test('row length', () => {
      expect(
        wrapper.findAll('.lp-table__body-wrapper tbody tr').length,
      ).toEqual(getTestData().length);
    });

    test('row data', () => {
      const cells = wrapper.findAll('td .cell').map(node => node.text());
      const testDataArr = getTestData().flatMap(cur => {
        return Object.values(cur).map(String);
      });
      expect(cells).toEqual(testDataArr);
      wrapper.unmount();
    });
  });

  test('custom template', async () => {
    const tableData = [
      { checkList: [] },
      { checkList: ['A'] },
      { checkList: ['A', 'B'] },
    ];

    const renderColumn = ({ row }: { row: { checkList: string[] } }) => {
      return <LpCheckboxGroup v-model:value={row.checkList}>
        <LpCheckbox value="A" />
        <LpCheckbox value="B" />
      </LpCheckboxGroup>;
    };

    const wrapper = mount(() => (
      <LpTable data={tableData}>
        <LpTableColumn label="someLabel" v-slots={{ default: renderColumn }} />
      </LpTable>
    ), { attachTo: 'body' });

    await doubleWait();
    const checkGroup = wrapper.findAll('.lp-table__body-wrapper .lp-checkbox-group');
    expect(checkGroup.length).toBe(3);
    const checkbox = wrapper.findAll('.lp-table__body-wrapper .lp-checkbox');
    expect(checkbox.length).toBe(6);
    const checkSelect = wrapper.findAll('.lp-table__body-wrapper label.is-checked');
    expect(checkSelect.length).toBe(3);
    wrapper.unmount();
  });

  describe('attributes', () => {
    const createTable = (props: Partial<TableProps>) => {
      const testData = getTestData();
      return mount(() => (
        <LpTable data={testData} {...props}>
          <LpTableColumn prop="name" label="片名" />
          <LpTableColumn prop="release" label="发行日期" />
          <LpTableColumn prop="director" label="导演" />
          <LpTableColumn prop="runtime" label="时长（分）" />
        </LpTable>
      ), { attachTo: 'body' });
    };

    test('height', async () => {
      const wrapper = createTable({ height: 134 });
      await doubleWait();
      expect(wrapper.attributes('style')).toContain('height: 134px');
      wrapper.unmount();
    });

    test('height as string', async () => {
      const wrapper = createTable({ height: '100px' });
      await doubleWait();
      expect(wrapper.attributes('style')).toContain('height: 100px');
      wrapper.unmount();
    });

    test('maxHeight', async () => {
      const wrapper = createTable({ maxHeight: 134 });
      await doubleWait();
      expect(wrapper.attributes('style')).toContain('max-height: 134px');
      wrapper.unmount();
    });

    test('maxHeight uses special units', async () => {
      const wrapper = createTable({ maxHeight: '60vh' });
      await doubleWait();
      expect(wrapper.find('.lp-scrollbar__wrap').attributes('style')).toContain(
        'max-height: calc(60vh - 0px);',
      );
      wrapper.unmount();
    });

    test('stripe', async () => {
      const wrapper = createTable({ stripe: true });
      await doubleWait();
      expect(wrapper.classes()).toContain('lp-table--striped');
      wrapper.unmount();
    });

    test('border', async () => {
      const wrapper = createTable({ border: true });
      await doubleWait();
      expect(wrapper.classes()).toContain('lp-table--border');
      wrapper.unmount();
    });

    test('fit', async () => {
      const wrapper = createTable({ fit: false });
      await doubleWait();
      expect(wrapper.classes()).not.toContain('lp-table--fit');
      wrapper.unmount();
    });

    test('show-header', async () => {
      const wrapper = createTable({ showHeader: false });
      await doubleWait();
      expect(wrapper.findAll('.lp-table__header-wrapper').length).toEqual(0);
      wrapper.unmount();
    });

    test('tableRowClassName', async () => {
      const tableRowClassName = ({ rowIndex }: { rowIndex: number }) => {
        return rowIndex === 1
          ? 'info-row'
          : rowIndex === 3
            ? 'positive-row'
            : '';
      };
      const wrapper = createTable({ rowClassName: tableRowClassName });
      await doubleWait();
      expect(wrapper.findAll('.info-row').length).toEqual(1);
      expect(wrapper.findAll('.positive-row').length).toEqual(1);
      wrapper.unmount();
    });

    test('tableRowStyle[Object]', async () => {
      const wrapper = createTable({ rowStyle: { height: '60px' } });
      await doubleWait();
      expect(wrapper.find('.lp-table__body tr').attributes('style'))
        .toContain('height: 60px');
      wrapper.unmount();
    });

    test('tableRowStyle[Function]', async () => {
      const tableRowStyle: RowStyleGenerator = ({ rowIndex }) => {
        return rowIndex === 1
          ? { height: '60px', display: 'none' }
          : null;
      };

      const wrapper = createTable({ rowStyle: tableRowStyle });

      await doubleWait();
      const child1 = wrapper.find('.lp-table__body tr:nth-child(1)');
      const child2 = wrapper.find('.lp-table__body tr:nth-child(2)');
      expect(child1.attributes('style')).toBeUndefined();
      expect(child2.attributes('style')).toContain('height: 60px');
      expect(child2.attributes('style')).toContain('display: none');
      wrapper.unmount();
    });

    test('current-row-key', async () => {
      const testData = getTestData();
      const currentRowKey = ref<number | null>(null);
      const wrapper = mount(() => (
        <LpTable data={testData} row-key="id" highlight-current-row current-row-key={currentRowKey.value}>
          <LpTableColumn prop="name" label="片名" />
          <LpTableColumn prop="release" label="发行日期" />
          <LpTableColumn prop="director" label="导演" />
          <LpTableColumn prop="runtime" label="时长（分）" />
        </LpTable>
      ), { attachTo: 'body' });

      await doubleWait();
      currentRowKey.value = 1;
      const tr = wrapper.find('.lp-table__body-wrapper tbody tr');
      await doubleWait();
      expect(tr.classes()).toContain('current-row');
      currentRowKey.value = 2;

      const rows = wrapper.findAll('.lp-table__body-wrapper tbody tr');
      await doubleWait();
      expect(tr.classes()).not.toContain('current-row');
      expect(rows[1].classes()).toContain('current-row');
      wrapper.unmount();
    });
  });

  describe('filter', () => {
    const filters = ref<any>(null);
    let wrapper: VueWrapper<ComponentPublicInstance>;

    beforeEach(async () => {
      const testData = getTestData();
      const filterMethod = (value: any, row: any) => {
        return value === row.director;
      };
      const onFilterChange = (val: any) => {
        filters.value = val;
      };
      wrapper = mount(() => (
        <LpTable data={testData} onFilterChange={onFilterChange}>
          <LpTableColumn prop="name" label="片名" />
          <LpTableColumn prop="release" label="发行日期" />
          <LpTableColumn
            prop="director"
            column-key="director"
            filters={[
              { text: 'John Lasseter', value: 'John Lasseter' },
              { text: 'Peter Docter', value: 'Peter Docter' },
              { text: 'Andrew Stanton', value: 'Andrew Stanton' },
            ]}
            filter-method={filterMethod}
            label="导演" />
          <LpTableColumn prop="runtime" label="时长（分）" />
        </LpTable>
      ), { attachTo: 'body' });
      await doubleWait();
    });

    afterEach(() => wrapper.unmount());

    test('render', () => {
      expect(wrapper.find('.lp-table__column-filter-trigger'))
        .not.toBeUndefined();
    });

    test('click dropdown', async () => {
      const btn = wrapper.find('.lp-table__column-filter-trigger');
      btn.trigger('click');
      await doubleWait();
      const filter = document.body.querySelector('.lp-table-filter')!;
      expect(filter).not.toBeNull();
      filter.remove();
    });

    test('click filter', async () => {
      const btn = wrapper.find('.lp-table__column-filter-trigger');

      btn.trigger('click');
      await doubleWait();
      const filter = document.body.querySelector('.lp-table-filter')!;

      triggerEvent(filter.querySelector('.lp-checkbox')!, 'click', true, false);
      // confrim button
      await doubleWait();
      triggerEvent(filter.querySelector('.lp-table-filter__bottom button')!, 'click', true, false);

      await doubleWait();
      expect(filters.value.director).toEqual(['John Lasseter']);
      expect(wrapper.findAll('.lp-table__body-wrapper tbody tr').length).toEqual(3);
      filter.remove();
    });

    test('clear filter', async () => {
      const btn = wrapper.find('.lp-table__column-filter-trigger');

      btn.trigger('click');
      await doubleWait();
      const filter = document.body.querySelector('.lp-table-filter')!;

      triggerEvent(filter.querySelector('.lp-checkbox')!, 'click', true, false);
      // confrim button
      await doubleWait();
      triggerEvent(filter.querySelector('.lp-table-filter__bottom button')!, 'click', true, false);

      await nextTick();
      expect(wrapper.findAll('.lp-table__body-wrapper tbody tr').length).toEqual(3);

      const table = wrapper.findComponent(LpTable);
      table.vm.clearFilter();

      await nextTick();
      expect(wrapper.findAll('.lp-table__body-wrapper tbody tr').length).toEqual(5);
      filter.remove();
    });

    test('click reset', async () => {
      const btn = wrapper.find('.lp-table__column-filter-trigger');
      btn.trigger('click');
      await doubleWait();
      const filter = document.body.querySelector('.lp-table-filter')!;

      triggerEvent(filter.querySelector('.lp-checkbox')!, 'click', true, false);
      await doubleWait();
      triggerEvent(
        filter.querySelectorAll('.lp-table-filter__bottom button')[1],
        'click',
        true,
        false,
      );
      await doubleWait();
      expect(filters.value.director).toEqual([]);
      expect([
        ...filter.querySelector('.lp-table-filter__bottom button')!.classList,
      ]).toContain('is-disabled');
      filter.remove();
      wrapper.unmount();
    });
  });

  describe('events', () => {
    const createTable = (eventName = '') => {
      const testData = getTestData();
      const result = ref<any[]>([]);
      const onEvent = (...args: any) => (result.value = args);
      const wrapper = mount(() => (
        <LpTable data={testData}
          {...{ [`on${upperFirst(eventName)}`]: onEvent }}>
            <LpTableColumn type="selection" />
            <LpTableColumn prop="name" />
            <LpTableColumn prop="release" />
            <LpTableColumn prop="director" />
            <LpTableColumn prop="runtime"/>
        </LpTable>
      ), { attachTo: 'body' });
      return { wrapper, result };
    };

    test('select', async () => {
      const { wrapper, result } = createTable('select');
      await doubleWait();
      wrapper.findAll('.lp-checkbox')[1].trigger('click');
      expect(result.value.length).toEqual(2);
      expect(result.value[1]).toHaveProperty('name');
      expect(result.value[1].name).toEqual(getTestData()[0].name);
      wrapper.unmount();
    });

    test('selection-change', async () => {
      const { wrapper, result } = createTable('selection-change');
      await doubleWait();
      wrapper.findAll('.lp-checkbox')[1].trigger('click');
      expect(result.value.length).toEqual(1);
      wrapper.unmount();
    });

    test('cell-mouse-enter', async () => {
      const { wrapper, result } = createTable('cell-mouse-enter');
      await doubleWait();
      const cell = wrapper.findAll('.lp-table__body .cell')[2]!; // first row
      triggerEvent(cell.element.parentElement!, 'mouseenter');
      expect(result.value.length).toEqual(4); // row, column, cell, event
      expect(result.value[0]).toHaveProperty('name');
      expect(result.value[0].name).toEqual(getTestData()[0].name);
      wrapper.unmount();
    });

    test('cell-mouse-leave', async () => {
      const { wrapper, result } = createTable('cell-mouse-leave');
      await doubleWait();
      const cell = wrapper.findAll('.lp-table__body .cell')[7]; // second row
      const cell2 = wrapper.findAll('.lp-table__body .cell')[2]; // first row

      triggerEvent(cell2.element.parentElement!, 'mouseenter');
      triggerEvent(cell.element.parentElement!, 'mouseleave');
      expect(result.value.length).toEqual(4); // row, column, cell, event
      expect(result.value[0]).toHaveProperty('name');
      expect(result.value[0].name).toEqual(getTestData()[0].name);
      wrapper.unmount();
    });

    test('row-click', async () => {
      const { wrapper, result } = createTable('row-click');
      await doubleWait();
      const cell = wrapper.findAll('.lp-table__body .cell')[2]; // first row

      triggerEvent(cell.element.parentElement!.parentElement!, 'click');
      expect(result.value.length).toEqual(3); // row, event, column
      expect(result.value[0]).toHaveProperty('name');
      expect(result.value[0].name).toEqual(getTestData()[0].name);
      wrapper.unmount();
    });

    test('row-dblclick', async () => {
      const { wrapper, result } = createTable('row-dblclick');
      await doubleWait();
      const cell = wrapper.findAll('.lp-table__body .cell')[2]; // first row

      triggerEvent(cell.element.parentElement!.parentElement!, 'dblclick');
      expect(result.value.length).toEqual(3); // row, event, column
      expect(result.value[0]).toHaveProperty('name');
      expect(result.value[0].name).toEqual(getTestData()[0].name);
      wrapper.unmount();
    });

    test('header-click', async () => {
      const { wrapper, result } = createTable('header-click');
      await doubleWait();
      const cell = wrapper.findAll('.lp-table__header th')[1]; // header[prop='name']
      cell.trigger('click');
      expect(result.value.length).toEqual(2); // column, event
      expect(result.value[0].name).toBeUndefined();
      wrapper.unmount();
    });
  });

  describe('summary row', () => {
    test('should render', async () => {
      const testData = getTestData();
      const wrapper = mount(() =>(
        <LpTable data={testData} show-summary>
          <LpTableColumn prop="name" />
          <LpTableColumn prop="release"/>
          <LpTableColumn prop="director"/>
          <LpTableColumn prop="runtime"/>
        </LpTable>
      ), { attachTo: 'body' });

      await doubleWait();
      const footer = wrapper.find('.lp-table__footer');
      expect(footer).not.toBeUndefined();
      const cells = footer.findAll('.cell');
      expect(cells[cells.length - 1].text()).toEqual('459');
      wrapper.unmount();
    });

    test('custom sum text', async () => {
      const testData = getTestData();
      const wrapper = mount(() => (
        <LpTable data={testData} show-summary sum-text="Time">
          <LpTableColumn prop="name" />
          <LpTableColumn prop="release"/>
          <LpTableColumn prop="director"/>
          <LpTableColumn prop="runtime"/>
        </LpTable>
      ), { attachTo: 'body' });

      await doubleWait();
      const cells = wrapper.findAll('.lp-table__footer .cell');
      expect(cells[0].text()).toEqual('Time');
      wrapper.unmount();
    });

    test('custom summary method', async () => {
      const testData = getTestData();
      const getSummary: SummaryMethod = ({ columns, data }) => {
        return columns.map(({ property: prop })  => {
          return prop === 'release'
            ? data
              .map(item => item[prop])
              .map(date => Number(date.slice(0, 4)))
              .reduce((prev, curr) => (prev + curr))
              .toString()
            : '';
        });
      };
      const wrapper = mount(() => (
        <LpTable data={testData} show-summary summary-method={getSummary}>
          <LpTableColumn prop="name" />
          <LpTableColumn prop="release"/>
          <LpTableColumn prop="director"/>
          <LpTableColumn prop="runtime"/>
        </LpTable>
      ));
      await doubleWait();
      const cells = wrapper.findAll('.lp-table__footer .cell');
      expect(cells[1].text()).toEqual('9996');
      wrapper.unmount();
    });
  });

  describe('methods', () => {
    const createTable = (eventName = '') => {
      const testData = getTestData();
      const fireCount = ref(0);
      const selection = ref<any>(null);
      const onEvent = (item: any) => {
        fireCount.value++,
        selection.value = item;
      };
      const wrapper = mount(() => (
        <LpTable data={testData}
          {...{ [`on${upperFirst(eventName)}`]: onEvent }}>
            <LpTableColumn type="selection" />
            <LpTableColumn prop="name" />
            <LpTableColumn prop="release" />
            <LpTableColumn prop="director" />
            <LpTableColumn prop="runtime"/>
        </LpTable>
      ), { attachTo: 'body' });
      return { wrapper, testData, fireCount, selection };
    };

    test('toggleRowSelection', async () => {
      const { wrapper, testData, selection, fireCount } = createTable('SelectionChange');
      await doubleWait();

      const table = wrapper.findComponent(LpTable);
      table.vm.toggleRowSelection(testData[0]);
      expect(selection.value.length).toEqual(1);
      expect(fireCount.value).toEqual(1);

      // test use second parameter
      table.vm.toggleRowSelection(testData[0]);
      expect(fireCount.value).toEqual(2);

      table.vm.toggleRowSelection(testData[0], false);
      expect(fireCount.value).toEqual(2);
      expect(selection.value.length).toEqual(0);
      wrapper.unmount();
    });

    test('toggleAllSelection', async () => {
      const { wrapper, selection } = createTable('SelectionChange');
      const table = wrapper.findComponent(LpTable);
      table.vm.toggleAllSelection();
      await doubleWait();
      expect(selection.value.length).toEqual(5);

      table.vm.toggleAllSelection();
      await doubleWait();
      expect(selection.value.length).toEqual(0);
      wrapper.unmount();
    });

    test('clearSelection', () => {
      const { wrapper, testData, selection, fireCount } = createTable('SelectionChange');
      const table = wrapper.findComponent(LpTable);
      table.vm.toggleRowSelection(testData[0]);
      expect(selection.value.length).toEqual(1);
      expect(fireCount.value).toEqual(1);

      // clear selection
      table.vm.clearSelection();
      expect(fireCount.value).toEqual(2);
      expect(selection.value.length).toEqual(0);

      table.vm.clearSelection();
      expect(fireCount.value).toEqual(2);

      wrapper.unmount();
    });

    test('sort', async () => {
      const testData = ref(getTestData());
      const wrapper = mount(() => (
        <LpTable data={testData.value} rowKey="id" default-sort={{ prop: 'runtime', order: 'ascending' }}>
          <LpTableColumn prop="name" />
          <LpTableColumn prop="release" />
          <LpTableColumn prop="director" />
          <LpTableColumn prop="runtime"/>
        </LpTable>
      ), { attachTo: 'body' });

      await doubleWait();
      let lastCells = wrapper.findAll('.lp-table__body-wrapper tbody tr td:last-child');

      expect(lastCells.map(node => node.text()))
        .toEqual(['80', '92', '92', '95', '100']);

      await doubleWait();
      testData.value.map(row => (row.runtime = -row.runtime));

      const table = wrapper.findComponent(LpTable);
      table.vm.sort('runtime', 'ascending');
      await doubleWait();

      lastCells = wrapper.findAll('.lp-table__body-wrapper tbody tr td:last-child');
      expect(lastCells.map(node => node.text()))
        .toEqual(['-100', '-95', '-92', '-92', '-80']);
      wrapper.unmount();
    });

    test('sort correct change icon', async () => {
      const assertSortIconCount = (el: HTMLElement, msg: string, count = 1) => {
        const sortIconCount = el.querySelectorAll('th.ascending, th.descending').length;
        expect(sortIconCount).toEqual(count);
      };
      const testData = getTestData();
      const wrapper = mount(() => (
        <LpTable data={testData} >
          <LpTableColumn prop="name" sortable />
          <LpTableColumn prop="release" sortable />
          <LpTableColumn prop="director" sortable />
          <LpTableColumn prop="runtime" sortable />
        </LpTable>
      ), { attachTo: 'body' });

      await doubleWait();
      const table = wrapper.findComponent(LpTable)!;
      assertSortIconCount(
        table.element as HTMLElement,
        'sorting icon is not empty after mount',
        0,
      );
      // manual click first column header
      const elm = wrapper.find('.caret-wrapper');
      elm.trigger('click');
      await doubleWait();
      assertSortIconCount(
        table.element as HTMLElement,
        'sorting icon is not one after click header',
      );
      table.vm.sort('director', 'descending');
      await doubleWait();
      assertSortIconCount(
        table.element as HTMLElement,
        'sorting icon is not one after call sort',
      );
      table.vm.sort('director', 'ascending');
      await doubleWait();
      assertSortIconCount(
        table.element as HTMLElement,
        'sorting icon is not one after sort same column',
      );
      wrapper.unmount();
    });

    // https://github.com/element-plus/element-plus/issues/4589
    test('sort-change event', async () => {
      const onSortChange = vi.fn();
      const testData = getTestData();
      const wrapper = mount(() => (
        <LpTable data={testData} onSortChange={onSortChange}>
          <LpTableColumn prop="name" />
          <LpTableColumn prop="release" />
          <LpTableColumn prop="director" />
          <LpTableColumn prop="runtime" sortable ref="runtime" />
        </LpTable>
      ), { attachTo: 'body' });

      await doubleWait();
      const elm = wrapper.find('.caret-wrapper');

      elm.trigger('click');
      expect(onSortChange).toHaveBeenLastCalledWith({
        column: expect.any(Object),
        prop: 'runtime',
        order: 'ascending',
      });

      elm.trigger('click');
      expect(onSortChange).toHaveBeenLastCalledWith({
        column: expect.any(Object),
        prop: 'runtime',
        order: 'descending',
      });

      elm.trigger('click');
      expect(onSortChange).toHaveBeenLastCalledWith({
        column: expect.any(Object),
        prop: 'runtime',
        order: null,
      });
    });

    test('setCurrentRow', async () => {
      const testData = getTestData();
      const wrapper = mount(() => (
        <LpTable data={testData} highlight-current-row>
          <LpTableColumn prop="name" sortable />
          <LpTableColumn prop="release" sortable />
          <LpTableColumn prop="director" sortable />
          <LpTableColumn prop="runtime" sortable />
        </LpTable>
      ), { attachTo: 'body' });

      const table = wrapper.findComponent(LpTable);
      table.vm.setCurrentRow(testData[1]);
      await doubleWait();
      const secondRow = wrapper.findAll('.lp-table__row').at(1)!.element;
      expect([...secondRow.classList]).toContain('current-row');

      table.vm.setCurrentRow();
      await doubleWait();
      expect([...secondRow.classList]).not.toContain('current-row');

      wrapper.unmount();
    });
  });

  test('hover', async () => {
    const testData = getTestData();
    const wrapper = mount(() => (
      <LpTable data={testData}>
        <LpTableColumn prop="name" label="片名" fixed />
        <LpTableColumn prop="release" label="发行日期" />
        <LpTableColumn prop="director" label="导演" />
        <LpTableColumn prop="runtime" label="时长（分）" />
      </LpTable>
    ), { attachTo: 'body' });

    await doubleWait();
    const tr = wrapper.find('.lp-table__body-wrapper tbody tr');
    await tr.trigger('mouseenter');
    await doubleWait();
    await rAF();
    await doubleWait();
    expect(tr.classes()).toContain('hover-row');
    await tr.trigger('mouseleave');
    await doubleWait();

    await rAF();
    await doubleWait();
    expect(tr.classes()).not.toContain('hover-row');
    wrapper.unmount();
  });

  test('highlight-current-row', async () => {
    const testData = getTestData();
    const wrapper = mount(() => (
      <LpTable data={testData} highlight-current-row>
        <LpTableColumn prop="name" label="片名" />
        <LpTableColumn prop="release" label="发行日期" />
        <LpTableColumn prop="director" label="导演" />
        <LpTableColumn prop="runtime" label="时长（分）" sortable />
      </LpTable>
    ), { attachTo: 'body' });
    const vm = wrapper.vm;
    await doubleWait();
    const tr = vm.$el.querySelector('.lp-table__body-wrapper tbody tr');
    triggerEvent(tr, 'click', true, false);
    await doubleWait();
    expect([...tr.classList]).toContain('current-row');
    let rows = vm.$el.querySelectorAll('.lp-table__body-wrapper tbody tr');

    triggerEvent(rows[1], 'click', true, false);
    await doubleWait();
    expect([...tr.classList]).not.toContain('current-row');
    expect([...rows[1].classList]).toContain('current-row');

    const ths = vm.$el.querySelectorAll('.lp-table__header-wrapper thead th');
    triggerEvent(ths[3], 'click', true, false);

    await doubleWait();
    rows = vm.$el.querySelectorAll('.lp-table__body-wrapper tbody tr');

    expect([...rows[1].classList]).not.toContain('current-row');
    expect([...rows[3].classList]).toContain('current-row');
    wrapper.unmount();
  });

  test('keep highlight row when data change', async () => {
    const testData = ref(getTestData());
    const wrapper = mount(() => (
      <LpTable data={testData.value} highlight-current-row row-key="release">
        <LpTableColumn prop="name" label="片名" />
        <LpTableColumn prop="release" label="发行日期" />
        <LpTableColumn prop="director" label="导演" />
        <LpTableColumn prop="runtime" label="时长（分）" sortable />
      </LpTable>
    ), { attachTo: 'body' });

    await doubleWait();
    let rows = wrapper.findAll('.lp-table__body-wrapper tbody tr');
    triggerEvent(rows.at(2)!.element, 'click', true, false);

    await doubleWait();
    expect([...rows.at(2)!.element.classList]).toContain('current-row');

    const data = getTestData();
    data.splice(0, 0, {
      id: 8,
      name: 'Monsters, Inc.',
      release: '2018-02-01',
      director: 'Peter Docter',
      runtime: 92,
    });
    data[2].name = 'Modified Name';
    testData.value = data;

    await doubleWait();
    rows = wrapper.findAll('.lp-table__body-wrapper tbody tr');
    expect([...(rows.at(3)!.element.classList)]).toContain('current-row');
    wrapper.unmount();
  });

  test('keep highlight row after sort', async () => {
    const wrapper = mount(() => (
      <LpTable data={getTestData()} highlight-current-row row-key="release">
        <LpTableColumn prop="name" label="片名" />
        <LpTableColumn prop="release" label="发行日期" />
        <LpTableColumn prop="director" label="导演" />
        <LpTableColumn prop="runtime" label="时长（分）" sortable />
      </LpTable>
    ), { attachTo: 'body' });

    const vm = wrapper.vm;
    await doubleWait();
    const rows = vm.$el.querySelectorAll('.lp-table__body-wrapper tbody tr');
    triggerEvent(rows[1], 'click', true, false);
    await doubleWait();
    expect([...rows[1].classList]).toContain('current-row');
    triggerEvent(rows[3], 'click', true, false);
    await doubleWait();
    expect([...rows[3].classList]).toContain('current-row');
    wrapper.unmount();
  });

  test('table append is visible in viewport if height is 100%', async () => {
    const wrapper = mount(() => (
      <LpTable data={[]} height="100%" v-slots={{ append: () =>
        (<div class="append-content" style="height: 48px;">append 区域始终出现在视图内</div>) }}>
        <LpTableColumn prop="name" label="片名" />
        <LpTableColumn prop="release" label="发行日期" />
        <LpTableColumn prop="director" label="导演" />
        <LpTableColumn prop="runtime" label="时长（分）" />
      </LpTable>
    ), { attachTo: 'body' });

    await doubleWait();
    const emptyBlockEl = wrapper.find('.lp-table__empty-block');
    expect(emptyBlockEl.attributes('style')).toContain('height: 100%');
    wrapper.unmount();
  });

  describe('rowKey & index', () => {
    test('key type is string', async () => {
      const testData = getTestData();
      const wrapper = mount(() => (
        <LpTable data={testData} row-key="release" highlight-current-row >
          <LpTableColumn type="index" />
          <LpTableColumn prop="name" label="片名" />
          <LpTableColumn prop="release" label="发行日期" />
          <LpTableColumn prop="director" label="导演" />
          <LpTableColumn prop="runtime" label="时长（分）" sortable />
        </LpTable>
      ), { attachTo: 'body' });

      await doubleWait();
      const rows = wrapper.findAll('.lp-table__row');
      rows.forEach((row, index) => {
        const cell = row.find('td');
        expect(cell.text()).toMatch(`${index + 1}`);
      });
    });

    test('with expand row', async () => {
      const wrapper = mount(() => (
        <LpTable data={getTestData()} row-key="release" highlight-current-row >
          <LpTableColumn type="index" />
          <LpTableColumn type="expand" v-slots={{
            default: (props: any) => (<>
              <span class="index">{ props.rowIndex }</span>
              <span class="director">{ props.row.director }</span>
            </>) }} />
          <LpTableColumn prop="name" label="片名" />
          <LpTableColumn prop="release" label="发行日期" />
          <LpTableColumn prop="director" label="导演" />
          <LpTableColumn prop="runtime" label="时长（分）" sortable />
        </LpTable>
      ), { attachTo: 'body' });

      await doubleWait();
      const rows = wrapper.findAll('.lp-table__row');
      rows.forEach((row, index) => {
        const cell = row.find('td');
        expect(cell.text()).toMatch(`${index + 1}`);
      });
      let index = 0;
      for (const row of rows) {
        const expandCell = row.findAll('td')[1];
        const triggerIcon = expandCell.find('.lp-table__expand-icon');
        triggerIcon.trigger('click');
        await doubleWait();
        const cell = row.find('td');
        expect(cell.text()).toMatch(`${++index}`);
        triggerIcon.trigger('click');
        await doubleWait();
      }
    });
  });

  describe('tree', () => {
    let wrapper: VueWrapper<ComponentPublicInstance>;
    afterEach(() => wrapper?.unmount());

    test('render tree structual data', async () => {
      const testData = getTestData() as any;
      testData[1].children = [
        { name: "A Bug's Life copy 1", release: '1998-11-25-1', director: 'John Lasseter', runtime: 95 },
        { name: "A Bug's Life copy 2", release: '1998-11-25-2', director: 'John Lasseter', runtime: 95 },
      ];

      wrapper = mount(() => (
        <LpTable data={testData} row-key="release">
          <LpTableColumn prop="name" label="片名" />
          <LpTableColumn prop="release" label="发行日期" />
          <LpTableColumn prop="director" label="导演" />
          <LpTableColumn prop="runtime" label="时长（分）" />
        </LpTable>
      ), { attachTo: 'body' });

      await doubleWait();
      await doubleWait();

      const rows = wrapper.findAll('.lp-table__row');
      expect(rows.length).toEqual(7);
      // validate placeholder
      expect(wrapper.findAll('.lp-table__placeholder').length).toBe(6);
      const childRows = wrapper.findAll('.lp-table__row--level-1');
      expect(childRows.length).toEqual(2);
      childRows.forEach(item => {
        expect(item.attributes('style')).toContain('display: none');
      });
      wrapper.find('.lp-table__expand-icon').trigger('click');

      await doubleWait();
      childRows.forEach(item => {
        expect(item.attributes('style')).toEqual('');
      });
    });

    test('load substree row data', async () => {
      const testData = getTestData() as any;
      const lastItem = testData[testData.length - 1];
      lastItem.children = [{
        id: lastItem.id * 10 + 1,
        name: "A Bug's Life copy 1",
        release: '2008-1-25-1',
        director: 'John Lasseter',
        runtime: 95,
      }];

      testData[1].hasChildren = true;

      const loadRow: TableLoadChildren = () => {
        return Promise.resolve([
          { name: "A Bug's Life copy 1", release: '1998-11-25-1', director: 'John Lasseter', runtime: 95 },
          { name: "A Bug's Life copy 2", release: '1998-11-25-2', director: 'John Lasseter', runtime: 95 },
        ] as any[]);
      };

      wrapper = mount(() => (
        <LpTable data={testData} row-key="id" lazy load={loadRow}>
          <LpTableColumn prop="name" label="片名" />
          <LpTableColumn prop="release" label="发行日期" />
          <LpTableColumn prop="director" label="导演" />
          <LpTableColumn prop="runtime" label="时长（分）" />
        </LpTable>
      ), { attachTo: 'body' });

      await doubleWait();

      expect(wrapper.findAll('.lp-table__row').length).toEqual(6);

      const expandIcon = wrapper.find('.lp-table__expand-icon');
      expandIcon.trigger('click');

      await doubleWait();
      expect(expandIcon.classes()).toContain('lp-table__expand-icon--expanded');
      expect(wrapper.findAll('.lp-table__row').length).toEqual(8);
    });

    test('tree-props & default-expand-all & expand-change', async () => {
      const onExpandChange = vi.fn();

      const testData = getTestData() as any;
      testData[testData.length - 1].childrenTest = [
        {
          name: "A Bug's Life copy 1",
          release: '2008-1-25-1',
          director: 'John Lasseter',
          runtime: 95,
        },
      ];
      testData[1].hasChildrenTest = true;

      const loadRow: TableLoadChildren = () => {
        return Promise.resolve([
          {
            name: "A Bug's Life copy 1",
            release: '1998-11-25-1',
            director: 'John Lasseter',
            runtime: 95,
          },
          {
            name: "A Bug's Life copy 2",
            release: '1998-11-25-2',
            director: 'John Lasseter',
            runtime: 95,
          },
        ]);
      };

      wrapper = mount(() => (
        <LpTable
          data={testData} lazy default-expand-all row-key="release" tree-props={{ children: 'childrenTest', hasChildren: 'hasChildrenTest' }} load={loadRow} onExpandChange={onExpandChange}>
          <LpTableColumn prop="name" label="片名" />
          <LpTableColumn prop="release" label="发行日期" />
          <LpTableColumn prop="director" label="导演" />
          <LpTableColumn prop="runtime" label="时长（分）" />
        </LpTable>
      ), { attachTo: 'body' });

      await doubleWait();
      const childRows = wrapper.findAll('.lp-table__row--level-1');
      childRows.forEach(item => {
        expect(item.attributes('style')).toBeUndefined();
      });
      const expandIcon = wrapper.find('.lp-table__expand-icon');
      expandIcon.trigger('click');
      await doubleWait();
      expect(
        expandIcon.classes().includes('lp-table__expand-icon--expanded'),
      ).toBeTruthy();
      expect(wrapper.findAll('.lp-table__row').length).toEqual(8);
      expect(onExpandChange.mock.calls[0][0]).toBeInstanceOf(Object);
      expect(onExpandChange.mock.calls[0][1]).toBeTruthy();
    });

    test('expand-row-keys & toggleRowExpansion', async () => {
      const testData = getTestData() as any;
      const lastItem = testData[testData.length - 1];
      lastItem.children = [{
        id: lastItem.id * 10 + 1,
        name: "A Bug's Life copy 1",
        release: '2003-5-30-1',
        director: 'John Lasseter',
        runtime: 95,
        hasChildren: true,
      }];

      const loadRow: TableLoadChildren = () => {
        return Promise.resolve([{
          id: 511,
          name: "A Bug's Life copy 1",
          release: '2003-5-30-2',
          director: 'John Lasseter',
          runtime: 95,
        }]);
      };

      wrapper = mount(() => (
        <LpTable data={testData} rowKey="id" lazy load={loadRow} expandRowKeys={[lastItem.id]}>
          <LpTableColumn prop="name" label="片名" />
          <LpTableColumn prop="release" label="发行日期" />
          <LpTableColumn prop="director" label="导演" />
          <LpTableColumn prop="runtime" label="时长（分）" />
        </LpTable>
      ), { attachTo: 'body' });

      await doubleWait();
      const childRows = wrapper.findAll('.lp-table__row--level-1');
      childRows.forEach(item => {
        expect(item.attributes('style')).toBe('');
      });

      const expandIcon = childRows[0].find('.lp-table__expand-icon');
      expandIcon.trigger('click');
      await doubleWait();
      expect(expandIcon.classes()).toContain('lp-table__expand-icon--expanded');

      const table = wrapper.findComponent(LpTable);
      const row = testData[testData.length - 1].children[0];
      table.vm.toggleRowExpansion(row);

      await doubleWait();
      expect(expandIcon.classes())
        .not.toContain('lp-table__expand-icon--expanded');
    });

    test('v-if on lp-table-column should patch correctly', async () => {
      const testData = getTestData() as any;
      const showName = ref(true);
      wrapper = mount(() => (
        <LpTable data={testData}>
          { showName.value ? (<LpTableColumn key="name" label="片名"
            v-slots={{ default: ({ row }: any) => (<span class="name">{row.name}</span>) }} />) : null }
          <LpTableColumn key="release" label="发行日期"
          v-slots={{ default: ({ row }: any) => (<span class="release">{row.release}</span>) }}/>
        </LpTable>
      ), { attachTo: 'body' });

      await doubleWait();
      const firstCellSpanBeforeHide = wrapper.find('.lp-table__body tr td span');
      expect(firstCellSpanBeforeHide.classes().includes('name')).toBeTruthy();

      showName.value = false;
      await doubleWait();
      const firstCellSpanAfterHide = wrapper.find('.lp-table__body tr td span');
      expect(firstCellSpanAfterHide.classes().includes('release')).toBeTruthy();
    });
  });

  test('when tableLayout is auto', async () => {
    const testData = getTestData();
    const wrapper = mount(() => (
      <LpTable data={testData} table-layout="auto">
        <LpTableColumn prop="id" />
        <LpTableColumn prop="name" label="片名" />
        <LpTableColumn prop="release" label="发行日期" />
        <LpTableColumn prop="director" label="导演" />
        <LpTableColumn prop="runtime" label="时长（分）" />
      </LpTable>
    ), { attachTo: 'body' });

    await doubleWait();
    expect(wrapper.find('.lp-table__body thead').exists()).toBeTruthy();
    expect(wrapper.find('.lp-table__body colgroup col').exists()).toBeFalsy();
    expect(wrapper.find('.lp-table__body tbody').exists()).toBeTruthy();
  });

  test('automatic minimum size of flex-items', async () => {
    const testData = getTestData();
    const wrapper = mount(() => (
      <div class="right">
        <LpTable flexible data={testData} table-layout="auto">
          <LpTableColumn prop="id" />
          <LpTableColumn prop="name" label="片名" />
          <LpTableColumn prop="release" label="发行日期" />
          <LpTableColumn prop="director" label="导演" />
          <LpTableColumn prop="runtime" label="时长（分）" />
        </LpTable>
      </div>
    ), { attachTo: 'body' });

    await nextTick();
    expect(wrapper.find('.right').element.getAttribute('style'))
      .toContain('min-width: 0');
  });

  test('selectable tree', async () => {
    const testData = getTestData() as any;
    testData[1].children = [{
      name: "A Bug's Life copy 1",
      release: '1998-11-25-1',
      director: 'John Lasseter',
      runtime: 95,
    }, {
      name: "A Bug's Life copy 2",
      release: '1998-11-25-2',
      director: 'John Lasseter',
      runtime: 95,
    }];
    const selected = ref<any[]>([]);
    const change = (rows: any[]) => {
      selected.value = rows;
    };
    const wrapper = mount(() => (
      <LpTable data={testData} onSelectionChange={change}>
        <LpTableColumn type="selection" />
        <LpTableColumn prop="name" label="name" />
        <LpTableColumn prop="release" label="release" />
        <LpTableColumn prop="director" label="director" />
        <LpTableColumn prop="runtime" label="runtime" />
      </LpTable>
    ), { attachTo: 'body' });
    await doubleWait();
    wrapper.findAll('.lp-checkbox')[2].trigger('click');
    await doubleWait();
    expect(selected.value.length).toEqual(3);
  });
});
