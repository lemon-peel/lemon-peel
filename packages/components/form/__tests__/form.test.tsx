
import { nextTick, reactive, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { rAF } from '@lemon-peel/test-utils/tick';
import installStyle from '@lemon-peel/test-utils/stylePlugin';
import { LpCheckbox as Checkbox, LpCheckboxGroup as CheckboxGroup } from '@lemon-peel/components/checkbox';
import Input from '@lemon-peel/components/input';
import Form from '../src/Form.vue';
import FormItem from '../src/FormItem.vue';
import DynamicDomainForm, { formatDomainError } from '../mocks/mockData';

import type { MockedFunction } from 'vitest';
import type { VueWrapper } from '@vue/test-utils';
import type { FormRules } from '@lemon-peel/tokens';

type FormInstance = InstanceType<typeof Form>;
type FormItemInstance = InstanceType<typeof FormItem>;

const findStyle = (wrapper: VueWrapper<any>, selector: string) =>
  wrapper.find<HTMLElement>(selector).element.style

;(globalThis as any).ASYNC_VALIDATOR_NO_WARNING = 1;

describe('Form', () => {
  beforeAll(() => {
    installStyle();
  });

  it('label width', async () => {
    const wrapper = mount({
      setup() {
        const form = reactive({
          name: '',
        });
        return () => (
          <Form ref="form" model={form} labelWidth="80px">
            <FormItem label="Activity Name">
              <Input v-model:value={form.name} />
            </FormItem>
          </Form>
        );
      },
    });
    expect(findStyle(wrapper, '.lp-form-item__label').width).toBe('80px');
  });

  it('auto label width', async () => {
    const labelPosition = ref('right');
    const wrapper = mount({
      setup() {
        const form = reactive({
          name: '',
          intro: '',
        });
        return () => (
          <Form
            ref="form"
            model={form}
            labelWidth="auto"
            labelPosition={labelPosition.value as any}
          >
            <FormItem label="Name">
              <Input v-model:value={form.name} />
            </FormItem>
            <FormItem label="Intro">
              <Input v-model:value={form.intro} />
            </FormItem>
          </Form>
        );
      },
    });

    await nextTick();

    const formItems = wrapper.findAll<HTMLElement>('.lp-form-item__content');
    const marginLeft = Number.parseInt(
      formItems[0].element.style.marginLeft,
      10,
    );
    const marginLeft1 = Number.parseInt(
      formItems[1].element.style.marginLeft,
      10,
    );
    expect(marginLeft).toEqual(marginLeft1);

    labelPosition.value = 'left';
    await nextTick();

    const formItems1 = wrapper.findAll<HTMLElement>('.lp-form-item__content');
    const marginRight = Number.parseInt(
      formItems1[0].element.style.marginRight,
      10,
    );
    const marginRight1 = Number.parseInt(
      formItems1[1].element.style.marginRight,
      10,
    );
    expect(marginRight).toEqual(marginRight1);
  });

  it('form-item auto label width', async () => {
    const wrapper = mount({
      setup() {
        const form = reactive({
          name: '',
          region: '',
          type: '',
        });
        return () => (
          <Form
            ref="form"
            labelPosition="right"
            labelWidth="150px"
            model={form}
          >
            <FormItem label="名称">
              <Input v-model:value={form.name} />
            </FormItem>
            <FormItem label="活动区域" label-width="auto">
              <Input v-model:value={form.region} />
            </FormItem>
            <FormItem
              label="活动形式(我是一个很长很长很长很长的label)"
              label-width="auto"
            >
              <Input v-model:value={form.type} />
            </FormItem>
          </Form>
        );
      },
    });

    await nextTick();

    const formItemLabels = wrapper.findAll<HTMLElement>('.lp-form-item__label');
    const formItemLabelWraps = wrapper.findAll<HTMLElement>(
      '.lp-form-item__label-wrap',
    );

    const labelWrapMarginLeft1 = formItemLabelWraps[0].element.style.marginLeft;
    const labelWrapMarginLeft2 = formItemLabelWraps[1].element.style.marginLeft;
    expect(labelWrapMarginLeft1).toEqual(labelWrapMarginLeft2);
    expect(labelWrapMarginLeft2).toEqual('');

    const labelWidth0 = Number.parseInt(
      formItemLabels[0].element.style.width,
      10,
    );
    expect(labelWidth0).toEqual(150);
    const labelWidth1 = formItemLabels[1].element.style.width;
    const labelWidth2 = formItemLabels[2].element.style.width;
    expect(labelWidth1).toEqual(labelWidth2);
    expect(labelWidth2).toEqual('auto');
  });

  it('inline form', () => {
    const wrapper = mount({
      setup() {
        const form = reactive({
          name: '',
          address: '',
        });
        return () => (
          <Form ref="form" model={form} inline>
            <FormItem>
              <Input v-model:value={form.name} />
            </FormItem>
            <FormItem>
              <Input v-model:value={form.address} />
            </FormItem>
          </Form>
        );
      },
    });
    expect(wrapper.classes()).toContain('lp-form--inline');
  });

  it('label position', () => {
    const wrapper = mount({
      setup() {
        const form = reactive({
          name: '',
          address: '',
        });
        return () => (
          <div>
            <Form model={form} labelPosition="top" ref="labelTop">
              <FormItem>
                <Input v-model:value={form.name} />
              </FormItem>
              <FormItem>
                <Input v-model:value={form.address} />
              </FormItem>
            </Form>
            <Form model={form} labelPosition="left" ref="labelLeft">
              <FormItem>
                <Input v-model:value={form.name} />
              </FormItem>
              <FormItem>
                <Input v-model:value={form.address} />
              </FormItem>
            </Form>
            <Form model={form} ref="labelRight">
              <FormItem>
                <Input v-model:value={form.name} />
              </FormItem>
              <FormItem>
                <Input v-model:value={form.address} />
              </FormItem>
            </Form>
          </div>
        );
      },
    });
    expect(wrapper.findComponent({ ref: 'labelTop' }).classes()).toContain(
      'lp-form--label-top',
    );
    expect(wrapper.findComponent({ ref: 'labelLeft' }).classes()).toContain(
      'lp-form--label-left',
    );
    expect(wrapper.findComponent({ ref: 'labelRight' }).classes()).toContain(
      'lp-form--label-right',
    );
  });

  it('label size', () => {
    const wrapper = mount({
      setup() {
        const form = reactive({
          name: '',
        });
        return () => (
          <div>
            <div>
              <Form model={form} size="small" ref="labelSmall">
                <FormItem>
                  <Input v-model:value={form.name} />
                </FormItem>
              </Form>
            </div>
          </div>
        );
      },
    });
    expect(wrapper.findComponent(FormItem).classes()).toContain(
      'lp-form-item--small',
    );
  });

  it('show message', async () => {
    const wrapper = mount({
      setup() {
        const form = reactive({
          name: '',
        });
        return () => (
          <Form model={form} ref="form">
            <FormItem
              label="Name"
              prop="name"
              showMessage={false}
              rules={{
                required: true,
                message: 'Please input name',
                trigger: 'change',
                min: 3,
                max: 6,
              }}
            >
              <Input v-model:value={form.name} />
            </FormItem>
          </Form>
        );
      },
    });
    const form = wrapper.findComponent(Form).vm as FormInstance;

    vi.useFakeTimers();
    const valid = await form
      .validate()
      .then(() => true)
      .catch(() => false);
    vi.runAllTimers();
    vi.useRealTimers();

    await nextTick();
    expect(valid).toBe(false);
    expect(wrapper.find('.lp-form-item__error').exists()).toBe(false);
  });

  it('reset field', async () => {
    vi.useFakeTimers();
    const form = reactive({
      name: '',
      address: '',
      type: new Array<string>(),
    });

    const wrapper = mount({
      setup() {
        const rules: FormRules = {
          name: [
            { required: true, message: 'Please input name', trigger: 'blur' },
          ],
          address: [
            {
              required: true,
              message: 'Please input address',
              trigger: 'change',
            },
          ],
          type: [
            {
              type: 'array',
              required: true,
              message: 'Please input type',
              trigger: 'change',
            },
          ],
        };
        return () => (
          <Form ref="form" model={form} rules={rules}>
            <FormItem label="name" prop="name">
              <Input v-model:value={form.name} ref="fieldName" />
            </FormItem>
            <FormItem label="address" prop="address">
              <Input v-model:value={form.address} ref="fieldAddr" />
            </FormItem>
            <FormItem label="type" prop="type">
              <CheckboxGroup v-model:value={form.type}>
                <Checkbox label="type1" name="type" />
                <Checkbox label="type2" name="type" />
                <Checkbox label="type3" name="type" />
                <Checkbox label="type4" name="type" />
              </CheckboxGroup>
            </FormItem>
          </Form>
        );
      },
    });

    form.name = 'jack';
    form.address = 'aaaa';
    form.type.push('type1');

    const formRef = wrapper.findComponent({ ref: 'form' }).vm as FormInstance;
    formRef.resetFields();
    // first await waits for the validation to be dispatched.
    await nextTick();
    // after validation dispatched, it will update `validateStateDebounced` with a 100ms delay.
    // That's why we put this `vi.runAllTimers` here.
    vi.runAllTimers();
    // after timer fired, we should wait for the UI to be updated.
    await nextTick();
    expect(form.name).toBe('');
    expect(form.address).toBe('');
    expect(form.type.length).toBe(0);
    expect(wrapper.findAll('.lp-form-item__error')).toHaveLength(0);
    vi.useRealTimers();
  });

  it('clear validate', async () => {
    const wrapper = mount({
      setup() {
        const form = reactive({
          name: '',
          address: '',
          type: [],
        });

        const rules: FormRules = reactive({
          name: [
            { required: true, message: 'Please input name', trigger: 'blur' },
          ],
          address: [
            {
              required: true,
              message: 'Please input address',
              trigger: 'change',
            },
          ],
          type: [
            {
              type: 'array',
              required: true,
              message: 'Please input type',
              trigger: 'change',
            },
          ],
        });

        return () => (
          <Form ref="form" model={form} rules={rules}>
            <FormItem label="name" prop="name" ref="name">
              <Input v-model:value={form.name} />
            </FormItem>
            <FormItem label="address" prop="address" ref="address">
              <Input v-model:value={form.address} />
            </FormItem>
            <FormItem label="type" prop="type">
              <CheckboxGroup v-model:value={form.type}>
                <Checkbox label="type1" name="type" />
                <Checkbox label="type2" name="type" />
                <Checkbox label="type3" name="type" />
                <Checkbox label="type4" name="type" />
              </CheckboxGroup>
            </FormItem>
          </Form>
        );
      },
    });

    const form = wrapper.findComponent({ ref: 'form' }).vm as FormInstance;
    const nameField = wrapper.findComponent({ ref: 'name' })
      .vm as FormItemInstance;
    const addressField = wrapper.findComponent({ ref: 'address' })
      .vm as FormItemInstance;
    await form.validate().catch(() => {});
    await nextTick();
    expect(nameField.validateMessage).toBe('Please input name');
    expect(addressField.validateMessage).toBe('Please input address');
    form.clearValidate(['name']);
    await nextTick();
    expect(nameField.validateMessage).toBe('');
    expect(addressField.validateMessage).toBe('Please input address');
    form.clearValidate();
    await nextTick();
    expect(addressField.validateMessage).toBe('');
  });

  it('scroll to field', () => {
    const wrapper = mount({
      setup() {
        return () => (
          <div>
            <Form ref="form">
              <FormItem prop="name" ref="formItem">
                <Input />
              </FormItem>
            </Form>
          </div>
        );
      },
    });

    const oldScrollIntoView = window.HTMLElement.prototype.scrollIntoView;

    const scrollIntoViewMock = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = function () {
      scrollIntoViewMock(this);
    };

    const form = wrapper.findComponent({ ref: 'form' }).vm as FormInstance;
    form.scrollToField('name');
    expect(scrollIntoViewMock).toHaveBeenCalledWith(
      wrapper.findComponent({ ref: 'formItem' }).element,
    );

    window.HTMLElement.prototype.scrollIntoView = oldScrollIntoView;
  });

  it('validate return parameters', async () => {
    const form = reactive({
      name: 'test',
      age: '',
    });

    const wrapper = mount({
      setup() {
        const rules = reactive({
          name: [
            { required: true, message: 'Please input name', trigger: 'blur' },
          ],
          age: [
            { required: true, message: 'Please input age', trigger: 'blur' },
          ],
        });
        return () => (
          <Form
            ref="formRef"
            model={form}
            rules={rules}
            onSubmit="return false"
          >
            <FormItem prop="name" label="name">
              <Input v-model:value={form.name} />
            </FormItem>
            <FormItem prop="age" label="age">
              <Input v-model:value={form.age} />
            </FormItem>
          </Form>
        );
      },
    });
    const vm = wrapper.vm;

    function validate() {
      return (vm.$refs.formRef as FormInstance)
        .validate()
        .then(() => ({ valid: true, fields: undefined }))
        .catch(error => ({ valid: false, fields: error }));
    }

    let res = await validate();
    expect(res.valid).toBe(false);
    expect(Object.keys(res.fields).length).toBe(1);
    form.name = '';
    await nextTick();

    res = await validate();
    expect(res.valid).toBe(false);
    expect(Object.keys(res.fields).length).toBe(2);

    form.name = 'test';
    form.age = 'age';
    await nextTick();
    res = await validate();
    expect(res.valid).toBe(true);
    expect(res.fields).toBe(undefined);
  });

  it('validate status', async () => {
    const form = reactive({
      age: '20',
    });

    const wrapper = mount({
      setup() {
        const rules = ref({
          age: [
            { required: true, message: 'Please input age', trigger: 'change' },
          ],
        });
        return () => (
          <Form ref="formRef" model={form} rules={rules.value}>
            <FormItem ref="age" prop="age" label="age">
              <Input v-model:value={form.age} />
            </FormItem>
          </Form>
        );
      },
    });

    await (wrapper.vm.$refs.formRef as FormInstance)
      .validate()
      .catch(() => {});
    const ageField = wrapper.findComponent({ ref: 'age' });
    expect(ageField.classes('is-success')).toBe(true);
    expect(ageField.classes()).toContain('is-success');
  });

  describe('FormItem', () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();
    let wrapper: VueWrapper<InstanceType<typeof DynamicDomainForm>>;
    const createComponent = (onSubmit?: MockedFunction<any>) => {
      wrapper = mount(DynamicDomainForm, {
        props: {
          onSuccess,
          onError,
          onSubmit,
        },
      });
    };

    const findSubmitButton = () => wrapper.find('.submit');
    const findAddDomainButton = () => wrapper.find('.add-domain');
    const findDeleteDomainButton = () => wrapper.findAll('.delete-domain');
    const findDomainItems = () => wrapper.findAll('.domain-item');

    beforeEach(() => {
      createComponent();
    });

    afterEach(() => {
      wrapper.unmount();
    });

    it('should register form item', async () => {
      expect(findDomainItems()).toHaveLength(1);
      await findSubmitButton().trigger('click');
      // wait for AsyncValidator to be resolved
      await rAF();
      expect(onError).toHaveBeenCalled();
    });

    it('should dynamically register form with items', async () => {
      await findAddDomainButton().trigger('click');
      expect(findDomainItems()).toHaveLength(2);

      await findSubmitButton().trigger('click');
      // wait for AsyncValidator to be resolved
      await rAF();
      expect(onError).toHaveBeenCalledWith(formatDomainError(2));
      const deleteBtns = findDeleteDomainButton();
      expect(deleteBtns).toHaveLength(2);
      await findDeleteDomainButton().at(1)!.trigger('click');
      expect(findDomainItems()).toHaveLength(1);
      await findSubmitButton().trigger('click');
      // wait for AsyncValidator to be resolved
      await rAF();
      expect(onError).toHaveBeenLastCalledWith(formatDomainError(1));
    });

    it('should not throw error when callback passed in', async () => {
      const onSubmit = vi.fn();
      createComponent(onSubmit);

      await findSubmitButton().trigger('click');
      await rAF();
      expect(onError).not.toHaveBeenCalled();
      expect(onSubmit).toHaveBeenCalled();
    });
  });
});
