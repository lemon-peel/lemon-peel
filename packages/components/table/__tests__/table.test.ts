/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { nextTick } from 'vue';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import LpCheckbox from '@lemon-peel/components/checkbox';
import triggerEvent from '@lemon-peel/test-utils/triggerEvent';
import { rAF } from '@lemon-peel/test-utils/tick';
import LpTable from '../src/table/Table.vue';
import LpTableColumn from '../src/tableColumn';
import { doubleWait, getTestData, mount } from './tableTestCommon';
import type { VueWrapper } from '@vue/test-utils';
import type { ComponentPublicInstance } from 'vue';

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

describe('Table.vue', () => {
  describe('rendering data is correct', () => {
    const wrapper = mount({
      components: {
        LpTable,
        LpTableColumn,
      },
      template: `
      <lp-table :data="testData">
        <lp-table-column prop="id" />
        <lp-table-column prop="name" label="片名" />
        <lp-table-column prop="release" label="发行日期" />
        <lp-table-column prop="director" label="导演" />
        <lp-table-column prop="runtime" label="时长（分）" />
      </lp-table>
      `,
      created() {
        this.testData = getTestData();
      },
    });
    it('head', async () => {
      await doubleWait();
      const ths = wrapper.findAll('thead th');
      expect(ths.map(node => node.text()).filter(Boolean)).toEqual([
        '片名',
        '发行日期',
        '导演',
        '时长（分）',
      ]);
    });

    it('row length', () => {
      expect(
        wrapper.findAll('.lp-table__body-wrapper tbody tr').length,
      ).toEqual(getTestData().length);
    });
    it('row data', () => {
      const cells = wrapper.findAll('td .cell').map(node => node.text());
      const testDataArr = getTestData().flatMap(cur => {
        return Object.values(cur).map(String);
      });
      expect(cells).toEqual(testDataArr);
      wrapper.unmount();
    });
  });

  it('custom template', async () => {
    const wrapper = mount({
      components: {
        LpTable,
        LpTableColumn,
        LpCheckboxGroup,
        LpCheckbox,
      },
      template: `
      <lp-table :data="tableData">
        <lp-table-column label="someLabel">
          <template #default="{ row }">
            <lp-checkbox-group v-model="row.checkList">
              <lp-checkbox label="复选框 A"></lp-checkbox>
              <lp-checkbox label="复选框 B"></lp-checkbox>
            </lp-checkbox-group>
          </template>
        </lp-table-column>
      </lp-table>
      `,
      data() {
        return {
          tableData: [
            {
              checkList: [],
            },
            {
              checkList: ['复选框 A'],
            },
            {
              checkList: ['复选框 A', '复选框 B'],
            },
          ],
        };
      },
    });
    const vm = wrapper.vm;
    await doubleWait();
    const checkGroup = vm.$el.querySelectorAll(
      '.lp-table__body-wrapper .lp-checkbox-group',
    );
    expect(checkGroup.length).toBe(3);
    const checkbox = vm.$el.querySelectorAll(
      '.lp-table__body-wrapper .lp-checkbox',
    );
    expect(checkbox.length).toBe(6);
    const checkSelect = vm.$el.querySelectorAll(
      '.lp-table__body-wrapper label.is-checked',
    );
    expect(checkSelect.length).toBe(3);
  });
  describe('attributes', () => {
    const createTable = function (props: string, opts?: any) {
      return mount(
        Object.assign(
          {
            components: {
              LpTable,
              LpTableColumn,
            },
            template: `
          <lp-table :data="testData" ${props}>
            <lp-table-column prop="name" label="片名" />
            <lp-table-column prop="release" label="发行日期" />
            <lp-table-column prop="director" label="导演" />
            <lp-table-column prop="runtime" label="时长（分）" />
          </lp-table>
        `,
            created(this: any) {
              this.testData = getTestData();
            },
          },
          opts,
        ),
      );
    };

    it('height', async () => {
      const wrapper = createTable('height="134"');
      await doubleWait();
      expect(wrapper.attributes('style')).toContain('height: 134px');
      wrapper.unmount();
    });

    it('height as string', async () => {
      const wrapper = createTable('height="100px"');
      await doubleWait();
      expect(wrapper.attributes('style')).toContain('height: 100px');
      wrapper.unmount();
    });

    it('maxHeight', async () => {
      const wrapper = createTable('max-height="134"');
      await doubleWait();
      expect(wrapper.attributes('style')).toContain('max-height: 134px');
      wrapper.unmount();
    });

    it('maxHeight uses special units', async () => {
      const wrapper = createTable('max-height="60vh"');
      await doubleWait();
      expect(wrapper.find('.lp-scrollbar__wrap').attributes('style')).toContain(
        'max-height: calc(60vh - 0px);',
      );
      wrapper.unmount();
    });

    it('stripe', async () => {
      const wrapper = createTable('stripe');
      await doubleWait();
      expect(wrapper.classes()).toContain('lp-table--striped');
      wrapper.unmount();
    });

    it('border', async () => {
      const wrapper = createTable('border');
      await doubleWait();
      expect(wrapper.classes()).toContain('lp-table--border');
      wrapper.unmount();
    });

    it('fit', async () => {
      const wrapper = createTable(':fit="false"');
      await doubleWait();
      expect(wrapper.classes()).not.toContain('lp-table--fit');
      wrapper.unmount();
    });

    it('show-header', async () => {
      const wrapper = createTable(':show-header="false"');
      await doubleWait();
      expect(wrapper.findAll('.lp-table__header-wrapper').length).toEqual(0);
      wrapper.unmount();
    });

    it('tableRowClassName', async () => {
      const wrapper = createTable(':row-class-name="tableRowClassName"', {
        methods: {
          tableRowClassName({ rowIndex }: { rowIndex: number }) {
            if (rowIndex === 1) {
              return 'info-row';
            } else if (rowIndex === 3) {
              return 'positive-row';
            }

            return '';
          },
        },
      });
      await doubleWait();
      expect(wrapper.findAll('.info-row').length).toEqual(1);
      expect(wrapper.findAll('.positive-row').length).toEqual(1);
      wrapper.unmount();
    });

    it('tableRowStyle[Object]', async () => {
      const wrapper = createTable(':row-style="{ height: \'60px\' }"', {});
      await doubleWait();
      expect(wrapper.find('.lp-table__body tr').attributes('style')).toContain(
        'height: 60px',
      );
      wrapper.unmount();
    });

    it('tableRowStyle[Function]', async () => {
      const wrapper = createTable(':row-style="tableRowStyle"', {
        methods: {
          tableRowStyle({ rowIndex }: { rowIndex: number }) {
            if (rowIndex === 1) {
              return { height: '60px', display: 'none' };
            }

            return null;
          },
        },
      });

      await doubleWait();
      const child1 = wrapper.find('.lp-table__body tr:nth-child(1)');
      const child2 = wrapper.find('.lp-table__body tr:nth-child(2)');
      expect(child1.attributes('style')).toBeUndefined();
      expect(child2.attributes('style')).toContain('height: 60px');
      expect(child2.attributes('style')).toContain('display: none');
      wrapper.unmount();
    });

    it('current-row-key', async () => {
      const wrapper = mount({
        components: {
          LpTable,
          LpTableColumn,
        },
        template: `
        <lp-table :data="testData" row-key="id" highlight-current-row :current-row-key="currentRowKey">
          <lp-table-column prop="name" label="片名" />
          <lp-table-column prop="release" label="发行日期" />
          <lp-table-column prop="director" label="导演" />
          <lp-table-column prop="runtime" label="时长（分）" />
        </lp-table>
      `,
        created() {
          this.testData = getTestData();
        },
        data() {
          return { currentRowKey: null };
        },
      });
      await doubleWait();
      wrapper.vm.currentRowKey = 1;
      const tr = wrapper.find('.lp-table__body-wrapper tbody tr');
      await doubleWait();
      expect(tr.classes()).toContain('current-row');
      wrapper.vm.currentRowKey = 2;

      const rows = wrapper.findAll('.lp-table__body-wrapper tbody tr');
      await doubleWait();
      expect(tr.classes()).not.toContain('current-row');
      expect(rows[1].classes()).toContain('current-row');
      wrapper.unmount();
    });
  });
  describe('filter', () => {
    let wrapper: VueWrapper<ComponentPublicInstance>;

    beforeEach(async () => {
      wrapper = mount({
        components: {
          LpTable,
          LpTableColumn,
        },
        template: `
          <lp-table ref="table" :data="testData" @filter-change="handleFilterChange">
            <lp-table-column prop="name" label="片名" />
            <lp-table-column prop="release" label="发行日期" />
            <lp-table-column
              prop="director"
              column-key="director"
              :filters="[
                { text: 'John Lasseter', value: 'John Lasseter' },
                { text: 'Peter Docter', value: 'Peter Docter' },
                { text: 'Andrew Stanton', value: 'Andrew Stanton' }
              ]"
              :filter-method="filterMethod"
              label="导演" />
            <lp-table-column prop="runtime" label="时长（分）" />
          </lp-table>
        `,

        created() {
          this.testData = getTestData();
        },

        methods: {
          filterMethod(value: any, row: any) {
            return value === row.director;
          },
          handleFilterChange(filters: any) {
            this.filters = filters;
          },
        },
      });
      await doubleWait();
    });

    afterEach(() => wrapper.unmount());

    it('render', () => {
      expect(
        wrapper.find('.lp-table__column-filter-trigger'),
      ).not.toBeUndefined();
    });

    it('click dropdown', async () => {
      const btn = wrapper.find('.lp-table__column-filter-trigger');
      btn.trigger('click');
      await doubleWait();
      const filter = document.body.querySelector('.lp-table-filter');
      expect(filter).not.toBeUndefined();
      filter.remove();
    });

    it('click filter', async () => {
      const btn = wrapper.find('.lp-table__column-filter-trigger');

      btn.trigger('click');
      await doubleWait();
      const filter = document.body.querySelector('.lp-table-filter');

      triggerEvent(filter.querySelector('.lp-checkbox'), 'click', true, false);
      // confrim button
      await doubleWait();
      triggerEvent(
        filter.querySelector('.lp-table-filter__bottom button'),
        'click',
        true,
        false,
      );
      await doubleWait();
      expect(
        (wrapper.vm as ComponentPublicInstance & { filters: any }).filters.director,
      ).toEqual(['John Lasseter']);
      expect(
        wrapper.findAll('.lp-table__body-wrapper tbody tr').length,
      ).toEqual(3);
      filter.remove();
    });

    it('clear filter', async () => {
      const btn = wrapper.find('.lp-table__column-filter-trigger');

      btn.trigger('click');
      await doubleWait();
      const filter = document.body.querySelector('.lp-table-filter');

      triggerEvent(filter.querySelector('.lp-checkbox'), 'click', true, false);
      // confrim button
      await doubleWait();
      triggerEvent(
        filter.querySelector('.lp-table-filter__bottom button'),
        'click',
        true,
        false,
      );
      await nextTick();
      expect(
        wrapper.findAll('.lp-table__body-wrapper tbody tr').length,
      ).toEqual(3);
      wrapper.vm.$refs.table.clearFilter();
      await nextTick();
      expect(
        wrapper.findAll('.lp-table__body-wrapper tbody tr').length,
      ).toEqual(5);
      filter.remove();
    });

    it('click reset', async () => {
      const btn = wrapper.find('.lp-table__column-filter-trigger');
      btn.trigger('click');
      await doubleWait();
      const filter = document.body.querySelector('.lp-table-filter');

      triggerEvent(filter.querySelector('.lp-checkbox'), 'click', true, false);
      await doubleWait();
      triggerEvent(
        filter.querySelectorAll('.lp-table-filter__bottom button')[1],
        'click',
        true,
        false,
      );
      await doubleWait();
      expect(
        (wrapper.vm as ComponentPublicInstance & { filters: any }).filters.director,
      ).toEqual([]);
      expect([
        ...filter.querySelector('.lp-table-filter__bottom button').classList,
      ]).toContain('is-disabled');
      filter.remove();
      wrapper.unmount();
    });
  });

  describe('events', () => {
    const createTable = function (prop = '') {
      return mount({
        components: {
          LpTable,
          LpTableColumn,
        },
        template: `
          <lp-table :data="testData" @${prop}="handleEvent">
            <lp-table-column type="selection" />
            <lp-table-column prop="name" />
            <lp-table-column prop="release" />
            <lp-table-column prop="director" />
            <lp-table-column prop="runtime"/>
          </lp-table>
        `,

        methods: {
          handleEvent(...args) {
            this.result = args;
          },
        },

        data() {
          return { result: '', testData: getTestData() };
        },
      });
    };

    it('select', async () => {
      const wrapper = createTable('select');
      await doubleWait();
      wrapper.findAll('.lp-checkbox')[1].trigger('click');
      expect(wrapper.vm.result.length).toEqual(2);
      expect(wrapper.vm.result[1]).toHaveProperty('name');
      expect(wrapper.vm.result[1].name).toEqual(getTestData()[0].name);
      wrapper.unmount();
    });

    it('selection-change', async () => {
      const wrapper = createTable('selection-change');
      await doubleWait();
      wrapper.findAll('.lp-checkbox')[1].trigger('click');
      expect(wrapper.vm.result.length).toEqual(1);
      wrapper.unmount();
    });

    it('cell-mouse-enter', async () => {
      const wrapper = createTable('cell-mouse-enter');
      await doubleWait();
      const cell = wrapper.findAll('.lp-table__body .cell')[2]; // first row
      triggerEvent(cell.element.parentElement, 'mouseenter');
      expect(wrapper.vm.result.length).toEqual(4); // row, column, cell, event
      expect(wrapper.vm.result[0]).toHaveProperty('name');
      expect(wrapper.vm.result[0].name).toEqual(getTestData()[0].name);
      wrapper.unmount();
    });

    it('cell-mouse-leave', async () => {
      const wrapper = createTable('cell-mouse-leave');
      await doubleWait();
      const cell = wrapper.findAll('.lp-table__body .cell')[7]; // second row
      const cell2 = wrapper.findAll('.lp-table__body .cell')[2]; // first row

      triggerEvent(cell2.element.parentElement, 'mouseenter');
      triggerEvent(cell.element.parentElement, 'mouseleave');
      expect(wrapper.vm.result.length).toEqual(4); // row, column, cell, event
      expect(wrapper.vm.result[0]).toHaveProperty('name');
      expect(wrapper.vm.result[0].name).toEqual(getTestData()[0].name);
      wrapper.unmount();
    });

    it('row-click', async () => {
      const wrapper = createTable('row-click');
      await doubleWait();
      const cell = wrapper.findAll('.lp-table__body .cell')[2]; // first row

      triggerEvent(cell.element.parentElement.parentElement, 'click');
      expect(wrapper.vm.result.length).toEqual(3); // row, event, column
      expect(wrapper.vm.result[0]).toHaveProperty('name');
      expect(wrapper.vm.result[0].name).toEqual(getTestData()[0].name);
      wrapper.unmount();
    });

    it('row-dblclick', async () => {
      const wrapper = createTable('row-dblclick');
      await doubleWait();
      const cell = wrapper.findAll('.lp-table__body .cell')[2]; // first row

      triggerEvent(cell.element.parentElement.parentElement, 'dblclick');
      expect(wrapper.vm.result.length).toEqual(3); // row, event, column
      expect(wrapper.vm.result[0]).toHaveProperty('name');
      expect(wrapper.vm.result[0].name).toEqual(getTestData()[0].name);
      wrapper.unmount();
    });

    it('header-click', async () => {
      const wrapper = createTable('header-click');
      await doubleWait();
      const cell = wrapper.findAll('.lp-table__header th')[1]; // header[prop='name']
      cell.trigger('click');
      expect(wrapper.vm.result.length).toEqual(2); // column, event
      expect(wrapper.vm.result[0].name).toBeUndefined();
      wrapper.unmount();
    });
  });
  describe('summary row', () => {
    it('should render', async () => {
      const wrapper = mount({
        components: {
          LpTable,
          LpTableColumn,
        },
        template: `
          <lp-table :data="testData" show-summary>
            <lp-table-column prop="name" />
            <lp-table-column prop="release"/>
            <lp-table-column prop="director"/>
            <lp-table-column prop="runtime"/>
          </lp-table>
        `,

        created() {
          this.testData = getTestData();
        },
      });

      await doubleWait();
      const footer = wrapper.find('.lp-table__footer');
      expect(footer).not.toBeUndefined();
      const cells = footer.findAll('.cell');
      expect(cells[cells.length - 1].text()).toEqual('459');
      wrapper.unmount();
    });

    it('custom sum text', async () => {
      const wrapper = mount({
        components: {
          LpTable,
          LpTableColumn,
        },
        template: `
          <lp-table :data="testData" show-summary sum-text="Time">
            <lp-table-column prop="name" />
            <lp-table-column prop="release"/>
            <lp-table-column prop="director"/>
            <lp-table-column prop="runtime"/>
          </lp-table>
        `,

        created() {
          this.testData = getTestData();
        },
      });

      await doubleWait();
      const cells = wrapper.findAll('.lp-table__footer .cell');
      expect(cells[0].text()).toEqual('Time');
      wrapper.unmount();
    });

    it('custom summary method', async () => {
      const wrapper = mount({
        components: {
          LpTable,
          LpTableColumn,
        },
        template: `
          <lp-table :data="testData" show-summary :summary-method="getSummary">
            <lp-table-column prop="name" />
            <lp-table-column prop="release"/>
            <lp-table-column prop="director"/>
            <lp-table-column prop="runtime"/>
          </lp-table>
        `,

        created() {
          this.testData = getTestData();
        },

        methods: {
          getSummary(param) {
            const { columns, data } = param;
            const result = [];
            columns.forEach(column => {
              const prop = column.property;
              if (prop === 'release') {
                const dates = data.map(item => item[prop]);
                const releaseYears = dates.map(date =>
                  Number(date.slice(0, 4)),
                );
                result.push(
                  releaseYears.reduce((prev, curr) => {
                    return prev + curr;
                  }),
                );
              } else {
                result.push('');
              }
            });
            return result;
          },
        },
      });

      await doubleWait();
      const cells = wrapper.findAll('.lp-table__footer .cell');
      expect(cells[1].text()).toEqual('9996');
      wrapper.unmount();
    });
  });
  describe('methods', () => {
    const createTable = function (prop = '') {
      return mount({
        components: {
          LpTableColumn,
          LpTable,
        },
        template: `
          <lp-table ref="table" :data="testData" @${prop}="handleEvent">
            <lp-table-column type="selection" />
            <lp-table-column prop="name" />
            <lp-table-column prop="release" />
            <lp-table-column prop="director" />
            <lp-table-column prop="runtime"/>
          </lp-table>
        `,

        methods: {
          handleEvent(selection) {
            this.fireCount++;
            this.selection = selection;
          },
        },

        data() {
          return { selection: null, testData: getTestData(), fireCount: 0 };
        },
      });
    };

    it('toggleRowSelection', () => {
      const wrapper = createTable('selection-change');
      const vm = wrapper.vm;
      vm.$refs.table.toggleRowSelection(vm.testData[0]);
      expect(vm.selection.length).toEqual(1);
      expect(vm.fireCount).toEqual(1);

      // test use second parameter
      vm.$refs.table.toggleRowSelection(vm.testData[0]);
      expect(vm.fireCount).toEqual(2);

      vm.$refs.table.toggleRowSelection(vm.testData[0], false);
      expect(vm.fireCount).toEqual(2);
      expect(vm.selection.length).toEqual(0);

      wrapper.unmount();
    });

    it('toggleAllSelection', async () => {
      const wrapper = createTable('selection-change');
      const vm = wrapper.vm;
      vm.$refs.table.toggleAllSelection();
      await doubleWait();
      expect(vm.selection.length).toEqual(5);

      vm.$refs.table.toggleAllSelection();
      await doubleWait();
      expect(vm.selection.length).toEqual(0);
      wrapper.unmount();
    });

    it('clearSelection', () => {
      const wrapper = createTable('selection-change');
      const vm = wrapper.vm;
      vm.$refs.table.toggleRowSelection(vm.testData[0]);
      expect(vm.selection.length).toEqual(1);
      expect(vm.fireCount).toEqual(1);

      // clear selection
      vm.$refs.table.clearSelection();
      expect(vm.fireCount).toEqual(2);
      expect(vm.selection.length).toEqual(0);

      vm.$refs.table.clearSelection();
      expect(vm.fireCount).toEqual(2);

      wrapper.unmount();
    });
    it('sort', async () => {
      const wrapper = mount({
        components: {
          LpTableColumn,
          LpTable,
        },
        template: `
          <lp-table ref="table" :data="testData" :default-sort = "{prop: 'runtime', order: 'ascending'}">
            <lp-table-column prop="name" />
            <lp-table-column prop="release" />
            <lp-table-column prop="director" />
            <lp-table-column prop="runtime"/>
          </lp-table>
        `,
        data() {
          return { testData: getTestData() };
        },
      });

      const vm = wrapper.vm;
      await doubleWait();
      const lastCells = wrapper.findAll(
        '.lp-table__body-wrapper tbody tr td:last-child',
      );
      expect(lastCells.map(node => node.text())).toEqual([
        '80',
        '92',
        '92',
        '95',
        '100',
      ]);
      await doubleWait();
      vm.testData = vm.testData.map(data =>
        Object.assign(data, { runtime: -data.runtime }),
      );
      vm.$refs.table.sort('runtime', 'ascending');
      await doubleWait();
      expect(lastCells.map(node => node.text())).toEqual([
        '-100',
        '-95',
        '-92',
        '-92',
        '-80',
      ]);
      wrapper.unmount();
    });

    it('sort correct change icon', async () => {
      function assertSortIconCount($el, msg, count = 1) {
        const sortIconCount = $el.querySelectorAll(
          'th.ascending, th.descending',
        ).length;
        expect(sortIconCount).toEqual(count);
      }

      const wrapper = mount({
        components: {
          LpTable,
          LpTableColumn,
        },
        template: `
          <lp-table ref="table" :data="testData" >
            <lp-table-column prop="name" sortable />
            <lp-table-column prop="release" sortable />
            <lp-table-column prop="director" sortable />
            <lp-table-column prop="runtime" sortable />
          </lp-table>
        `,
        data() {
          return { testData: getTestData() };
        },
      });
      const vm = wrapper.vm;
      await doubleWait();
      assertSortIconCount(
        wrapper.element,
        'sorting icon is not empty after mount',
        0,
      );
      // manual click first column header
      const elm = wrapper.find('.caret-wrapper');
      elm.trigger('click');
      await doubleWait();
      assertSortIconCount(
        wrapper.element,
        'sorting icon is not one after click header',
      );
      vm.$refs.table.sort('director', 'descending');
      await doubleWait();
      assertSortIconCount(
        wrapper.element,
        'sorting icon is not one after call sort',
      );
      vm.$refs.table.sort('director', 'ascending');
      await doubleWait();
      assertSortIconCount(
        wrapper.element,
        'sorting icon is not one after sort same column',
      );
      wrapper.unmount();
    });

    // https://github.com/element-plus/element-plus/issues/4589
    it('sort-change event', async () => {
      const handleSortChange = vi.fn();
      const wrapper = mount({
        components: {
          LpTable,
          LpTableColumn,
        },
        template: `
          <lp-table :data="testData" @sort-change="handleSortChange">
          <lp-table-column prop="name" />
          <lp-table-column prop="release" />
          <lp-table-column prop="director" />
          <lp-table-column prop="runtime" sortable ref="runtime" />
          </lp-table>
        `,
        data() {
          return { testData: getTestData() };
        },
        methods: {
          handleSortChange,
        },
      });
      await doubleWait();
      const elm = wrapper.find('.caret-wrapper');

      elm.trigger('click');
      expect(handleSortChange).toHaveBeenLastCalledWith({
        column: expect.any(Object),
        prop: 'runtime',
        order: 'ascending',
      });

      elm.trigger('click');
      expect(handleSortChange).toHaveBeenLastCalledWith({
        column: expect.any(Object),
        prop: 'runtime',
        order: 'descending',
      });

      elm.trigger('click');
      expect(handleSortChange).toHaveBeenLastCalledWith({
        column: expect.any(Object),
        prop: 'runtime',
        order: null,
      });
    });

    it('setCurrentRow', async () => {
      const wrapper = mount({
        components: {
          LpTable,
          LpTableColumn,
        },
        template: `
        <div>
          <lp-table ref="table" :data="testData" highlight-current-row>
            <lp-table-column prop="name" sortable />
            <lp-table-column prop="release" sortable />
            <lp-table-column prop="director" sortable />
            <lp-table-column prop="runtime" sortable />
          </lp-table>
          <button class="clear" @click="clear">clear</button>
        </div>
        `,
        data() {
          return { testData: getTestData() };
        },
        methods: {
          clear() {
            this.$refs.table.setCurrentRow();
          },
        },
      });
      const vm = wrapper.vm;

      vm.$refs.table.setCurrentRow(vm.testData[1]);
      await doubleWait();
      const secondRow = vm.$el.querySelectorAll('.lp-table__row')[1];
      expect([...secondRow.classList]).toContain('current-row');

      vm.$el.querySelector('.clear').click();
      await doubleWait();
      expect([...secondRow.classList]).not.toContain('current-row');

      wrapper.unmount();
    });
  });

  it('hover', async () => {
    const wrapper = mount({
      components: {
        LpTable,
        LpTableColumn,
      },
      template: `
        <lp-table :data="testData">
          <lp-table-column prop="name" label="片名" fixed />
          <lp-table-column prop="release" label="发行日期" />
          <lp-table-column prop="director" label="导演" />
          <lp-table-column prop="runtime" label="时长（分）" />
        </lp-table>
      `,
      data() {
        return {
          testData: getTestData(),
        };
      },
    });
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

  it('highlight-current-row', async () => {
    const wrapper = mount({
      components: {
        LpTable,
        LpTableColumn,
      },
      template: `
        <lp-table :data="testData" highlight-current-row>
          <lp-table-column prop="name" label="片名" />
          <lp-table-column prop="release" label="发行日期" />
          <lp-table-column prop="director" label="导演" />
          <lp-table-column prop="runtime" label="时长（分）" sortable />
        </lp-table>
      `,

      created() {
        this.testData = getTestData();
      },
    });
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

  it('keep highlight row when data change', async () => {
    const wrapper = mount({
      components: {
        LpTable,
        LpTableColumn,
      },
      template: `
        <lp-table :data="testData" highlight-current-row row-key="release">
          <lp-table-column prop="name" label="片名" />
          <lp-table-column prop="release" label="发行日期" />
          <lp-table-column prop="director" label="导演" />
          <lp-table-column prop="runtime" label="时长（分）" sortable />
        </lp-table>
      `,
      data() {
        return {
          testData: getTestData(),
        };
      },
    });
    const vm = wrapper.vm;
    await doubleWait();
    let rows = vm.$el.querySelectorAll('.lp-table__body-wrapper tbody tr');
    triggerEvent(rows[2], 'click', true, false);
    await doubleWait();
    expect([...rows[2].classList]).toContain('current-row');
    const data = getTestData();
    data.splice(0, 0, {
      id: 8,
      name: 'Monsters, Inc.',
      release: '2018-02-01',
      director: 'Peter Docter',
      runtime: 92,
    });
    data[2].name = 'Modified Name';
    vm.testData = data;

    await doubleWait();
    rows = vm.$el.querySelectorAll('.lp-table__body-wrapper tbody tr');
    expect([...rows[3].classList]).toContain('current-row');
    wrapper.unmount();
  });

  it('keep highlight row after sort', async () => {
    const wrapper = mount({
      components: {
        LpTable,
        LpTableColumn,
      },
      template: `
        <lp-table :data="testData" row-key="release" highlight-current-row >
          <lp-table-column prop="name" label="片名" />
          <lp-table-column prop="release" label="发行日期" />
          <lp-table-column prop="director" label="导演" />
          <lp-table-column prop="runtime" label="时长（分）" sortable />
        </lp-table>
      `,
      data() {
        return {
          testData: getTestData(),
        };
      },
    });
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

  it('table append is visible in viewport if height is 100%', async () => {
    const wrapper = mount({
      components: {
        LpTable,
        LpTableColumn,
      },
      template: `
      <lp-table :data="[]" height="100%">
        <lp-table-column prop="name" label="片名" />
        <lp-table-column prop="release" label="发行日期" />
        <lp-table-column prop="director" label="导演" />
        <lp-table-column prop="runtime" label="时长（分）" />
        <template #append>
          <div class="append-content" style="height: 48px;">
            append 区域始终出现在视图内
          </div>
        </template>
      </lp-table>
      `,
    });
    await doubleWait();
    const emptyBlockEl = wrapper.find('.lp-table__empty-block');
    expect(emptyBlockEl.attributes('style')).toContain('height: 100%');
    wrapper.unmount();
  });

  describe('rowKey & index', () => {
    it('key type is string', async () => {
      const wrapper = mount({
        components: {
          LpTable,
          LpTableColumn,
        },
        template: `
          <lp-table :data="testData" row-key="release" highlight-current-row >
            <lp-table-column type="index" />
            <lp-table-column prop="name" label="片名" />
            <lp-table-column prop="release" label="发行日期" />
            <lp-table-column prop="director" label="导演" />
            <lp-table-column prop="runtime" label="时长（分）" sortable />
          </lp-table>
        `,
        data() {
          return {
            testData: getTestData(),
          };
        },
      });
      await doubleWait();
      const rows = wrapper.findAll('.lp-table__row');
      rows.forEach((row, index) => {
        const cell = row.find('td');
        expect(cell.text()).toMatch(`${index + 1}`);
      });
    });
    it('with expand row', async () => {
      const wrapper = mount({
        components: {
          LpTable,
          LpTableColumn,
        },
        template: `
          <lp-table :data="testData" row-key="release" highlight-current-row >
            <lp-table-column type="index" />
            <lp-table-column type="expand">
              <template #default="props">
                <span class="index">{{ props.$index }}</span>
                <span class="director">{{ props.row.director }}</span>
              </template>
            </lp-table-column>
            <lp-table-column prop="name" label="片名" />
            <lp-table-column prop="release" label="发行日期" />
            <lp-table-column prop="director" label="导演" />
            <lp-table-column prop="runtime" label="时长（分）" sortable />
          </lp-table>
        `,
        data() {
          return {
            testData: getTestData(),
          };
        },
      });
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
    it('render tree structual data', async () => {
      wrapper = mount({
        components: {
          LpTableColumn,
          LpTable,
        },
        template: `
          <lp-table :data="testData" row-key="release">
            <lp-table-column prop="name" label="片名" />
            <lp-table-column prop="release" label="发行日期" />
            <lp-table-column prop="director" label="导演" />
            <lp-table-column prop="runtime" label="时长（分）" />
          </lp-table>
        `,
        data() {
          const testData = getTestData() as any;
          testData[1].children = [
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
          ];
          return {
            testData,
          };
        },
      });
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

    it('load substree row data', async () => {
      wrapper = mount({
        components: {
          LpTable,
          LpTableColumn,
        },
        template: `
          <lp-table :data="testData" row-key="release" lazy :load="load">
            <lp-table-column prop="name" label="片名" />
            <lp-table-column prop="release" label="发行日期" />
            <lp-table-column prop="director" label="导演" />
            <lp-table-column prop="runtime" label="时长（分）" />
          </lp-table>
        `,
        data() {
          const testData = getTestData() as any;
          testData[testData.length - 1].children = [
            {
              name: "A Bug's Life copy 1",
              release: '2008-1-25-1',
              director: 'John Lasseter',
              runtime: 95,
            },
          ];
          testData[1].hasChildren = true;
          return {
            testData,
          };
        },
        methods: {
          load(row, treeNode, resolve) {
            resolve([
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
          },
        },
      });
      await doubleWait();
      const expandIcon = wrapper.find('.lp-table__expand-icon');
      expandIcon.trigger('click');

      await doubleWait();
      expect(expandIcon.classes()).toContain('lp-table__expand-icon--expanded');
      expect(wrapper.findAll('.lp-table__row').length).toEqual(8);
    });

    it('tree-props & default-expand-all & expand-change', async () => {
      const spy = vi.fn();
      wrapper = mount({
        components: {
          LpTable,
          LpTableColumn,
        },
        template: `
          <lp-table
            :data="testData" lazy default-expand-all row-key="release" :tree-props="{children: 'childrenTest', hasChildren: 'hasChildrenTest'}"
            :load="load" @expand-change="change">
            <lp-table-column prop="name" label="片名" />
            <lp-table-column prop="release" label="发行日期" />
            <lp-table-column prop="director" label="导演" />
            <lp-table-column prop="runtime" label="时长（分）" />
          </lp-table>
        `,
        data() {
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
          return {
            testData,
          };
        },
        methods: {
          load(row, treeNode, resolve) {
            resolve([
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
          },
          change: spy,
        },
      });
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
      expect(spy.mock.calls[0][0]).toBeInstanceOf(Object);
      expect(spy.mock.calls[0][1]).toBeTruthy();
    });

    it('expand-row-keys & toggleRowExpansion', async () => {
      wrapper = mount({
        components: {
          LpTable,
          LpTableColumn,
        },
        template: `
          <lp-table :data="testData" row-key="release" lazy :load="load" :expand-row-keys="['2003-5-30']" ref="table">
            <lp-table-column prop="name" label="片名" />
            <lp-table-column prop="release" label="发行日期" />
            <lp-table-column prop="director" label="导演" />
            <lp-table-column prop="runtime" label="时长（分）" />
          </lp-table>
        `,
        data() {
          const testData = getTestData() as any;
          testData[testData.length - 1].children = [
            {
              name: "A Bug's Life copy 1",
              release: '2003-5-30-1',
              director: 'John Lasseter',
              runtime: 95,
              hasChildren: true,
            },
          ];
          return {
            testData,
          };
        },
        methods: {
          load(row, treeNode, resolve) {
            resolve([
              {
                name: "A Bug's Life copy 1",
                release: '2003-5-30-2',
                director: 'John Lasseter',
                runtime: 95,
              },
            ]);
          },
          closeExpandRow() {
            const testData = this.testData;
            const row = testData[testData.length - 1].children[0];
            this.$refs.table.toggleRowExpansion(row);
          },
        },
      });
      await doubleWait();
      const childRows = wrapper.findAll('.lp-table__row--level-1');
      childRows.forEach(item => {
        expect(item.attributes('style')).toBeUndefined();
      });
      const expandIcon = childRows[0].find('.lp-table__expand-icon');
      expandIcon.trigger('click');
      await doubleWait();
      expect(expandIcon.classes()).toContain('lp-table__expand-icon--expanded')
      ;(wrapper.vm as any).closeExpandRow();
      await doubleWait();
      expect(expandIcon.classes()).not.toContain(
        'lp-table__expand-icon--expanded',
      );
    });

    it('v-if on lp-table-column should patch correctly', async () => {
      wrapper = mount({
        components: {
          LpTable,
          LpTableColumn,
        },
        template: `
          <div>
            <button @click="hideName">hide name column</button>
            <lp-table :data="testData">
              <lp-table-column key="name" label="片名" v-if="showName">
                <template #default="{ row }"><span class="name">{{ row.name }}</span></template>
              </lp-table-column>
              <lp-table-column key="release" label="发行日期" >
                <template #default="{ row }"><span class="release">{{ row.release }}</span></template>
              </lp-table-column>
            </lp-table>
          </div>
        `,
        data() {
          return {
            testData: getTestData() as any,
            showName: true,
          };
        },
        methods: {
          hideName() {
            this.showName = false;
          },
        },
      });
      await doubleWait();
      const firstCellSpanBeforeHide = wrapper.find('.lp-table__body tr td span');
      expect(firstCellSpanBeforeHide.classes().includes('name')).toBeTruthy();
      wrapper.find('button').trigger('click');
      await doubleWait();
      const firstCellSpanAfterHide = wrapper.find('.lp-table__body tr td span');
      expect(firstCellSpanAfterHide.classes().includes('release')).toBeTruthy();
    });
  });

  it('when tableLayout is auto', async () => {
    const wrapper = mount({
      components: {
        LpTable,
        LpTableColumn,
      },
      template: `
      <lp-table :data="testData" table-layout="auto">
        <lp-table-column prop="id" />
        <lp-table-column prop="name" label="片名" />
        <lp-table-column prop="release" label="发行日期" />
        <lp-table-column prop="director" label="导演" />
        <lp-table-column prop="runtime" label="时长（分）" />
      </lp-table>
      `,
      created() {
        this.testData = getTestData();
      },
    });
    await doubleWait();
    expect(wrapper.find('.lp-table__body thead').exists()).toBeTruthy();
    expect(wrapper.find('.lp-table__body colgroup col').exists()).toBeFalsy();
    expect(wrapper.find('.lp-table__body tbody').exists()).toBeTruthy();
  });

  it('automatic minimum size of flex-items', async () => {
    const wrapper = mount({
      components: {
        LpTable,
        LpTableColumn,
      },
      template: `
        <div class="right">
          <lp-table flexible :data="testData" table-layout="auto">
            <lp-table-column prop="id" />
            <lp-table-column prop="name" label="片名" />
            <lp-table-column prop="release" label="发行日期" />
            <lp-table-column prop="director" label="导演" />
            <lp-table-column prop="runtime" label="时长（分）" />
          </lp-table>
        </div>
      `,
      created() {
        this.testData = getTestData();
      },
    });
    await nextTick();
    expect(wrapper.find('.right').element.getAttribute('style')).toContain(
      'min-width: 0',
    );
  });
  it('selectable tree', async () => {
    const wrapper = mount({
      components: {
        LpTable,
        LpTableColumn,
      },
      template: `
            <lp-table :data="testData" @selection-change="change">
              <lp-table-column type="selection" />
              <lp-table-column prop="name" label="name" />
              <lp-table-column prop="release" label="release" />
              <lp-table-column prop="director" label="director" />
              <lp-table-column prop="runtime" label="runtime" />
            </lp-table>
          `,
      data() {
        const testData = getTestData() as any;
        testData[1].children = [
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
        ];
        return {
          testData,
          selected: [],
        };
      },

      methods: {
        change(rows) {
          this.selected = rows;
        },
      },
    });
    await doubleWait();
    wrapper.findAll('.lp-checkbox')[2].trigger('click');
    await doubleWait();
    expect(wrapper.vm.selected.length).toEqual(3);
  });
});
