import { nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import Select from '@lemon-peel/components/select';
import { LpFormItem } from '@lemon-peel/components/form';
import TimeSelect from '../src/TimeSelect.vue';
dayjs.extend(customParseFormat);

const { Option } = Select;

afterEach(() => {
  document.documentElement.innerHTML = '';
});

describe('TimeSelect', () => {
  it('create', async () => {
    const wrapper = mount(() => (
      <TimeSelect style={{ color: 'red' }} class="customClass" />
    ));

    const outerInput = wrapper.find('.lp-select');
    expect(outerInput.classes()).toContain('customClass');
    expect(outerInput.attributes().style).toBeDefined();
  });

  it('set default value', async () => {
    const value = ref('14:30');
    const wrapper = mount(() => <TimeSelect v-model:value={value.value} />);

    const input = wrapper.find('input');
    input.trigger('blur');
    input.trigger('focus');
    await nextTick();
    expect(document.querySelector('.selected')).toBeDefined();
    expect(document.querySelector('.selected')?.textContent).toBe('14:30');
  });

  it('set minTime', async () => {
    const wrapper = mount(() => <TimeSelect minTime="14:30" />);

    const input = wrapper.find('input');
    input.trigger('blur');
    input.trigger('focus');
    await nextTick();
    const elms = document.querySelectorAll('.is-disabled');
    const elm = Array.from(elms).at(-1)!;
    expect(elm.textContent).toBe('14:30');
  });

  it('set maxTime', async () => {
    const wrapper = mount(() => <TimeSelect maxTime="14:30" />);

    const input = wrapper.find('input');
    input.trigger('blur');
    input.trigger('focus');
    await nextTick();
    const elm = document.querySelector('.is-disabled');
    expect(elm?.textContent).toBe('14:30');
  });

  it('set value update', async () => {
    const value = ref('10:00');
    const wrapper = mount(() => <TimeSelect v-model:value={value.value} />);

    await nextTick();
    const input = wrapper.find('input');

    expect(input.exists()).toBe(true);
    expect(input.element.value).toBe('10:00');

    value.value = '10:30';
    await nextTick();

    expect(wrapper.findComponent({ name: 'LpTimeSelect' }).vm.value).toBe(
      '10:30',
    );
    expect(input.element.value).toBe('10:30');
  });

  it('update value', async () => {
    const value = ref('10:00');
    const wrapper = mount(() => <TimeSelect v-model:value={value.value} />);

    await nextTick();
    const vm = wrapper.findComponent({ name: 'LpTimeSelect' }).vm;
    const input = wrapper.find('input');
    expect(vm.value).toBe('10:00');
    expect(input.element.value).toBe('10:00');

    const option = wrapper
      .findAllComponents(Option)
      .find(w => w.text().trim() === '11:00');

    expect(option?.exists()).toBe(true);
    option?.trigger('click');
    await nextTick();
    expect(vm.value).toBe('11:00');
    expect(input.element.value).toBe('11:00');
  });

  it('set disabled', async () => {
    const value = ref('10:00');
    const disabled = ref(false);
    const wrapper = mount(() => (
      <TimeSelect v-model:value={value.value} disabled={disabled.value} />
    ));

    const select = wrapper.findComponent({ name: 'LpSelect' });
    expect(select.props().disabled).toBe(false);

    disabled.value = true;
    await nextTick();
    expect(select.props().disabled).toBe(true);
  });

  it('set editable', async () => {
    const value = ref('10:00');
    const editable = ref(false);
    const wrapper = mount(() => (
      <TimeSelect v-model:value={value.value} editable={editable.value} />
    ));

    const select = wrapper.findComponent({ name: 'LpSelect' });
    expect(select.props().filterable).toBe(false);

    editable.value = true;
    await nextTick();
    expect(select.props().filterable).toBe(true);
  });

  it('ref focus', async () => {
    const wrapper = mount(() => <TimeSelect />, {
      attachTo: document.body,
    });

    wrapper.findComponent(TimeSelect).vm.$.exposed!.focus();

    await nextTick();
    await nextTick();

    const popperEl = document.querySelector('.lp-select__popper');
    const attr = popperEl?.getAttribute('aria-hidden');
    expect(attr).toEqual('false');
  });

  it('ref blur', async () => {
    const wrapper = mount(() => <TimeSelect />, {
      attachTo: document.body,
    });

    wrapper.findComponent(TimeSelect).vm.$.exposed!.focus();
    await nextTick();
    wrapper.findComponent(TimeSelect).vm.$.exposed!.blur();

    await nextTick();
    await nextTick();

    const popperEl = document.querySelector('.lp-select__popper');
    const attr = popperEl?.getAttribute('aria-hidden');
    expect(attr).toEqual('true');
  });

  it('set format', async () => {
    const value = ref('');
    const wrapper = mount(() => (
      <TimeSelect
        v-model:value={value.value}
        start="13:00"
        step="00:30"
        end="13:30"
        format="hh:mm A"
      />
    ));

    const input = wrapper.find('.lp-input__inner');
    await input.trigger('click');
    await nextTick();
    const option = document.querySelector('.lp-select-dropdown__item');
    expect(option?.textContent).toBe('01:00 PM');
  });

  describe('form item accessibility integration', () => {
    it('automatic id attachment', async () => {
      const wrapper = mount(() => (
        <LpFormItem label="Foobar" data-test-ref="item">
          <TimeSelect />
        </LpFormItem>
      ));

      await nextTick();
      const formItem = wrapper.find('[data-test-ref="item"]');
      const formItemLabel = formItem.find('.lp-form-item__label');
      const timeSelectInput = wrapper.find('.lp-input__inner');
      expect(formItem.attributes().role).toBeFalsy();
      expect(formItemLabel.attributes().for).toBe(
        timeSelectInput.attributes().id,
      );
    });

    it('specified id attachment', async () => {
      const wrapper = mount(() => (
        <LpFormItem label="Foobar" data-test-ref="item">
          <TimeSelect id="foobar" />
        </LpFormItem>
      ));

      await nextTick();
      const formItem = wrapper.find('[data-test-ref="item"]');
      const formItemLabel = formItem.find('.lp-form-item__label');
      const timeSelectInput = wrapper.find('.lp-input__inner');
      expect(formItem.attributes().role).toBeFalsy();
      expect(timeSelectInput.attributes().id).toBe('foobar');
      expect(formItemLabel.attributes().for).toBe(
        timeSelectInput.attributes().id,
      );
    });

    it('form item role is group when multiple inputs', async () => {
      const wrapper = mount(() => (
        <LpFormItem label="Foobar" data-test-ref="item">
          <TimeSelect />
          <TimeSelect />
        </LpFormItem>
      ));

      await nextTick();
      const formItem = wrapper.find('[data-test-ref="item"]');
      expect(formItem.attributes().role).toBe('group');
    });
  });
});
