import { nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, it, test, vi } from 'vitest';
import { ArrowDown, ArrowUp } from '@element-plus/icons-vue';
import { LpFormItem } from '@lemon-peel/components/form';
import InputNumber from '../src/InputNumber.vue';

const mouseup = new Event('mouseup');

describe('InputNumber.vue', () => {
  test('create', async () => {
    const num = ref(1);
    const wrapper = mount(() => (
      <InputNumber label="描述文字" v-model:value={num.value} />
    ));
    expect(wrapper.find('input').exists()).toBe(true);
  });

  test('vModel:value', () => {
    const inputText = ref(1);
    const wrapper = mount(() => <InputNumber value={inputText.value} />);
    expect(wrapper.find('input').element.value).toEqual('1');
  });

  test('set vModel:value undefined to display placeholder', async () => {
    const inputText = ref<number | undefined>(1);
    const wrapper = mount(() => (
      <InputNumber value={inputText.value} placeholder="input number" />
    ));
    expect(wrapper.find('input').element.value).toEqual('1');
    inputText.value = undefined;
    await nextTick();
    expect(wrapper.find('input').element.value).toEqual('');
    expect(wrapper.find('input').element.getAttribute('aria-valuenow')).toEqual(
      'null',
    );
  });

  test('min', async () => {
    const num = ref(1);
    const wrapper = mount(() => <InputNumber min={3} v-model:value={num.value} />);
    expect(wrapper.find('input').element.value).toEqual('3');
    wrapper.find('.lp-input-number__decrease').trigger('mousedown');
    document.dispatchEvent(mouseup);
    await nextTick();
    expect(wrapper.find('input').element.value).toEqual('3');
  });

  test('max', async () => {
    const num = ref(5);
    const wrapper = mount(() => <InputNumber max={3} v-model:value={num.value} />);
    expect(wrapper.find('input').element.value).toEqual('3');
    wrapper.find('.lp-input-number__increase').trigger('mousedown');
    document.dispatchEvent(mouseup);
    await nextTick();
    expect(wrapper.find('input').element.value).toEqual('3');
  });

  test('step, increase and decrease', async () => {
    const num = ref(0);
    const wrapper = mount(() => <InputNumber v-model:value={num.value} step={2} />);
    wrapper.find('.lp-input-number__decrease').trigger('mousedown');
    document.dispatchEvent(mouseup);
    await nextTick();
    expect(wrapper.find('input').element.value).toEqual('-2');
    wrapper.find('.lp-input-number__increase').trigger('mousedown');
    document.dispatchEvent(mouseup);
    await nextTick();
    expect(wrapper.find('input').element.value).toEqual('0');
    wrapper.find('.lp-input-number__increase').trigger('mousedown');
    document.dispatchEvent(mouseup);
    await nextTick();
    expect(wrapper.find('input').element.value).toEqual('2');
  });

  test('step-strictly', async () => {
    const num = ref(0);
    const wrapper = mount(() => (
      <InputNumber step-strictly={true} step={2} v-model:value={num.value} />
    ));
    await wrapper.find('input').setValue(3);
    expect(wrapper.find('input').element.value).toEqual('4');
  });

  test('value decimals miss prop precision', async () => {
    const num = ref(0.2);
    const wrapper = mount(() => (
      <InputNumber step-strictly={true} step={0.1} v-model:value={num.value} />
    ));
    const elInputNumber = wrapper.findComponent({ name: 'LpInputNumber' }).vm;
    elInputNumber.increase();
    await nextTick();
    expect(wrapper.find('input').element.value).toEqual('0.3');
    num.value = 0.4;
    await nextTick();
    elInputNumber.decrease();
    await nextTick();
    expect(wrapper.find('input').element.value).toEqual('0.3');
  });

  describe('precision accuracy 2', () => {
    const num = ref(0);
    const wrapper = mount(() => (
      <InputNumber precision={2} v-model:value={num.value} />
    ));
    it.each([
      [1.111_111_111_1, '1.11'],
      [17.275, '17.28'],
      [17.2745, '17.27'],
      [1.09, '1.09'],
      [1.009, '1.01'],
      [10.999, '11.00'],
      [15, '15.00'],
      [15.5, '15.50'],
      [15.555, '15.56'],
    ])(
      'each precision accuracy test: $input $output',
      async (input, output) => {
        await wrapper.find('input').setValue(input);
        expect(wrapper.find('input').element.value).toEqual(`${output}`);
      },
    );
  });

  describe('precision accuracy 3', () => {
    const num = ref(0);
    const wrapper = mount(() => (
      <InputNumber precision={3} v-model:value={num.value} />
    ));
    it.each([
      [1.111_111_111_1, '1.111'],
      [17.275, '17.275'],
      [17.2745, '17.275'],
      [1.09, '1.090'],
      [10.999, '10.999'],
      [10.9999, '11.000'],
      [15.555, '15.555'],
      [1.3335, '1.334'],
    ])(
      'each precision accuracy test: $input $output',
      async (input, output) => {
        await wrapper.find('input').setValue(input);
        expect(wrapper.find('input').element.value).toEqual(`${output}`);
      },
    );
  });

  test('readonly', async () => {
    const num = ref(0);
    const handleFocus = vi.fn();
    const wrapper = mount(() => (
      <InputNumber readonly v-model:value={num.value} onFocus={handleFocus} />
    ));

    wrapper.find('.lp-input__inner').trigger('focus');
    await nextTick();
    expect(handleFocus).toHaveBeenCalledTimes(1);

    wrapper.find('.lp-input-number__decrease').trigger('mousedown');
    document.dispatchEvent(mouseup);
    await nextTick();
    expect(wrapper.find('input').element.value).toEqual('0');

    wrapper.find('.lp-input-number__increase').trigger('mousedown');
    document.dispatchEvent(mouseup);
    await nextTick();
    expect(wrapper.find('input').element.value).toEqual('0');
  });

  test('disabled', async () => {
    const num = ref(0);
    const wrapper = mount(() => (
      <InputNumber disabled={true} v-model:value={num.value} />
    ));
    wrapper.find('.lp-input-number__decrease').trigger('mousedown');
    document.dispatchEvent(mouseup);
    await nextTick();
    expect(wrapper.find('input').element.value).toEqual('0');
    wrapper.find('.lp-input-number__increase').trigger('mousedown');
    document.dispatchEvent(mouseup);
    await nextTick();
    expect(wrapper.find('input').element.value).toEqual('0');
  });

  test('controls', async () => {
    const num = ref(0);
    const wrapper = mount(() => (
      <InputNumber controls={false} v-model:value={num.value} />
    ));
    expect(wrapper.find('.lp-input-number__increase').exists()).toBe(false);
    expect(wrapper.find('.lp-input-number__decrease').exists()).toBe(false);
  });

  test('controls-position', async () => {
    const num = ref(0);
    const wrapper = mount(() => (
      <InputNumber controls-position="right" v-model:value={num.value} />
    ));
    expect(wrapper.findComponent(ArrowDown).exists()).toBe(true);
    expect(wrapper.findComponent(ArrowUp).exists()).toBe(true);
  });

  test('input-event', async () => {
    const handleInput = vi.fn();
    const num = ref(0);
    const wrapper = mount(() => (
      <InputNumber v-model:value={num.value} onInput={handleInput} />
    ));
    const inputWrapper = wrapper.find('input');
    const nativeInput = inputWrapper.element;
    nativeInput.value = '0';
    await inputWrapper.trigger('input');
    expect(handleInput).toBeCalledTimes(0);
    nativeInput.value = '1';
    await inputWrapper.trigger('input');
    expect(handleInput).toBeCalledTimes(1);
    expect(handleInput).toHaveBeenCalledWith(1);
    nativeInput.value = '2';
    await inputWrapper.trigger('input');
    expect(handleInput).toBeCalledTimes(2);
    expect(handleInput).toHaveBeenCalledWith(2);
    nativeInput.value = '';
    await inputWrapper.trigger('input');
    expect(handleInput).toBeCalledTimes(3);
    expect(handleInput).toHaveBeenCalledWith(null);
  });

  test('change-event', async () => {
    const num = ref(0);
    const wrapper = mount(() => <InputNumber v-model:value={num.value} />);
    wrapper.find('.lp-input-number__increase').trigger('mousedown');
    document.dispatchEvent(mouseup);
    await nextTick();
    expect(wrapper.getComponent(InputNumber).emitted('change')).toHaveLength(1);
    expect(wrapper.getComponent(InputNumber).emitted().change[0]).toEqual([
      1, 0,
    ]);
    expect(
      wrapper.getComponent(InputNumber).emitted('update:value'),
    ).toHaveLength(1);
    wrapper.find('.lp-input-number__increase').trigger('mousedown');
    document.dispatchEvent(mouseup);
    await nextTick();
    expect(wrapper.getComponent(InputNumber).emitted('change')).toHaveLength(2);
    expect(wrapper.getComponent(InputNumber).emitted().change[1]).toEqual([
      2, 1,
    ]);
    expect(wrapper.getComponent(InputNumber).emitted('update:value'))
      .toHaveLength(2);
  });

  test('blur-event', async () => {
    const num = ref(0);
    const wrapper = mount(() => <InputNumber v-model:value={num.value} />);
    await wrapper.find('input').trigger('blur');
    expect(wrapper.getComponent(InputNumber).emitted('blur')).toHaveLength(1);
  });

  test('focus-event', async () => {
    const num = ref(0);
    const wrapper = mount(() => <InputNumber v-model:value={num.value} />);
    await wrapper.find('input').trigger('focus');
    expect(wrapper.getComponent(InputNumber).emitted('focus')).toHaveLength(1);
  });

  test('clear with :value-on-clear="null"', async () => {
    const num = ref(2);
    const wrapper = mount(() => (
      <InputNumber v-model:value={num.value} min={1} max={10} />
    ));
    const elInput = wrapper.findComponent({ name: 'LpInputNumber' }).vm;
    elInput.handleInputChange('');
    await nextTick();
    expect(num.value).toBe(null);
    elInput.increase();
    await nextTick();
    expect(num.value).toBe(1);
    elInput.increase();
    await nextTick();
    expect(num.value).toBe(2);
    elInput.handleInputChange('');
    await nextTick();
    expect(num.value).toBe(null);
    elInput.decrease();
    await nextTick();
    expect(num.value).toBe(1);
    elInput.decrease();
    await nextTick();
    expect(num.value).toBe(1);
  });

  test('clear with value-on-clear="min"', async () => {
    const num = ref(2);
    const wrapper = mount(() => (
      <InputNumber value-on-clear="min" v-model:value={num.value} min={1} max={10} />
    ));
    const elInput = wrapper.findComponent({ name: 'LpInputNumber' }).vm;
    elInput.handleInputChange('');
    await nextTick();
    expect(num.value).toBe(1);
    elInput.increase();
    await nextTick();
    expect(num.value).toBe(2);
    elInput.handleInputChange('');
    await nextTick();
    expect(num.value).toBe(1);
    elInput.decrease();
    await nextTick();
    expect(num.value).toBe(1);
  });

  test('clear with value-on-clear="max"', async () => {
    const num = ref(2);
    const wrapper = mount(() => (
      <InputNumber value-on-clear="max" v-model:value={num.value} min={1} max={10} />
    ));
    const elInput = wrapper.findComponent({ name: 'LpInputNumber' }).vm;
    elInput.handleInputChange('');
    await nextTick();
    expect(num.value).toBe(10);
    elInput.increase();
    await nextTick();
    expect(num.value).toBe(10);
    elInput.handleInputChange('');
    await nextTick();
    expect(num.value).toBe(10);
    elInput.decrease();
    await nextTick();
    expect(num.value).toBe(9);
  });

  test('clear with :value-on-clear="5"', async () => {
    const num = ref(2);
    const wrapper = mount(() => (
      <InputNumber value-on-clear={5} v-model:value={num.value} min={1} max={10} />
    ));
    const elInput = wrapper.findComponent({ name: 'LpInputNumber' }).vm;
    elInput.handleInputChange('');
    await nextTick();
    expect(num.value).toBe(5);
    elInput.increase();
    await nextTick();
    expect(num.value).toBe(6);
    elInput.handleInputChange('');
    await nextTick();
    expect(num.value).toBe(5);
    elInput.decrease();
    await nextTick();
    expect(num.value).toBe(4);
  });

  test('check increase and decrease button when vModel:value not in [min, max]', async () => {
    const num1 = ref(-5);
    const num2 = ref(15);
    const wrapper = mount({
      setup() {
        return () => (
          <>
            <InputNumber
              ref="inputNumber1"
              vModel:value={num1.value}
              min={1}
              max={10}
            />
            <InputNumber
              ref="inputNumber2"
              vModel:value={num2.value}
              min={1}
              max={10}
            />
          </>
        );
      },
    });

    const inputNumber1 = wrapper.findComponent({ ref: 'inputNumber1' }).vm;
    const inputNumber2 = wrapper.findComponent({ ref: 'inputNumber2' }).vm;

    expect(num1.value).toBe(1);
    expect(num2.value).toBe(10);

    inputNumber1.decrease();
    await nextTick();
    expect(num1.value).toBe(1);
    inputNumber1.increase();
    await nextTick();
    expect(num1.value).toBe(2);
    inputNumber1.increase();
    await nextTick();
    expect(num1.value).toBe(3);

    inputNumber2.increase();
    await nextTick();
    expect(num2.value).toBe(10);
    inputNumber2.decrease();
    await nextTick();
    expect(num2.value).toBe(9);
    inputNumber2.decrease();
    await nextTick();
    expect(num2.value).toBe(8);
  });

  describe('form item accessibility integration', () => {
    test('automatic id attachment', async () => {
      const wrapper = mount(() => (
        <LpFormItem label="Foobar" data-test-ref="item">
          <InputNumber />
        </LpFormItem>
      ));

      await nextTick();
      const formItem = wrapper.find('[data-test-ref="item"]');
      const formItemLabel = formItem.find('.lp-form-item__label');
      const innerInput = wrapper.find('.lp-input__inner');
      expect(formItem.attributes().role).toBeFalsy();
      expect(formItemLabel.attributes().for).toBe(innerInput.attributes().id);
    });

    test('specified id attachment', async () => {
      const wrapper = mount(() => (
        <LpFormItem label="Foobar" data-test-ref="item">
          <InputNumber id="foobar" />
        </LpFormItem>
      ));

      await nextTick();
      const formItem = wrapper.find('[data-test-ref="item"]');
      const formItemLabel = formItem.find('.lp-form-item__label');
      const innerInput = wrapper.find('.lp-input__inner');
      expect(formItem.attributes().role).toBeFalsy();
      expect(innerInput.attributes().id).toBe('foobar');
      expect(formItemLabel.attributes().for).toBe(innerInput.attributes().id);
    });

    test('form item role is group when multiple inputs', async () => {
      const wrapper = mount(() => (
        <LpFormItem label="Foobar" data-test-ref="item">
          <InputNumber />
          <InputNumber />
        </LpFormItem>
      ));

      await nextTick();
      const formItem = wrapper.find('[data-test-ref="item"]');
      expect(formItem.attributes().role).toBe('group');
    });
  });
});
