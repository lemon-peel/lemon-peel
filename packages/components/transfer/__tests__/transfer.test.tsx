import { nextTick, reactive, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import Transfer from '../src/Transfer.vue';
import type { TransferDataItem, RenderContent } from '../src/transfer';

describe('Transfer', () => {
  const getTestData = () => {
    const data = [];
    for (let i = 1; i <= 15; i++) {
      data.push({
        key: i,
        label: `备选项 ${i}`,
        disabled: i % 4 === 0,
      });
    }
    return data;
  };

  it('create', () => {
    const wrapper = mount(() => <Transfer data={getTestData()} />);
    expect(wrapper.findComponent({ name: 'LpTransfer' })).toBeTruthy();
  });

  it('default target list', () => {
    const value = ref([1, 4]);
    const wrapper = mount(() => (
      <Transfer v-model:value={value.value} data={getTestData()} />
    ));
    const LpTransfer: any = wrapper.findComponent({ name: 'LpTransfer' });
    expect(LpTransfer.vm.sourceData.length).toBe(13);
  });

  it('filterable', async () => {
    const value = ref([]);
    const method = (query: string, option: TransferDataItem) => {
      return option.key === Number(query);
    };

    const wrapper = mount(() => (
      <Transfer
        v-model:value={value.value}
        filterable
        data={getTestData()}
        filter-method={method}
      />
    ));
    const leftList: any = wrapper.findComponent({ name: 'LpTransferPanel' });
    leftList.vm.query = '1';
    await leftList.find('input').setValue('1');
    expect(leftList.vm.filteredData.length).toBe(1);
  });

  it('transfer', async () => {
    const value = ref([1, 4]);
    const wrapper = mount(() => (
      <Transfer
        v-model:value={value.value}
        leftDefaultChecked={[2, 3]}
        rightDefaultChecked={[1]}
        data={getTestData()}
      />
    ));

    const LpTransfer: any = wrapper.findComponent({ name: 'LpTransfer' });

    LpTransfer.vm.addToLeft();
    await nextTick();
    expect(LpTransfer.vm.sourceData.length).toBe(14);
    LpTransfer.vm.addToRight();
    await nextTick();
    expect(LpTransfer.vm.sourceData.length).toBe(12);
  });

  it('customize', () => {
    const state = reactive({
      value: [2],
      titles: ['表1', '表2'],
      format: { noChecked: 'no', hasChecked: 'has' },
    });

    const renderFunc: RenderContent = (_h, option) => (
      <span>{`${option.key} - ${option.label}`}</span>
    );

    const wrapper = mount(() => (
      <Transfer
        v-model:value={state.value}
        titles={state.titles as [string, string]}
        format={state.format}
        renderContent={renderFunc}
        data={getTestData()}
      />
    ));

    const label = wrapper.find('.lp-transfer-panel__header .lp-checkbox__label');
    expect(label.text().includes('表1')).toBeTruthy();
    expect(
      wrapper.find('.lp-transfer-panel__list .lp-checkbox__label span').text(),
    ).toBe('1 - 备选项 1');
    expect(label.find('span').text()).toBe('no');
  });

  it('check', () => {
    const value = ref([]);
    const wrapper = mount(() => (
      <Transfer v-model:value={value.value} data={getTestData()} />
    ));

    const leftList: any = wrapper.findComponent({ name: 'LpTransferPanel' });
    leftList.vm.handleAllCheckedChange({ target: { checked: true } });
    expect(leftList.vm.checked.length).toBe(12);
  });

  describe('target order', () => {
    it('original(default)', async () => {
      const value = ref([1, 4]);
      const wrapper = mount(() => (
        <Transfer
          v-model:value={value.value}
          leftDefaultChecked={[2, 3]}
          data={getTestData()}
        />
      ));

      const LpTransfer: any = wrapper.findComponent({ name: 'LpTransfer' });
      LpTransfer.vm.addToRight();
      await nextTick();
      const targetItems = wrapper.findAll(
        '.lp-transfer__buttons + .lp-transfer-panel .lp-transfer-panel__body .lp-checkbox__label span',
      );
      expect(targetItems.map(item => item.text())).toStrictEqual([
        '备选项 1',
        '备选项 2',
        '备选项 3',
        '备选项 4',
      ]);
    });

    it('push', async () => {
      const value = ref([1, 4]);
      const wrapper = mount(() => (
        <Transfer
          v-model:value={value.value}
          leftDefaultChecked={[2, 3]}
          target-order="push"
          data={getTestData()}
        />
      ));

      const LpTransfer: any = wrapper.findComponent({ name: 'LpTransfer' });
      LpTransfer.vm.addToRight();
      await nextTick();
      const targetItems = wrapper.findAll(
        '.lp-transfer__buttons + .lp-transfer-panel .lp-transfer-panel__body .lp-checkbox__label span',
      );
      expect(targetItems.map(item => item.text())).toStrictEqual([
        '备选项 1',
        '备选项 4',
        '备选项 2',
        '备选项 3',
      ]);
    });

    it('unshift', async () => {
      const value = ref([1, 4]);
      const wrapper = mount(() => (
        <Transfer
          v-model:value={value.value}
          leftDefaultChecked={[2, 3]}
          target-order="unshift"
          data={getTestData()}
        />
      ));

      const LpTransfer: any = wrapper.findComponent({ name: 'LpTransfer' });
      LpTransfer.vm.addToRight();
      await nextTick();
      const targetItems = wrapper.findAll(
        '.lp-transfer__buttons + .lp-transfer-panel .lp-transfer-panel__body .lp-checkbox__label span',
      );
      expect(targetItems.map(item => item.text())).toStrictEqual([
        '备选项 2',
        '备选项 3',
        '备选项 1',
        '备选项 4',
      ]);
    });
  });

  describe('validate clearQuery', () => {
    it('set query and clear query', async () => {
      const value = ref([]);
      const wrapper = mount(() => (
        <Transfer
          v-model:value={value.value}
          filterable={true}
          data={getTestData()}
        />
      ));

      const LpTransfer: any = wrapper.findComponent({ name: 'LpTransfer' });
      const app = LpTransfer.vm;
      app.leftPanel.query = '11';
      app.rightPanel.query = '22';
      await nextTick();
      expect(app.leftPanel.query).toBe('11');
      expect(app.rightPanel.query).toBe('22');

      app.clearQuery('left');
      await nextTick();
      expect(app.leftPanel.query).toBeFalsy();

      app.clearQuery('right');
      await nextTick();
      expect(app.rightPanel.query).toBeFalsy();
    });
  });
});
