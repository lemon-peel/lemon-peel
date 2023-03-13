import { nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { describe, expect, test, vi } from 'vitest';
import { LpFormItem } from '@lemon-peel/components/form';
import Checkbox from '../src/Checkbox.vue';
import CheckboxButton from '../src/CheckboxButton.vue';
import CheckboxGroup from '../src/CheckboxGroup.vue';

import type { CheckboxValueType } from '../src/checkbox';

describe('Checkbox', () => {
  test('create', async () => {
    const checked = ref(false);
    const wrapper = mount(
      () => <Checkbox v-model:checked={checked.value} value="a" />,
      { attachTo: 'body' },
    );

    expect(wrapper.classes()).toContain('lp-checkbox');
    expect(wrapper.classes()).not.toContain('is-disabled');
    await wrapper.trigger('click');
    expect(wrapper.classes()).toContain('is-checked');
    await wrapper.trigger('click');
    expect(wrapper.classes('is-checked')).toBe(false);
  });

  describe('no v-model', () => {
    test('checkbox without label', async () => {
      const checked = ref(false);
      const wrapper = mount(() => <Checkbox checked={checked.value} value="a" />, { attachTo: 'body' });

      expect(wrapper.classes()).not.toContain('is-checked');
    });

    test('checkbox with label attribute', async () => {
      const checked = ref(false);
      const wrapper = mount(() => (
        <Checkbox checked={checked.value} value="a" label='a' />
      ));

      expect(wrapper.classes()).not.toContain('is-checked');
    });
  });

  describe('disabled', () => {
    test('checkbox without label', async () => {
      const checked = ref(false);
      const wrapper = mount(() => (
        <LpFormItem label="test">
          <Checkbox v-model:checked={checked.value} value="a" disabled />
        </LpFormItem>
      ));

      const checkbox = wrapper.findComponent(Checkbox);
      expect(checkbox.classes()).toContain('is-disabled');
      expect(checked.value).toBe(false);
      await checkbox.trigger('click');
      await nextTick();
      expect(checkbox.classes()).toContain('is-disabled');
      expect(checked.value).toBe(false);
    });

    test('checkbox with label attribute', async () => {
      const checked = ref(false);
      const wrapper = mount(() => (
        <Checkbox v-model={checked.value} disabled label="a" value="a" />
      ));

      expect(wrapper.classes()).toContain('is-disabled');
      expect(checked.value).toBe(false);
      await wrapper.trigger('click');
      await nextTick();
      expect(wrapper.classes()).toContain('is-disabled');
      expect(checked.value).toBe(false);
    });
  });

  describe('change event', () => {
    test('checkbox without label', async () => {
      const checked = ref(false);
      const data = ref();
      const onChange = (val: CheckboxValueType) => (data.value = val);
      const wrapper = mount(() => (
        <LpFormItem label="test">
          <Checkbox v-model:checked={checked.value} value="a" onChange={onChange} />
        </LpFormItem>
      ));

      await wrapper.findComponent(Checkbox).trigger('click');
      expect(data.value).toBe(true);
    });

    test('checkbox with label attribute', async () => {
      const checked = ref(false);
      const data = ref();
      const onChange = (val: CheckboxValueType) => (data.value = val);
      const wrapper = mount(() => (
        <Checkbox v-model:checked={checked.value} onChange={onChange} value="Foobar" />
      ), { attachTo: 'body' });

      await wrapper.trigger('click');
      expect(data.value).toBe(true);
    });

    test('checkbox with label as slot content', async () => {
      const checked = ref(false);
      const data = ref();
      const onChange = (val: CheckboxValueType) => (data.value = val);
      const wrapper = mount(() => (
        <Checkbox v-model:checked={checked.value} onChange={onChange} value="Foobar">Foobar</Checkbox>
      ), { attachTo: 'body' });

      await wrapper.trigger('click');
      expect(data.value).toBe(true);
    });

    test('checkbox is wrapped in label', async () => {
      const checked = ref(true);
      const data = ref();
      const onChange = (val: CheckboxValueType) => (data.value = val);
      const wrapper = mount(() => (
        <LpFormItem label="test">
          <label>
            <Checkbox v-model:checked={checked.value} value="a" onChange={onChange} />
          </label>
        </LpFormItem>
      ), { attachTo: 'body' });

      await wrapper.findComponent(Checkbox).trigger('click');
      expect(data.value).toBe(false);
    });
  });

  test('checkbox group', async () => {
    const checkList = ref([]);
    const wrapper = mount(() => (
      <CheckboxGroup v-model:value={checkList.value}>
        <Checkbox label="a" value="a" />
        <Checkbox label="b" value="b" />
        <Checkbox label="c" value="c" />
        <Checkbox label="d" value="d" />
      </CheckboxGroup>
    ), { attachTo: 'body' });

    expect(checkList.value.length).toBe(0);

    const checkboxList = wrapper.findAll('.lp-checkbox')!;
    await checkboxList.at(0)!.trigger('click');
    expect(checkList.value.length).toBe(1);
    expect(checkList.value).toContain('a');

    await checkboxList.at(1)!.trigger('click');
    expect(checkList.value.length).toBe(2);
    expect(checkList.value).toContain('a');
    expect(checkList.value).toContain('b');
  });

  test('checkbox group without modelValue', async () => {
    const checkList = ref([]);
    const wrapper = mount(() => (
      <CheckboxGroup v-model:value={checkList.value}>
        <Checkbox label="a" value="a" />
        <Checkbox label="b" value="b" />
        <Checkbox label="c" value="c" />
        <Checkbox label="d" value="d" />
      </CheckboxGroup>
    ), { attachTo: 'body' });

    await wrapper.find('.lp-checkbox').trigger('click');
    expect(checkList.value.length).toBe(1);
    expect(checkList.value).toContain('a');
  });

  test('checkbox group change', async () => {
    const checkList = ref([]);
    const data = ref<CheckboxValueType[]>([]);
    const onChange = (val: CheckboxValueType[]) => (data.value = val);
    const wrapper = mount(() => (
      <CheckboxGroup v-model={checkList.value} onChange={onChange}>
        <Checkbox label="a" value="a" />
        <Checkbox label="b" value="b" />
      </CheckboxGroup>
    ), { attachTo: 'body' });

    await wrapper.find('.lp-checkbox').trigger('click');
    await nextTick();
    expect(data.value.length).toBe(1);
    expect(data.value).toEqual(['a']);
  });

  test('nested group', async () => {
    const checkList = ref([]);
    const wrapper = mount(() => (
      <CheckboxGroup v-model:value={checkList.value}>
        <Checkbox label="a" value="a" />
        <Checkbox label="b" value="b" />
        <Checkbox label="c" value="c" />
        <Checkbox label="d" value="d" />
      </CheckboxGroup>
    ), { attachTo: 'body' });

    expect(checkList.value.length).toBe(0);
    await wrapper.find('.lp-checkbox').trigger('click');
    expect(checkList.value).toEqual(['a']);
  });

  test('check', () => {
    const checklist = ref(['a']);
    const wp = mount(() => (
      <CheckboxGroup v-model:value={checklist.value}>
          <Checkbox label="a" value="a" />
      </CheckboxGroup>
    ), { attachTo: 'body' });

    expect(wp.find('.lp-checkbox').classes()).toContain('is-checked');
  });

  test('label is object', async () => {
    const checklist = ref([]);
    const wrapper = mount(() => (
      <CheckboxGroup v-model:value={checklist.value}>
        <Checkbox value={{ a: 1 }}>a1</Checkbox>
        <Checkbox value={{ a: 2 }}>a2</Checkbox>
        <Checkbox value={{ b: 1 }}>b1</Checkbox>
      </CheckboxGroup>
    ), { attachTo: 'body' });

    const checkbox = wrapper.find('.lp-checkbox');
    await checkbox.trigger('click');
    expect(checklist.value[0]).toEqual({ a: 1 });
    expect(checkbox.classes()).contains('is-checked');
  });

  test('label is object with initial values', async () => {
    const checklist = ref([{ a: 1 }]);
    const wrapper = mount(() => (
      <CheckboxGroup v-model:value={checklist.value}>
        <Checkbox value={{ a: 1 }}> a1 </Checkbox>
        <Checkbox value={{ a: 2 }}> a2 </Checkbox>
        <Checkbox value={{ b: 1 }}> b-1 </Checkbox>
      </CheckboxGroup>
    ), { attachTo: 'body' });

    expect(checklist.value.length).toBe(1);
    const checkboxList = wrapper.findAll('.lp-checkbox');
    const checkboxA1 = checkboxList.at(0)!;
    const checkboxA2 = checkboxList.at(1)!;
    await checkboxA2.trigger('click');
    expect(checklist.value).toEqual([{ a: 1 }, { a: 2 }]);
    expect(checkboxA1.classes()).contains('is-checked');
    expect(checkboxA2.classes()).contains('is-checked');
    await checkboxA1.trigger('click');
    expect(checklist.value).toEqual([{ a: 2 }]);
    expect(checkboxA1.classes()).not.contains('is-checked');
  });
});

describe('Check Button', () => {
  test('create', async () => {
    const checked = ref(false);
    const wrapper = mount(() => (
      <CheckboxButton v-model:checked={checked.value} value="a" />
    ), { attachTo: 'body' });

    expect(wrapper.classes()).toContain('lp-checkbox-button');
    await wrapper.trigger('click');
    expect(wrapper.classes()).toContain('is-checked');
    await wrapper.trigger('click');
    expect(wrapper.classes('is-checked')).toBe(false);
  });

  test('disabled', async () => {
    const checked = ref(false);
    const wrapper = mount(() => (
      <CheckboxButton v-model:checked={checked.value} disabled value="a" />
    ));

    expect(wrapper.classes()).toContain('is-disabled');
    await wrapper.trigger('click');
    expect(wrapper.classes()).toContain('is-disabled');
  });

  test('change event', async () => {
    const checked = ref(false);
    const data = ref();
    const onChange = vi.fn((val: CheckboxValueType) => (data.value = val));

    const wrapper = mount(() => (
      <CheckboxButton v-model:checked={checked.value} onChange={onChange} value="a" />
    ), { attachTo: 'body' });

    await wrapper.trigger('click');
    expect(onChange).toBeCalledTimes(1);
    expect(data.value).toBe(true);
  });

  test('button group change', async () => {
    const checkList = ref([]);
    const wrapper = mount(() => (
      <CheckboxGroup v-model:value={checkList.value}>
        <CheckboxButton value="a" ref="a" />
        <CheckboxButton value="b" ref="b" />
        <CheckboxButton value="c" ref="c" />
        <CheckboxButton value="d" ref="d" />
      </CheckboxGroup>
    ), { attachTo: 'body' });

    const checkboxList = wrapper.findAll('.lp-checkbox-button');
    await checkboxList.at(1)!.trigger('click');
    expect(checkList.value).toEqual(['b']);
    await checkboxList.at(2)!.trigger('click');
    expect(checkList.value).toEqual(['b', 'c']);
  });

  test('button group props', () => {
    const checkList = ref(['a', 'b']);
    const wrapper = mount(() => (
      <CheckboxGroup v-model:value={checkList.value} size="large" fill="#ff0000" text-color="#000" >
        <CheckboxButton value="a" label="A"/>
        <CheckboxButton value="b" label="B" />
        <CheckboxButton value="c" label="C" />
        <CheckboxButton value="d" label="D" />
      </CheckboxGroup>
    ), { attachTo: 'body' });

    const checkbox = wrapper.find('.lp-checkbox-button');
    expect(checkList.value.length).toBe(2);
    expect(checkbox.classes()).contains('is-checked');
    expect(
      checkbox.find('.lp-checkbox-button__inner').attributes('style'),
    ).contains('border-color: #ff0000;');
  });

  test('button group tag', () => {
    const checkList = ref(['a', 'b']);
    const wrapper = mount(() => (
      <CheckboxGroup v-model={checkList.value} tag="tr">
        <CheckboxButton label="a" ref="a" />
        <CheckboxButton label="b" ref="b" />
        <CheckboxButton label="c" ref="c" />
        <CheckboxButton label="d" ref="d" />
      </CheckboxGroup>
    ));

    expect(wrapper.find('tr').classes('lp-checkbox-group')).toBeTruthy();
  });

  test('nested group', async () => {
    const checkList = ref([]);
    const wrapper = mount(() => (
      <CheckboxGroup v-model:value={checkList.value}>
        <CheckboxButton label="a" value="a" />
        <CheckboxButton label="b" value="b" />
        <CheckboxButton label="c" value="c" />
        <CheckboxButton label="d" value="d" />
      </CheckboxGroup>
    ), { attachTo: 'body' });

    expect(checkList.value.length).toBe(0);
    await wrapper.find('.lp-checkbox-button').trigger('click');
    expect(checkList.value).toEqual(['a']);
  });

  describe('checked prop', () => {
    test('checked', () => {
      const wrapper = mount(() => <Checkbox checked />);

      expect(wrapper.find('.lp-checkbox').classes()).contains('is-checked');
    });
  });

  describe('form item accessibility integration', () => {
    test('checkbox, no label, automatic label attachment', async () => {
      const wrapper = mount(() => (
        <LpFormItem label="test">
          <Checkbox />
        </LpFormItem>
      ));

      const formItem = await wrapper.findComponent(LpFormItem);
      const checkbox = await wrapper.findComponent(Checkbox);
      const formItemLabel = formItem.find('.lp-form-item__label');
      const checkboxInput = checkbox.find('.lp-checkbox__original');
      expect(checkboxInput.attributes('id')).toBe(
        formItemLabel.attributes('for'),
      );
    });

    test('checkbox with label, form item is group', async () => {
      const wrapper = mount(() => (
        <LpFormItem label="test">
          <Checkbox label="Foo" />
        </LpFormItem>
      ));

      const formItem = await wrapper.findComponent(LpFormItem);
      const checkbox = await wrapper.findComponent(Checkbox);
      const checkboxLabel = checkbox.find('.lp-checkbox__label');
      const checkboxInput = checkbox.find('.lp-checkbox__original');
      expect(checkboxLabel.element.textContent).toBe('Foo');
      expect(checkboxInput.attributes('id')).toBeFalsy();
      expect(formItem.attributes('role')).toBe('group');
    });

    test('single checkbox group in form item', async () => {
      const wrapper = mount(() => (
        <LpFormItem label="test">
          <CheckboxGroup>
            <Checkbox label="Foo" />
            <Checkbox label="Bar" />
          </CheckboxGroup>
        </LpFormItem>
      ));

      const formItem = await wrapper.findComponent(LpFormItem);
      const checkboxGroup = await wrapper.findComponent(CheckboxGroup);
      const formItemLabel = formItem.find('.lp-form-item__label');
      expect(formItem.attributes('role')).toBeFalsy();
      expect(checkboxGroup.attributes('role')).toBe('group');
      expect(formItemLabel.attributes('for')).toBe(
        checkboxGroup.attributes('id'),
      );
      expect(formItemLabel.attributes('id')).toBe(
        checkboxGroup.attributes('aria-labelledby'),
      );
    });

    test('single checkbox group in form item, override label', async () => {
      const wrapper = mount(() => (
        <LpFormItem label="test">
          <CheckboxGroup label="Foo">
            <Checkbox label="Foo" />
            <Checkbox label="Bar" />
          </CheckboxGroup>
        </LpFormItem>
      ));

      const formItem = await wrapper.findComponent(LpFormItem);
      const checkboxGroup = await wrapper.findComponent(CheckboxGroup);
      const formItemLabel = formItem.find('.lp-form-item__label');
      expect(formItemLabel.attributes('for')).toBe(
        checkboxGroup.attributes('id'),
      );
      expect(checkboxGroup.attributes('role')).toBe('group');
      expect(checkboxGroup.attributes()['aria-label']).toBe('Foo');
      expect(checkboxGroup.attributes()['aria-labelledby']).toBeFalsy();
    });

    test('multiple checkbox groups in form item', async () => {
      const wrapper = mount({
        setup() {
          return () => (
            <LpFormItem label="test">
              <CheckboxGroup label="Foo" ref="checkboxGroup1">
                <Checkbox label="Foo" />
                <Checkbox label="Bar" />
              </CheckboxGroup>
              <CheckboxGroup label="Bar" ref="checkboxGroup2">
                <Checkbox label="Foo" />
                <Checkbox label="Bar" />
              </CheckboxGroup>
            </LpFormItem>
          );
        },
      });

      const formItem = await wrapper.findComponent(LpFormItem);
      const checkboxGroup1 = await wrapper.findComponent({
        ref: 'checkboxGroup1',
      });
      const checkboxGroup2 = await wrapper.findComponent({
        ref: 'checkboxGroup2',
      });
      const formItemLabel = formItem.find('.lp-form-item__label');
      expect(formItem.attributes('role')).toBe('group');
      expect(formItem.attributes()['aria-labelledby']).toBe(
        formItemLabel.attributes('id'),
      );
      expect(checkboxGroup1.attributes('role')).toBe('group');
      expect(checkboxGroup1.attributes()['aria-label']).toBe('Foo');
      expect(checkboxGroup1.attributes()['aria-labelledby']).toBeFalsy();
      expect(checkboxGroup2.attributes('role')).toBe('group');
      expect(checkboxGroup2.attributes()['aria-label']).toBe('Bar');
      expect(checkboxGroup2.attributes()['aria-labelledby']).toBeFalsy();
    });
  });
});
