import { nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import { LpFormItem } from '@lemon-peel/components/form';
import ColorPicker from '../src/ColorPicker.vue';
import type { ComponentPublicInstance } from 'vue';

vi.mock('lodash', async load => {
  const mod: any = await load();
  return {
    ...mod.default,
    debounce: vi.fn(fn => {
      fn.cancel = vi.fn();
      fn.flush = vi.fn();
      return fn;
    }),
  };
});

type ColorPickerVM = ComponentPublicInstance<{
  handleClick: (opt: {
    target: HTMLElement | null;
    type: string;
    clientX: number;
    clientY: number;
  }) => void;
  thumbTop: number;
  handleDrag: (opt: { type: string, clientX: number, clientY: number }) => void;
}>;

describe('Color-picker', () => {
  test('Mount Color-picker', () => {
    const wrapper = mount(ColorPicker);
    expect(wrapper.html()).toContain('lp-color-picker');
    wrapper.unmount();
  });

  test('should show alpha slider when show-alpha=true', async () => {
    const color = ref('#20A0FF');
    const wrapper = mount(() => (
      <ColorPicker v-model:value={color.value} show-alpha={true} />
    ));

    await wrapper.find('.lp-color-picker__trigger').trigger('click');
    const alphaSlider = document.querySelector('.lp-color-alpha-slider');
    expect(alphaSlider).toBeTruthy();
    wrapper.unmount();
  });

  test('should show correct rgb value', async () => {
    const color = ref('#20A0FF');
    const wrapper = mount(() => <ColorPicker v-model:value={color.value} />);

    await wrapper.find('.lp-color-picker__trigger').trigger('click');
    await nextTick();
    const input = document.querySelector<HTMLInputElement>(
      '.lp-color-dropdown__value input',
    );
    expect(input!.value.trim().toUpperCase()).toEqual('#20A0FF');
    wrapper.unmount();
  });
  test('should show correct hex value contains alpha', async () => {
    const color = ref('#20A0FFEE');
    const wrapper = mount(() => (
      <ColorPicker v-model:value={color.value} color-format="hex" show-alpha />
    ));

    await wrapper.find('.lp-color-picker__trigger').trigger('click');
    await nextTick();
    const input = document.querySelector<HTMLInputElement>(
      '.lp-color-dropdown__value input',
    );
    expect(input!.value.trim().toUpperCase()).toEqual('#20A0FFEE');
    wrapper.unmount();
  });

  test('should pick a color when confirm button click', async () => {
    const color = ref(null);
    const wrapper = mount(() => <ColorPicker v-model:value={color.value} />);

    await wrapper.find('.lp-color-picker__trigger').trigger('click');
    document.querySelector<HTMLElement>('.lp-color-dropdown__btn')?.click();
    await nextTick();
    expect(color.value).toEqual('#FF0000');
    wrapper.unmount();
  });

  test('should pick a color contains alpha when confirm button click', async () => {
    const color = ref(null);
    const wrapper = mount(() => (
      <ColorPicker v-model:value={color.value} color-format="hex" show-alpha />
    ));

    await wrapper.find('.lp-color-picker__trigger').trigger('click');
    document.querySelector<HTMLElement>('.lp-color-dropdown__btn')?.click();
    await nextTick();
    expect(color.value).toEqual('#FF0000FF');
    wrapper.unmount();
  });

  test('should init the right color when open', async () => {
    const color = ref('#0F0');
    const wrapper = mount(() => <ColorPicker v-model:value={color.value} />);

    const colorPickerWrapper = wrapper.findComponent(ColorPicker);
    const hueSlideWrapper = colorPickerWrapper.findComponent({ ref: 'hue' });
    const hueSlideDom = hueSlideWrapper.element as HTMLElement;
    const thumbDom = hueSlideWrapper.find<HTMLElement>(
      '.lp-color-hue-slider__thumb',
    ).element;
    const mockHueSlideHeight = vi
      .spyOn(hueSlideDom, 'offsetHeight', 'get')
      .mockImplementation(() => 200);
    const mockThumbDom = vi
      .spyOn(thumbDom, 'offsetHeight', 'get')
      .mockImplementation(() => 4);
    await wrapper.find('.lp-color-picker__trigger').trigger('click');
    await nextTick();
    expect(
      (hueSlideWrapper.vm as ComponentPublicInstance<{ thumbTop: number }>)
        .thumbTop > 10,
    ).toBeTruthy();
    mockHueSlideHeight.mockRestore();
    mockThumbDom.mockRestore();
    wrapper.unmount();
  });

  test('should show color picker when click trigger', async () => {
    const color = ref('#0F0');
    const wrapper = mount(() => <ColorPicker v-model:value={color.value} />);

    await wrapper.find('.lp-color-picker__trigger').trigger('click');
    const dropdown = document.querySelector('.lp-color-dropdown');
    expect(dropdown).toBeTruthy();
    wrapper.unmount();
  });

  test('should clear a color when clear button click', async () => {
    const color = ref('#0F0');
    const wrapper = mount(() => <ColorPicker v-model:value={color.value} />);

    await wrapper.find('.lp-color-picker__trigger').trigger('click');
    const clearBtn = document.querySelector<HTMLElement>(
      '.lp-color-dropdown__link-btn',
    );
    clearBtn!.click();
    expect(color.value).toEqual(null);
    wrapper.unmount();
  });

  test('should change hue when clicking the hue bar', async () => {
    const color = ref('#F00');
    const wrapper = mount(() => <ColorPicker v-model:value={color.value} />);

    await wrapper.find('.lp-color-picker__trigger').trigger('click');
    const colorPickerWrapper = wrapper.findComponent(ColorPicker);
    const hueSlideWrapper = colorPickerWrapper.findComponent({ ref: 'hue' });
    const hueSlideDom = hueSlideWrapper.element;
    const thumbDom = hueSlideWrapper.find<HTMLElement>(
      '.lp-color-hue-slider__thumb',
    ).element;
    const mockHueBarHeight = vi
      .spyOn(hueSlideDom, 'getBoundingClientRect')
      .mockReturnValue({
        height: 176,
        width: 12,
        x: 0,
        y: 0,
        top: 0,
      } as DOMRect);
    const mockThumbDom = vi
      .spyOn(thumbDom, 'offsetHeight', 'get')
      .mockReturnValue(4)
    ;(hueSlideWrapper.vm as ColorPickerVM).handleClick({
      target: null,
      type: 'mouseup',
      clientX: 0,
      clientY: 100,
    });
    const hue = colorPickerWrapper.vm.color.get('hue');
    expect(hue > 0).toBeTruthy();
    mockHueBarHeight.mockRestore();
    mockThumbDom.mockRestore();
    wrapper.unmount();
  });

  test('should change hue when saturation is zero', async () => {
    const color = ref('20A0FF');
    const wrapper = mount(() => <ColorPicker v-model:value={color.value} />);

    await wrapper.find('.lp-color-picker__trigger').trigger('click');
    const colorPickerWrapper = wrapper.findComponent(ColorPicker);
    const hueSlideWrapper = colorPickerWrapper.findComponent({ ref: 'hue' });
    const hueSlideDom = hueSlideWrapper.element as HTMLElement;
    const thumbDom = hueSlideWrapper.find<HTMLElement>(
      '.lp-color-hue-slider__thumb',
    ).element;
    const mockHueSlideRect = vi
      .spyOn(hueSlideDom, 'getBoundingClientRect')
      .mockReturnValue({
        height: 176,
        width: 12,
        x: 0,
        y: 0,
        top: 0,
      } as DOMRect);
    const mockHueSlideOffsetHeight = vi
      .spyOn(hueSlideDom, 'offsetHeight', 'get')
      .mockReturnValue(200);
    const mockThumbDom = vi
      .spyOn(thumbDom, 'offsetHeight', 'get')
      .mockReturnValue(4)
    ;(hueSlideWrapper.vm as ColorPickerVM).handleClick({
      target: null,
      type: 'mouseup',
      clientX: 0,
      clientY: 100,
    });
    await nextTick();

    expect((hueSlideWrapper.vm as ColorPickerVM).thumbTop > 0).toBe(true);
    mockHueSlideRect.mockRestore();
    mockThumbDom.mockRestore();
    mockHueSlideOffsetHeight.mockRestore();
    wrapper.unmount();
  });

  test('should change alpha when clicking the alpha bar', async () => {
    const color = ref('#F00');
    const wrapper = mount(() => (
      <ColorPicker v-model:value={color.value} show-alpha />
    ));

    await wrapper.find('.lp-color-picker__trigger').trigger('click');
    const colorPickerWrapper = wrapper.findComponent(ColorPicker);
    const alphaWrapper = colorPickerWrapper.findComponent({ ref: 'alpha' });
    const alphaDom = alphaWrapper.element as HTMLElement;
    const mockAlphaDom = vi
      .spyOn(alphaDom, 'getBoundingClientRect')
      .mockReturnValue({
        height: 12,
        width: 280,
        x: 0,
        y: 0,
        left: 0,
      } as DOMRect);
    const thumbDom = alphaWrapper.find<HTMLElement>(
      '.lp-color-alpha-slider__thumb',
    ).element;
    const mockThumbDom = vi
      .spyOn(thumbDom, 'offsetWidth', 'get')
      .mockReturnValue(4)
    ;(alphaWrapper.vm as ColorPickerVM).handleClick({
      target: null,
      type: 'mouseup',
      clientX: 50,
      clientY: 0,
    });
    await nextTick();
    expect(colorPickerWrapper.vm.color.get('alpha') < 100).toBeTruthy();
    mockAlphaDom.mockRestore();
    mockThumbDom.mockRestore();
    wrapper.unmount();
  });

  test('should change saturation and value when clicking the sv-panel', async () => {
    const color = ref('hsv(0, 50%, 50%)');
    const wrapper = mount(() => (
      <ColorPicker v-model:value={color.value} show-alpha color-format="hsv" />
    ));

    await wrapper.find('.lp-color-picker__trigger').trigger('click');
    const colorPickerWrapper = wrapper.findComponent(ColorPicker);
    const svPanelWrapper = colorPickerWrapper.findComponent({ ref: 'svPanel' })
    ;(svPanelWrapper.vm as ColorPickerVM).handleDrag({
      type: 'mousemove',
      clientX: 0,
      clientY: 0,
    });
    wrapper.vm.$nextTick(() => {
      expect((color.value as any)._saturation !== 50).toBeTruthy();
      expect((color.value as any)._value !== 50).toBeTruthy();
    });
  });

  test('should change color to the selected color', async () => {
    const color = ref('hsva(180, 65, 20, 0.5)');
    const colors = ref([
      'rgba(19, 206, 102, 0.18)',
      'rgb(25, 159, 147)',
      'hsv(250, 54, 98)',
      'hsva(180, 65, 20, 0.5)',
      'hsl(170, 32%, 87%)',
      'hsla(45, 62%, 47%, 0.13)',
      '#7486de',
      '#45aa9477',
      '#892345',
    ]);
    const wrapper = mount(() => (
      <ColorPicker v-model:value={color.value} show-alpha predefine={colors.value} />
    ));

    await wrapper.find('.lp-color-picker__trigger').trigger('click');
    const colorPickerWrapper = wrapper.findComponent(ColorPicker);
    const predefineWrapper = colorPickerWrapper.findComponent({
      ref: 'predefine',
    });
    const predefineDom = predefineWrapper.element as HTMLElement;
    expect(
      predefineDom.querySelectorAll('.lp-color-predefine__color-selector')
        .length === 9,
    ).toBeTruthy();
    predefineDom
      .querySelector<HTMLElement>(
      '.lp-color-predefine__color-selector:nth-child(4)',
    )
      ?.click();
    await nextTick();
    expect(colorPickerWrapper.vm.color.get('hue')).toEqual(180);
    expect(colorPickerWrapper.vm.color.get('saturation')).toEqual(65);
    expect(colorPickerWrapper.vm.color.get('value')).toEqual(20);
    expect(colorPickerWrapper.vm.color.get('alpha')).toEqual(50);

    predefineDom
      .querySelector<HTMLElement>(
      '.lp-color-predefine__color-selector:nth-child(3)',
    )
      ?.click();
    await nextTick();
    expect(colorPickerWrapper.vm.color.get('hue')).toEqual(250);
    expect(colorPickerWrapper.vm.color.get('saturation')).toEqual(54);
    expect(colorPickerWrapper.vm.color.get('value')).toEqual(98);
    expect(colorPickerWrapper.vm.color.get('alpha')).toEqual(100);
  });

  test('should change selected state of predefined color', async () => {
    const color = ref('hsva(180, 65, 20, 0.5)');
    const colors = ref([
      'rgba(19, 206, 102, 0.18)',
      'rgb(25, 159, 147)',
      'hsv(250, 54, 98)',
      'hsva(180, 65, 20, 0.5)',
      'hsl(170, 32%, 87%)',
      'hsla(45, 62%, 47%, 0.13)',
      '#7486de',
      '#45aa9477',
      '#892345',
    ]);
    const wrapper = mount(() => (
      <ColorPicker v-model:value={color.value} show-alpha predefine={colors.value} />
    ));

    await wrapper.find('.lp-color-picker__trigger').trigger('click');
    const colorPickerWrapper = wrapper.findComponent(ColorPicker);
    const predefineWrapper = colorPickerWrapper.findComponent({
      ref: 'predefine',
    });
    const predefineDom = predefineWrapper.element as HTMLElement;
    predefineDom
      .querySelector<HTMLElement>(
      '.lp-color-predefine__color-selector:nth-child(4)',
    )
      ?.click();
    await nextTick();
    expect(
      predefineWrapper
        .find('.lp-color-predefine__color-selector:nth-child(4)')
        .classes(),
    ).toContain('selected');
    const hueSlideWrapper = colorPickerWrapper.findComponent({ ref: 'hue' });
    const hueSlideDom = hueSlideWrapper.element;
    const thumbDom = hueSlideWrapper.find<HTMLElement>(
      '.lp-color-hue-slider__thumb',
    ).element;
    const mockHueSlideRect = vi
      .spyOn(hueSlideDom, 'getBoundingClientRect')
      .mockReturnValue({
        height: 176,
        width: 12,
        x: 0,
        y: 0,
        top: 0,
      } as DOMRect);
    const mockHueSlideOffsetHeight = vi
      .spyOn(hueSlideDom as HTMLElement, 'offsetHeight', 'get')
      .mockReturnValue(200);
    const mockThumbDom = vi
      .spyOn(thumbDom, 'offsetHeight', 'get')
      .mockReturnValue(4)
    ;(hueSlideWrapper.vm as ColorPickerVM).handleClick({
      target: null,
      type: 'mouseup',
      clientX: 0,
      clientY: 1000,
    });
    await nextTick();
    expect(
      predefineWrapper
        .find('.lp-color-predefine__color-selector:nth-child(4)')
        .classes(),
    ).not.toContain('selected');
    mockHueSlideRect.mockRestore();
    mockThumbDom.mockRestore();
    mockHueSlideOffsetHeight.mockRestore();
  });
  test('should not execute activeChange event', async () => {
    const onActiveChange = vi.fn();
    const color = ref('#20A0FF');
    const wrapper = mount(() => (
      <ColorPicker value={color.value} onActiveChange={onActiveChange} />
    ));

    await nextTick();
    expect(onActiveChange).not.toHaveBeenCalled();
    wrapper.unmount();
  });

  describe('form item accessibility integration', () => {
    test('automatic id attachment', async () => {
      const wrapper = mount(() => (
        <LpFormItem label="Foobar" data-test-ref="item">
          <ColorPicker />
        </LpFormItem>
      ));

      await nextTick();
      const formItem = wrapper.find('[data-test-ref="item"]');
      const formItemLabel = formItem.find('.lp-form-item__label');
      const colorPickerButton = wrapper.find('.lp-color-picker');
      expect(formItem.attributes().role).toBeFalsy();
      expect(formItemLabel.attributes().for).toBe(
        colorPickerButton.attributes().id,
      );
    });

    test('specified id attachment', async () => {
      const wrapper = mount(() => (
        <LpFormItem label="Foobar" data-test-ref="item">
          <ColorPicker id="foobar" />
        </LpFormItem>
      ));

      await nextTick();
      const formItem = wrapper.find('[data-test-ref="item"]');
      const formItemLabel = formItem.find('.lp-form-item__label');
      const colorPickerButton = wrapper.find('.lp-color-picker');
      expect(formItem.attributes().role).toBeFalsy();
      expect(colorPickerButton.attributes().id).toBe('foobar');
      expect(formItemLabel.attributes().for).toBe(
        colorPickerButton.attributes().id,
      );
    });

    test('form item role is group when multiple inputs', async () => {
      const wrapper = mount(() => (
        <LpFormItem label="Foobar" data-test-ref="item">
          <ColorPicker />
          <ColorPicker />
        </LpFormItem>
      ));

      await nextTick();
      const formItem = wrapper.find('[data-test-ref="item"]');
      expect(formItem.attributes().role).toBe('group');
    });
  });
});
