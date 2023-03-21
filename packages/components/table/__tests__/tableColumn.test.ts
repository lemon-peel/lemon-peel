
import { describe, expect, test, vi } from 'vitest';
import triggerEvent from '@lemon-peel/test-utils/triggerEvent';
import LpTable from '../src/table/Table.vue';
import LpTableColumn from '../src/tableColumn';
import { doubleWait, getTestData, doMount } from './tableTestCommon';

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

describe('table column', () => {
  describe('column attributes', () => {
    const createTable = function (
      props1?: string,
      props2?: string,
      props3?: string,
      props4?: string,
      opts?: Record<string, any>,
      tableProps?: string,
    ) {
      return doMount(
        Object.assign(
          {
            components: {
              LpTable,
              LpTableColumn,
            },
            template: `
          <lp-table :data="testData" ${tableProps || ''}>
            <lp-table-column prop="name" ${props1 || ''} />
            <lp-table-column prop="release" ${props2 || ''} />
            <lp-table-column prop="director" ${props3 || ''} />
            <lp-table-column prop="runtime" ${props4 || ''} />
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

    test('label', async () => {
      const wrapper = createTable('label="啊哈哈哈"', 'label="啊啦啦啦"');
      await doubleWait();
      const ths = wrapper
        .findAll('thead th')
        .map(node => node.text())
        .filter(Boolean);

      expect(ths).toEqual(['啊哈哈哈', '啊啦啦啦']);
      wrapper.unmount();
    });

    test('width', async () => {
      const wrapper = createTable('width="123px"', ':width="102"', 'width="39"');
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
      const wrapper = createTable(
        'fixed label="test1" width="100px"',
        'fixed="right" label="test2"',
        'fixed="left" label="test3"',
      );
      await doubleWait();
      const leftFixedHeaderColumns = wrapper.findAll(
        '.lp-table__header .lp-table-fixed-column--left',
      );
      const leftFixedBodyColumns = wrapper.findAll(
        '.lp-table__body .lp-table-fixed-column--left',
      );
      const rightFixedHeaderColumns = wrapper.findAll(
        '.lp-table__header .lp-table-fixed-column--right',
      );
      const rightFixedBodyColumns = wrapper.findAll(
        '.lp-table__body .lp-table-fixed-column--right',
      );
      expect(leftFixedHeaderColumns).toHaveLength(2);
      expect(leftFixedBodyColumns).toHaveLength(10);
      expect(rightFixedHeaderColumns).toHaveLength(1);
      expect(rightFixedBodyColumns).toHaveLength(5);
      expect(leftFixedHeaderColumns.at(0)!.text()).toBe('test1');
      expect(leftFixedHeaderColumns.at(1)!.text()).toBe('test3');
      expect(leftFixedHeaderColumns.at(1)!.classes()).toContain('is-last-column');
      expect(rightFixedHeaderColumns.at(0)!.text()).toBe('test2');
      expect(rightFixedHeaderColumns.at(0)!.classes()).toContain(
        'is-first-column',
      );
      expect(getComputedStyle(leftFixedHeaderColumns.at(0)!.element).left).toBe(
        '0px',
      );
      expect(getComputedStyle(leftFixedHeaderColumns.at(1)!.element).left).toBe(
        '100px',
      );
      expect(
        getComputedStyle(rightFixedHeaderColumns.at(0)!.element).right,
      ).toBe('0px');
      wrapper.unmount();
    });

    test('resizable', async () => {
      const wrapper = createTable(
        'resizable',
        ':resizable="false"',
        '',
        '',
        {},
        'border',
      );
      await doubleWait();
      const firstCol = wrapper.find('thead th');
      triggerEvent(firstCol.element, 'mousemove');
      triggerEvent(firstCol.element, 'mousedown');
      wrapper.unmount();
    });

    test('formatter', async () => {
      const wrapper = createTable(':formatter="renderCell"', '', '', '', {
        methods: {
          renderCell(row: any) {
            return `[${row.name}]`;
          },
        },
      });

      await doubleWait();
      const cells = wrapper.findAll(
        '.lp-table__body-wrapper tbody tr td:first-child',
      );
      expect(cells.map(n => n.text())).toEqual(
        getTestData().map(o => `[${o.name}]`),
      );
      wrapper.unmount();
    });

    test('show-overflow-tooltip', async () => {
      const wrapper = createTable('show-overflow-tooltip');
      await doubleWait();
      expect(wrapper.findAll('.lp-tooltip').length).toEqual(5);
      wrapper.unmount();
    });

    test('show-tooltip-when-overflow', async () => {
      // old version prop name
      const wrapper = createTable('show-tooltip-when-overflow');
      await doubleWait();
      expect(wrapper.findAll('.lp-tooltip').length).toEqual(5);
      wrapper.unmount();
    });

    test('align', async () => {
      const wrapper = createTable(
        'align="left"',
        'align="right"',
        'align="center"',
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
        'class-name="column-1"',
        'class-name="column-2 column-class-a"',
        'class-name="column-class-a"',
      );
      await doubleWait();
      const len = getTestData().length + 1;
      expect(wrapper.findAll('.column-1').length).toEqual(len);
      expect(wrapper.findAll('.column-2').length).toEqual(len);
      expect(wrapper.findAll('.column-class-a').length).toEqual(len * 2);
      wrapper.unmount();
    });

    test('selectable === false & check selectAll status', async () => {
      const wrapper = doMount({
        components: {
          LpTable,
          LpTableColumn,
        },
        template: `
          <lp-table :data="testData" @selection-change="change">
            <lp-table-column type="selection" :selectable="filterSelect" />
            <lp-table-column prop="name" label="name" />
            <lp-table-column prop="release" label="release" />
            <lp-table-column prop="director" label="director" />
            <lp-table-column prop="runtime" label="runtime" />
          </lp-table>
        `,

        data() {
          return { selected: [], testData: getTestData() };
        },

        methods: {
          change(this: any, rows: any[]) {
            this.selected = rows;
          },

          filterSelect() {
            return false;
          },
        },
      });

      await doubleWait();
      expect(wrapper.find('.lp-checkbox').attributes('checked')).toBeFalsy();
      await doubleWait();
      expect(wrapper.vm.selected.length).toEqual(0);
      wrapper.unmount();
    });

    describe('type', () => {
      const createTable = function (type: string) {
        return doMount({
          components: {
            LpTable,
            LpTableColumn,
          },
          template: `
            <lp-table :data="testData" @selection-change="change">
              <lp-table-column type="${type}" />
              <lp-table-column prop="name" label="name" />
              <lp-table-column prop="release" label="release" />
              <lp-table-column prop="director" label="director" />
              <lp-table-column prop="runtime" label="runtime" />
            </lp-table>
          `,

          created() {
            this.testData = getTestData();
          },

          data() {
            return { selected: [] };
          },

          methods: {
            change(this: any, rows: any[]) {
              this.selected = rows;
            },
          },
        });
      };

      describe('= selection', () => {
        const wrapper = createTable('selection');

        test('render', async () => {
          await doubleWait();
          expect(wrapper.findAll('.lp-checkbox').length).toEqual(
            getTestData().length + 1,
          );
        });

        test('select all', async () => {
          wrapper.find('.lp-checkbox').trigger('click');
          await doubleWait();
          expect(wrapper.vm.selected.length).toEqual(5);
          wrapper.unmount();
        });

        test('select one', async () => {
          const wrapper2 = createTable('selection');

          await doubleWait();
          wrapper2.findAll('.lp-checkbox')[1].trigger('click');

          await doubleWait();
          expect(wrapper2.vm.selected.length).toEqual(1);
          expect(wrapper2.vm.selected[0].name).toEqual(getTestData()[0].name);
          wrapper2.unmount();
        });
      });

      describe('= index', () => {
        const wrapper = createTable('index');

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
        const createInstance = function (extra = '') {
          return doMount({
            components: {
              LpTableColumn,
              LpTable,
            },
            template: `
            <lp-table row-key="id" :data="testData" @expand-change="handleExpand" ${extra}>
              <lp-table-column type="expand">
                <template #default="props">
                  <div>{{props.row.name}}</div>
                </template>
              </lp-table-column>
              <lp-table-column prop="release" label="release" />
              <lp-table-column prop="director" label="director" />
              <lp-table-column prop="runtime" label="runtime" />
            </lp-table>
          `,

            data() {
              return {
                expandCount: 0,
                expandRowKeys: [],
                testData: getTestData(),
              };
            },

            methods: {
              handleExpand(this: any) {
                this.expandCount++;
              },
              refreshData(this: any) {
                this.testData = getTestData();
              },
            },
          });
        };

        test('works', async () => {
          const wrapper = createInstance();
          await doubleWait();
          expect(wrapper.findAll('td.lp-table__expand-column').length).toEqual(
            5,
          );
          wrapper.unmount();
        });
      });
    });

    describe('sortable', () => {
      test('render', async () => {
        const wrapper = createTable('', '', '', 'sortable');
        await doubleWait();
        expect(wrapper.findAll('.caret-wrapper').length).toEqual(1);
        wrapper.unmount();
      });

      test('sortable orders', async () => {
        const wrapper = createTable(
          '',
          '',
          '',
          "sortable :sort-orders=\"['descending', 'ascending']\"",
          {},
        );

        await doubleWait();
        const elm = wrapper.find('.caret-wrapper');
        elm.trigger('click');

        await doubleWait();
        const lastCells = wrapper.findAll(
          '.lp-table__body-wrapper tbody tr td:last-child',
        );
        expect(lastCells.map(node => node.text())).toEqual([
          '100',
          '95',
          '92',
          '92',
          '80',
        ]);
        wrapper.unmount();
      });

      test('sortable method', async () => {
        const wrapper = createTable(
          'sortable :sort-method="sortMethod"',
          '',
          '',
          '',
          {
            methods: {
              sortMethod(a: any, b: any) {
                // sort method should return number
                if (a.runtime < b.runtime) {
                  return 1;
                }
                if (a.runtime > b.runtime) {
                  return -1;
                }
                return 0;
              },
            },
          },
        );

        await doubleWait();
        const elm = wrapper.find('.caret-wrapper');
        elm.trigger('click');

        await doubleWait();
        const lastCells = wrapper.findAll(
          '.lp-table__body-wrapper tbody tr td:last-child',
        );
        expect(lastCells.map(node => node.text())).toEqual([
          '100',
          '95',
          '92',
          '92',
          '80',
        ]);
        wrapper.unmount();
      });

      test('sortable by method', async () => {
        const wrapper = createTable('sortable :sort-by="sortBy"', '', '', '', {
          methods: {
            sortBy(a: any) {
              return -a.runtime;
            },
          },
        });

        await doubleWait();
        const elm = wrapper.find('.caret-wrapper');
        elm.trigger('click');

        await doubleWait();
        const lastCells = wrapper.findAll(
          '.lp-table__body-wrapper tbody tr td:last-child',
        );
        expect(lastCells.map(node => node.text())).toEqual([
          '100',
          '95',
          '92',
          '92',
          '80',
        ]);
        wrapper.unmount();
      });

      test('sortable by property', async () => {
        const wrapper = createTable(
          'sortable sort-by="runtime"',
          '',
          '',
          '',
          {},
        );

        await doubleWait();
        const elm = wrapper.find('.caret-wrapper');
        elm.trigger('click');

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
        wrapper.unmount();
      });
    });

    describe('click sortable column', () => {
      const wrapper = createTable('', '', '', 'sortable');

      test('ascending', async () => {
        const elm = wrapper.find('.caret-wrapper');

        elm.trigger('click');
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
      });

      test('descending', async () => {
        const elm = wrapper.find('.caret-wrapper');

        elm.trigger('click');
        await doubleWait();
        const lastCells = wrapper.findAll(
          '.lp-table__body-wrapper tbody tr td:last-child',
        );
        expect(lastCells.map(node => node.text())).toEqual([
          '100',
          '95',
          '92',
          '92',
          '80',
        ]);
        wrapper.unmount();
      });
    });

    test('change column configuration', async () => {
      const wrapper = doMount({
        components: {
          LpTable,
          LpTableColumn,
        },
        template: `
          <template>
            <button
              id="addBut"
              @click="
                () => {
                  cols.push('b')
                }
              "
              >+</button>
            <button
              id="delBut"
              @click="
                () => {
                  cols.pop()
                }
              "
              >-</button>
            <lp-table :data="data">
              <lp-table-column
                v-for="item of cols"
                :prop="item"
                :label="item"
                :key="item"
              ></lp-table-column>
            </lp-table>
          </template>
        `,

        data() {
          return { cols: ['a', 'v', 'b'], data: [{ a: 1, v: 2, b: 3 }] };
        },
      });

      await doubleWait();
      expect(wrapper.findAll('.lp-table__header-wrapper th').length).toEqual(3);
      const addBut = wrapper.find('#addBut');
      const delBut = wrapper.find('#delBut');
      addBut.trigger('click');
      await doubleWait();
      expect(wrapper.findAll('.lp-table__header-wrapper th').length).toEqual(4);
      addBut.trigger('click');
      await doubleWait();
      expect(wrapper.findAll('.lp-table__header-wrapper th').length).toEqual(5);
      delBut.trigger('click');
      await doubleWait();
      expect(wrapper.findAll('.lp-table__header-wrapper th').length).toEqual(4);
      delBut.trigger('click');
      await doubleWait();
      expect(wrapper.findAll('.lp-table__header-wrapper th').length).toEqual(3);
    });
  });

  describe('multi level column', () => {
    test('should works', async () => {
      const wrapper = doMount({
        components: {
          LpTable,
          LpTableColumn,
        },
        template: `
          <lp-table :data="testData">
            <lp-table-column prop="name" />
            <lp-table-column label="group">
              <lp-table-column prop="release"/>
              <lp-table-column prop="director"/>
            </lp-table-column>
            <lp-table-column prop="runtime"/>
          </lp-table>
        `,

        created() {
          this.testData = null;
        },
      });

      await doubleWait();
      const trs = wrapper.findAll('.lp-table__header tr');
      expect(trs.length).toEqual(2);
      const firstRowHeader = trs[0].findAll('th .cell').length;
      const secondRowHeader = trs[1].findAll('th .cell').length;
      expect(firstRowHeader).toEqual(3);
      expect(secondRowHeader).toEqual(2);

      expect(trs[0].find('th:first-child').attributes('rowspan')).toEqual('2');
      expect(trs[0].find('th:nth-child(2)').attributes('colspan')).toEqual('2');
      wrapper.unmount();
    });

    test('should works', async () => {
      const wrapper = doMount({
        components: {
          LpTable,
          LpTableColumn,
        },
        template: `
          <lp-table :data="testData">
            <lp-table-column prop="name" />
            <lp-table-column label="group">
              <lp-table-column label="group's group">
                <lp-table-column prop="release" />
                <lp-table-column prop="runtime"/>
              </lp-table-column>
              <lp-table-column prop="director" />
            </lp-table-column>
            <lp-table-column prop="runtime"/>
          </lp-table>
        `,

        created() {
          this.testData = null;
        },
      });

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

      wrapper.unmount();
    });

    test('should work in one column', async () => {
      const wrapper = doMount({
        components: {
          LpTable,
          LpTableColumn,
        },
        template: `
          <lp-table :data="testData">
            <lp-table-column label="group">
              <lp-table-column prop="release"/>
            </lp-table-column>
          </lp-table>
        `,

        created() {
          this.testData = null;
        },
      });

      await doubleWait();
      const trs = wrapper.findAll('.lp-table__header tr');
      expect(trs.length).toEqual(2);
      const firstRowLength = trs[0].findAll('th .cell').length;
      const secondRowLength = trs[1].findAll('th .cell').length;
      expect(firstRowLength).toEqual(1);
      expect(secondRowLength).toEqual(1);

      expect(trs[0].find('th:first-child').attributes('rowspan')).toEqual('1');
      expect(trs[0].find('th:first-child').attributes('colspan')).toEqual('1');
      wrapper.unmount();
    });

    test('should work with fixed', async () => {
      const wrapper = doMount({
        components: {
          LpTable,
          LpTableColumn,
        },
        template: `
          <lp-table :data="testData">
            <lp-table-column prop="name" />
            <lp-table-column label="group" fixed="left">
              <lp-table-column label="group's group">
                <lp-table-column prop="runtime" width="100" fixed="right"/>
                <lp-table-column prop="director" width="100" fixed="right"/>
              </lp-table-column>
              <lp-table-column prop="director"/>
            </lp-table-column>
            <lp-table-column prop="director"/>
            <lp-table-column prop="runtime"/>
            <lp-table-column label="group2" fixed="right">
              <lp-table-column prop="runtime" width="100" fixed="left"/>
              <lp-table-column prop="director" width="50"/>
            </lp-table-column>
            <lp-table-column prop="runtime"/>
          </lp-table>
        `,

        created() {
          this.testData = getTestData();
        },
      });

      await doubleWait();
      const lfhcolumns = wrapper
        .findAll('.lp-table__header tr')
        .map(item => item.findAll('.lp-table-fixed-column--left'));
      const lfbcolumns = wrapper.findAll(
        '.lp-table__body .lp-table-fixed-column--left',
      );
      const rfhcolumns = wrapper
        .findAll('.lp-table__header tr')
        .map(item => item.findAll('.lp-table-fixed-column--right'));
      const rfbcolumns = wrapper.findAll(
        '.lp-table__body .lp-table-fixed-column--right',
      );
      expect(lfbcolumns).toHaveLength(15);
      expect(rfbcolumns).toHaveLength(10);
      expect(lfhcolumns.at(0)!.at(0)!.classes()).toContain('is-last-column');
      expect(lfhcolumns.at(1)!.at(1)!.classes()).toContain('is-last-column');
      expect(getComputedStyle(lfhcolumns.at(1)!.at(1)!.element).left).toBe(
        '200px',
      );
      expect(getComputedStyle(lfhcolumns.at(2)!.at(1)!.element).left).toBe(
        '100px',
      );
      expect(rfhcolumns.at(0)!.at(0)!.classes()).toContain('is-first-column');
      expect(rfhcolumns.at(1)!.at(0)!.classes()).toContain('is-first-column');
      expect(getComputedStyle(rfhcolumns.at(1)!.at(0)!.element).right).toBe(
        '50px',
      );
      wrapper.unmount();
    });

    test('lp-table-column should callback itself', async () => {
      const TableColumn = {
        name: 'TableColumn',
        components: {
          LpTableColumn,
        },
        props: {
          item: Object,
        },
        template: `
          <lp-table-column :prop="item.prop" :label="item.label">
            <template v-if="item.children" #default>
              <table-column v-for="c in item.children" :key="c.prop" :item="c"/>
            </template>
          </lp-table-column>
        `,
      };
      const App = {
        template: `
          <lp-table :data="data">
            <table-column v-for="item in column" :key="item.prop" :item="item"/>
          </lp-table>
        `,
        components: {
          LpTable,
          LpTableColumn,
          TableColumn,
        },
        setup() {
          const column = [
            { label: '日期', prop: 'date' },
            {
              label: '用户',
              prop: 'user',
              children: [
                { label: '姓名', prop: 'name' },
                { label: '地址', prop: 'address' },
              ],
            },
          ];
          const data = [
            {
              date: '2016-05-03',
              name: 'Tom',
              address: 'No. 189, Grove St, Los Angeles',
            },
            {
              date: '2016-05-02',
              name: 'Tom',
              address: 'No. 189, Grove St, Los Angeles',
            },
            {
              date: '2016-05-04',
              name: 'Tom',
              address: 'No. 189, Grove St, Los Angeles',
            },
            {
              date: '2016-05-01',
              name: 'Tom',
              address: 'No. 189, Grove St, Los Angeles',
            },
          ];
          return {
            column,
            data,
          };
        },
      };
      const wrapper = doMount(App);
      await doubleWait();
      expect(wrapper.find('.lp-table__header-wrapper').text()).toMatch('姓名');
      expect(wrapper.find('.lp-table__header-wrapper').text()).toMatch('地址');
    });

    test('should not rendered other components in hidden-columns', async () => {
      const Comp = {
        template: `
          <div class="other-component"></div>
        `,
      };
      const wrapper = doMount({
        components: {
          LpTableColumn,
          LpTable,
          Comp,
        },
        template: `
          <lp-table :data="testData">
            <lp-table-column prop="name">
              <comp></comp>
            </lp-table-column>
          </lp-table>
        `,
        data() {
          return {
            testData: getTestData(),
          };
        },
      });
      await doubleWait();
      expect(
        wrapper.find('.hidden-columns').find('.other-component').exists(),
      ).toBeFalsy();
    });

    test('should not rendered text in hidden-columns', async () => {
      const TableColumn = {
        name: 'TableColumn',
        components: {
          LpTableColumn,
        },
        template: `
          <lp-table-column>
            <template v-if="$slots.default" #default="scope">
              <slot v-bind="scope" />
            </template>
          </lp-table-column>
        `,
      };
      const wrapper = doMount({
        components: {
          LpTableColumn,
          LpTable,
          TableColumn,
        },
        template: `
          <lp-table :data="testData">
            <table-column>
              <template #default="{ row }">Hello World</template>
            </table-column>
          </lp-table>
        `,
        data() {
          return {
            testData: getTestData(),
          };
        },
      });
      await doubleWait();
      expect(wrapper.find('.hidden-columns').text().trim()).not.toContain(
        'Hello World',
      );
    });
  });

  describe('dynamic column attribtes', () => {
    test('label', async () => {
      const wrapper = doMount({
        components: {
          LpTable,
          LpTableColumn,
        },
        template: `
          <lp-table :data="testData">
            <lp-table-column prop="name" :label="label"/>
            <lp-table-column prop="release" />
            <lp-table-column prop="director" />
            <lp-table-column prop="runtime" />
          </lp-table>
        `,
        data() {
          return {
            label: 'name',
          };
        },

        created() {
          this.testData = getTestData();
        },
      });

      await doubleWait();
      expect(wrapper.find('.lp-table__header th .cell').text()).toEqual('name');
      wrapper.vm.label = 'NAME';
      wrapper.vm.$nextTick(() => {
        expect(wrapper.find('.lp-table__header th .cell').text()).toEqual(
          'NAME',
        );
        wrapper.unmount();
      });
    });

    test('align', async () => {
      const wrapper = doMount({
        components: {
          LpTable,
          LpTableColumn,
        },
        template: `
          <lp-table :data="testData">
            <lp-table-column prop="name" :align="align"/>
          </lp-table>
        `,

        data() {
          return {
            align: 'left',
          };
        },

        created() {
          this.testData = getTestData();
        },
      });

      await doubleWait();
      expect(wrapper.findAll('.lp-table__body td.is-right').length).toEqual(0);
      wrapper.vm.align = 'right';
      wrapper.vm.$nextTick(() => {
        expect(
          wrapper.findAll('.lp-table__body td.is-right').length > 0,
        ).toBeTruthy();
        wrapper.unmount();
      });
    });
    test('header-align', async () => {
      const wrapper = doMount({
        components: {
          LpTable,
          LpTableColumn,
        },
        template: `
          <lp-table :data="testData">
            <lp-table-column prop="name" :align="align" :header-align="headerAlign"/>
          </lp-table>
        `,

        data() {
          return {
            align: 'left',
            headerAlign: null,
          };
        },

        created() {
          this.testData = getTestData();
        },
      });
      await doubleWait();
      expect(
        wrapper.findAll('.lp-table__header th.is-left').length,
      ).toBeGreaterThanOrEqual(0);
      expect(wrapper.findAll('.lp-table__header th.is-center').length).toEqual(
        0,
      );
      expect(wrapper.findAll('.lp-table__header th.is-right').length).toEqual(0);
      wrapper.vm.align = 'right';
      await doubleWait();
      expect(wrapper.findAll('.lp-table__header th.is-left').length).toEqual(0);
      expect(wrapper.findAll('.lp-table__header th.is-center').length).toEqual(
        0,
      );
      expect(
        wrapper.findAll('.lp-table__header th.is-right').length,
      ).toBeGreaterThanOrEqual(0);
      wrapper.vm.headerAlign = 'center';
      await doubleWait();
      expect(wrapper.findAll('.lp-table__header th.is-left').length).toEqual(0);
      expect(
        wrapper.findAll('.lp-table__header th.is-center').length,
      ).toBeGreaterThanOrEqual(0);
      expect(wrapper.findAll('.lp-table__header th.is-right').length).toEqual(0);
      wrapper.vm.headerAlign = null;
      await doubleWait();
      expect(wrapper.findAll('.lp-table__header th.is-left').length).toEqual(0);
      expect(wrapper.findAll('.lp-table__header th.is-center').length).toEqual(
        0,
      );
      expect(
        wrapper.findAll('.lp-table__header th.is-right').length,
      ).toBeGreaterThanOrEqual(0);
      wrapper.unmount();
    });

    test('width', async () => {
      const wrapper = doMount({
        components: {
          LpTable,
          LpTableColumn,
        },
        template: `
          <lp-table :data="testData" :fit="false">
            <lp-table-column prop="name" :width="width"/>
          </lp-table>
        `,

        data() {
          return {
            width: 100,
          };
        },

        created() {
          this.testData = getTestData();
        },
      });

      await doubleWait();
      expect(wrapper.find('.lp-table__body col').attributes('width')).toEqual(
        '100',
      );

      wrapper.vm.width = 200;
      await doubleWait();
      expect(wrapper.find('.lp-table__body col').attributes('width')).toEqual(
        '200',
      );

      wrapper.vm.width = '300px';
      await doubleWait();
      expect(wrapper.find('.lp-table__body col').attributes('width')).toEqual(
        '300',
      );
      wrapper.unmount();
    });

    test('min-width', async () => {
      const wrapper = doMount({
        components: {
          LpTable,
          LpTableColumn,
        },
        template: `
          <lp-table :data="testData" :fit="false">
            <lp-table-column prop="name" :min-width="width"/>
          </lp-table>
        `,

        data() {
          return {
            width: 100,
          };
        },

        created() {
          this.testData = getTestData();
        },
      });

      await doubleWait();
      expect(wrapper.find('.lp-table__body col').attributes('width')).toEqual(
        '100',
      );

      wrapper.vm.width = 200;
      await doubleWait();
      expect(wrapper.find('.lp-table__body col').attributes('width')).toEqual(
        '200',
      );

      wrapper.vm.width = '300px';
      await doubleWait();
      expect(wrapper.find('.lp-table__body col').attributes('width')).toEqual(
        '300',
      );
      wrapper.unmount();
    });

    test('fixed', async () => {
      const wrapper = doMount({
        components: {
          LpTable,
          LpTableColumn,
        },
        template: `
          <lp-table :data="testData">
            <lp-table-column :fixed="fixed" />
            <lp-table-column prop="release" />
            <lp-table-column prop="director" />
            <lp-table-column prop="runtime" />
          </lp-table>
        `,

        data() {
          return {
            fixed: false,
          };
        },

        created() {
          this.testData = getTestData();
        },
      });

      await doubleWait();
      expect(wrapper.find('.lp-table-fixed-column--left').exists()).toBeFalsy();
      wrapper.vm.fixed = true;
      await doubleWait();
      expect(wrapper.find('.lp-table-fixed-column--left').exists()).toBeTruthy();
      wrapper.unmount();
    });

    test('prop', async () => {
      const wrapper = doMount({
        components: {
          LpTable,
          LpTableColumn,
        },
        template: `
          <lp-table :data="testData">
            <lp-table-column :prop="prop" />
            <lp-table-column prop="release" />
            <lp-table-column prop="director" />
            <lp-table-column prop="runtime" />
          </lp-table>
        `,

        data() {
          return {
            prop: 'name',
          };
        },

        created() {
          this.testData = getTestData();
        },
      });

      await doubleWait();
      let firstColumnContent = wrapper.find('.lp-table__body td .cell').text();
      let secondColumnContent = wrapper
        .find('.lp-table__body td:nth-child(2) .cell')
        .text();
      expect(firstColumnContent).not.toEqual(secondColumnContent);
      wrapper.vm.prop = 'release';
      await doubleWait();
      firstColumnContent = wrapper.find('.lp-table__body td .cell').text();
      secondColumnContent = wrapper
        .find('.lp-table__body td:nth-child(2) .cell')
        .text();
      expect(firstColumnContent).toEqual(secondColumnContent);
      wrapper.unmount();
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
      return doMount(
        Object.assign({
          components: {
            LpTable,
            LpTableColumn,
          },
          template: `
              <lp-table
                ref="table"
                :data="testData"
                row-key="id"
                border
                default-expand-all
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
              >
                <lp-table-column type="index"></lp-table-column>
                <lp-table-column type="selection" :selectable="selectable"></lp-table-column>
                <lp-table-column prop="id" label="id"></lp-table-column>
                <lp-table-column
                  prop="date"
                  label="Date"
                  sortable
                  width="180">
                </lp-table-column>
                <lp-table-column
                  prop="name"
                  label="Name"
                  sortable
                  width="180">
                </lp-table-column>
                <lp-table-column
                  prop="address"
                  label="Address">
                </lp-table-column>
              </lp-table>
          `,
          methods: {
            selectable(row: any) {
              return !row.disabled;
            },
            ...methods,
          },
          data() {
            return {
              testData: getTableData(),
            };
          },
        }),
      );
    };

    test('selectable index parameter should be correct', async () => {
      const result: boolean[] = [];
      const wrapper = createTable({
        selectable(row: any, index: number) {
          result.push(row.index - 1 === index);
          return !row.disabled;
        },
      });
      await doubleWait();
      wrapper.vm.$refs.table.toggleAllSelection();
      expect(result.every(Boolean)).toBeTruthy();
      wrapper.unmount();
    });
  });
});
