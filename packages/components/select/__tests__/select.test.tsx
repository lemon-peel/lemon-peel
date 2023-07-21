import { defineComponent, markRaw, nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, test, vi } from 'vitest';
import { EVENT_CODE } from '@lemon-peel/constants';
import { ArrowDown, CaretTop, CircleClose } from '@element-plus/icons-vue';
import { POPPER_CONTAINER_ID } from '@lemon-peel/hooks';
import { hasClass } from '@lemon-peel/utils';
import { LpFormItem } from '@lemon-peel/components/form';
import LpSelect from '../src/Select.vue';
import LpOptionGroup from '../src/OptionGroup.vue';
import LpSelectOption from '../src/Option.vue';
import LpSelectDropdown from '../src/SelectDropdown.vue';
import { LpOption } from '..';


vi.mock('lodash-es', async () => {
  const actual: any = await vi.importActual('lodash-es');
  return {
    ...actual,
    debounce: vi.fn(fn => {
      fn.cancel = vi.fn();
      fn.flush = vi.fn();
      return fn;
    }),
  };
});

interface SelectProps {
  filterMethod?: any;
  remoteMethod?: any;
  multiple?: boolean;
  clearable?: boolean;
  filterable?: boolean;
  remote?: boolean;
  collapseTags?: boolean;
  automaticDropdown?: boolean;
  multipleLimit?: number;
  popperClass?: string;
  defaultFirstOption?: boolean;
  fitInputWidth?: boolean;
  size?: 'small' | 'default' | 'large';
}

const doMount = (template: string, data: any = () => ({}), otherObj?: any) =>
  mount(
    {
      components: {
        'lp-select': LpSelect,
        'lp-option': LpSelectOption,
        'lp-option-group': LpOptionGroup,
        'lp-form-item': LpFormItem,
      },
      template,
      data,
      ...otherObj,
    },
    {
      attachTo: 'body',
    },
  );

function getOptions(): HTMLElement[] {
  return [...document.querySelectorAll<HTMLElement>(
    'body > div:last-child .lp-select-dropdown__item',
  )];
}

type OptionProps = {
  value: number | string;
  label: string;
  disabled: boolean;
};

const getSelectVm = (
  configs: SelectProps = {},
  options?: OptionProps[],
) => {
  for (const config of [
    'multiple',
    'clearable',
    'defaultFirstOption',
    'filterable',
    'remote',
    'collapseTags',
    'automaticDropdown',
    'fitInputWidth',
  ] as (Array< keyof SelectProps>)) {
    configs[config as keyof SelectProps] = configs[config] || false;
  }

  configs.multipleLimit = configs.multipleLimit || 0;
  if (!options) {
    options = [
      { value: 1, label: '黄金糕', disabled: false },
      { value: 2, label: '双皮奶', disabled: false },
      { value: 3, label: '蚵仔煎', disabled: false },
      { value: 4, label: '龙须面', disabled: false },
      { value: 5, label: '北京烤鸭', disabled: false },
    ];
  }
  return doMount(`
    <lp-select
      ref="select"
      v-model:value="value"
      :multiple="multiple"
      :multiple-limit="multipleLimit"
      :popper-class="popperClass"
      :clearable="clearable"
      :default-first-option="defaultFirstOption"
      :filterable="filterable"
      :collapse-tags="collapseTags"
      :filterMethod="filterMethod"
      :remote="remote"
      :loading="loading"
      :remoteMethod="remoteMethod"
      :automatic-dropdown="automaticDropdown"
      :size="size"
      :fit-input-width="fitInputWidth">
      <lp-option
        v-for="item in options"
        :label="item.label"
        :key="item.value"
        :disabled="item.disabled"
        :value="item.value">
      </lp-option>
    </lp-select>
  `,
  () => ({
    options,
    multiple: configs.multiple,
    multipleLimit: configs.multipleLimit,
    clearable: configs.clearable,
    defaultFirstOption: configs.defaultFirstOption,
    filterable: configs.filterable,
    collapseTags: configs.collapseTags,
    popperClass: configs.popperClass,
    automaticDropdown: configs.automaticDropdown,
    fitInputWidth: configs.fitInputWidth,
    loading: false,
    filterMethod: configs.filterMethod,
    remote: configs.remote,
    remoteMethod: configs.remoteMethod,
    value: configs.multiple ? [] : '',
    size: configs.size || 'default',
  }),
  );
};


type OptionGrouped = {
  label: string;
  value?: string | number;
  options?: OptionGrouped[];
};

const getGroupSelectVm = (configs: SelectProps = {}, options?: OptionGrouped[]) => {
  for (const config of [
    'multiple',
    'clearable',
    'filterable',
    'remote',
    'collapseTags',
    'automaticDropdown',
    'fitInputWidth',
  ] as Array<keyof SelectProps>) {
    configs[config] = configs[config] || false;
  }
  configs.multipleLimit = configs.multipleLimit || 0;
  if (!options) {}
  return doMount(
    `<lp-select
      ref="select"
      v-model:value="value"
      :multiple="multiple"
      :multiple-limit="multipleLimit"
      :popper-class="popperClass"
      :clearable="clearable"
      :filterable="filterable"
      :collapse-tags="collapseTags"
      :filterMethod="filterMethod"
      :remote="remote"
      :loading="loading"
      :remoteMethod="remoteMethod"
      :automatic-dropdown="automaticDropdown"
      :fit-input-width="fitInputWidth">
     <lp-option-group
        v-for="group in options"
        :key="group.label"
        :disabled="group.disabled"
        :label="group.label">
        <lp-option
          v-for="item in group.options"
          :key="item.value"
          :label="item.label"
          :value="item.value"/>
      </lp-option-group>
    </lp-select>`,

    () => ({
      options,
      multiple: configs.multiple,
      multipleLimit: configs.multipleLimit,
      clearable: configs.clearable,
      filterable: configs.filterable,
      collapseTags: configs.collapseTags,
      popperClass: configs.popperClass,
      automaticDropdown: configs.automaticDropdown,
      fitInputWidth: configs.fitInputWidth,
      loading: false,
      filterMethod: configs.filterMethod,
      remote: configs.remote,
      remoteMethod: configs.remoteMethod,
      value: configs.multiple ? [] : '',
    }),
  );
};

describe('Select', () => {
  let wrapper: ReturnType<typeof doMount>;
  const findInnerInput = () =>
    wrapper.find('.lp-input__inner').element as HTMLInputElement;

  afterEach(() => {
    document.body.innerHTML = '';
  });

  test('create', async () => {
    wrapper = doMount(
      `<lp-select v-model:value="value"></lp-select>`,
      () => ({ value: '' }));
    expect(wrapper.classes()).toContain('lp-select');
    expect(findInnerInput().placeholder).toBe('Select');
    const select = wrapper.findComponent(LpSelect);
    await select.trigger('mouseenter');
    await select.trigger('click');
    await nextTick();
    expect((select.vm as any).visible).toBe(true);
  });

  test('options rendered correctly', () => {
    wrapper = getSelectVm();
    const options = wrapper.element.querySelectorAll(
      '.lp-select-dropdown__item',
    );
    const result = Array.prototype.every.call(options, (option, index) => {
      const text = option.querySelector('span').textContent;
      const vm = wrapper.vm as any;
      return text === vm.options[index].label;
    });
    expect(result).toBe(true);
  });

  test('custom dropdown class', () => {
    wrapper = getSelectVm({ popperClass: 'custom-dropdown' });
    const dropdown = wrapper.findComponent({ name: 'LpSelectDropdown' });
    expect(dropdown.classes()).toContain('custom-dropdown');
  });

  test('default value', async () => {
    const value = ref('选项2');
    const options = [
      { value: '选项1', label: '黄金糕' },
      { value: '选项2', label: '双皮奶' },
    ];
    wrapper = mount(
      () => <LpSelect v-model:value={value.value}>
        { options.map(item => <LpSelectOption label={item.label} key={item.value} value={item.value} />)}
      </LpSelect>,
      { attachTo: 'body' },
    );
    await nextTick();
    expect(findInnerInput().value).toBe('双皮奶');
  });

  test('set default value to object', async () => {
    wrapper = doMount(
      `
      <lp-select v-model:value="value">
        <lp-option
          v-for="item in options"
          :label="item.label"
          :key="item.value.value"
          :value="item.value">
        </lp-option>
      </lp-select>
    `,
      () => ({
        options: [
          { value: { value: '选项1' }, label: '黄金糕' },
          { value: { value: '选项2' }, label: '双皮奶' },
        ],
        value: { value: '选项2' },
      }),
    );
    await nextTick();

    expect(findInnerInput().value).toBe('双皮奶');
  });

  test('custom label', async () => {
    wrapper = doMount(
      `
      <lp-select v-model:value="value">
        <lp-option
          v-for="item in options"
          :label="item.name"
          :key="item.id"
          :value="item.id">
        </lp-option>
      </lp-select>
    `,
      () => ({
        options: [
          {
            id: 1,
            name: '黄金糕',
          },
          {
            id: 2,
            name: '双皮奶',
          },
        ],
        value: 2,
      }),
    );
    await nextTick();

    expect(findInnerInput().value).toBe('双皮奶');
  });

  test('custom label with object', async () => {
    wrapper = doMount(
      `<lp-select v-model:value="value" value-key="id">
        <lp-option
          v-for="item in options"
          :label="item.name"
          :key="item.id"
          :value="item">
        </lp-option>
      </lp-select>`,
      () => ({
        options: [
          {
            id: 1,
            name: '黄金糕',
          },
          {
            id: 2,
            name: '双皮奶',
          },
        ],
        value: {
          id: 2,
        },
      }),
    );
    await nextTick();

    expect(findInnerInput().value).toBe('双皮奶');
  });

  test('sync set value and options', async () => {
    wrapper = doMount(
      `<lp-select v-model:value="value">
        <lp-option
          v-for="item in options"
          :label="item.label"
          :key="item.value"
          :value="item.value">
        </lp-option>
      </lp-select>`,
      () => ({
        options: [
          {
            value: '选项1',
            label: '黄金糕',
          },
          {
            value: '选项2',
            label: '双皮奶',
          },
        ],
        value: '选项2',
      }),
    );
    const vm = wrapper.vm as any;
    vm.options = [
      {
        value: '选项1',
        label: '黄金糕',
      },
    ];
    vm.value = '选项1';
    await nextTick();
    expect(findInnerInput().value).toBe('黄金糕');
  });

  test('single select', async () => {
    wrapper = doMount(
      `<lp-select v-model:value="value" @change="handleChange">
        <lp-option
          v-for="item in options"
          :label="item.label"
          :key="item.value"
          :value="item.value">
          <p>{{item.label}} {{item.value}}</p>
        </lp-option>
      </lp-select>`,
      () => ({
        options: [
          { value: '选项1', label: '黄金糕' },
          { value: '选项2', label: '双皮奶' },
          { value: '选项3', label: '蚵仔煎' },
          { value: '选项4', label: '龙须面' },
          { value: '选项5', label: '北京烤鸭' },
        ],
        value: '',
        count: 0,
      }),
      {
        methods: {
          handleChange(this: any) {
            this.count++;
          },
        },
      },
    );

    await wrapper.find('.select-trigger').trigger('click');
    const options = getOptions();
    const vm = wrapper.vm as any;
    expect(vm.value).toBe('');
    expect(findInnerInput().value).toBe('');
    options[2].click();
    await nextTick();
    expect(vm.value).toBe('选项3');
    expect(findInnerInput().value).toBe('蚵仔煎');
    expect(vm.count).toBe(1);
    options[4].click();
    await nextTick();
    expect(vm.value).toBe('选项5');
    expect(findInnerInput().value).toBe('北京烤鸭');
    expect(vm.count).toBe(2);
  });

  test('disabled option', async () => {
    wrapper = getSelectVm();
    const vm = wrapper.vm as any;
    wrapper.find('.select-trigger').trigger('click');
    vm.options[1].disabled = true;
    await nextTick();
    const options = getOptions();
    expect(options[1].className).toContain('is-disabled');
    options[1].click();
    await nextTick();
    expect(vm.value).toBe('');
  });

  test('disabled select', () => {
    wrapper = doMount(`<lp-select disabled></lp-select>`);
    expect(wrapper.find('.lp-input').classes()).toContain('is-disabled');
  });

  test('group disabled option', () => {
    const optionGroupData = [
      {
        label: 'Australia',
        disabled: true,
        options: [
          {
            value: 'Sydney',
            label: 'Sydney',
          },
          {
            value: 'Melbourne',
            label: 'Melbourne',
          },
        ],
      },
    ];
    wrapper = getGroupSelectVm({}, optionGroupData);
    const options = wrapper.findAllComponents(LpSelectOption);
    expect(options[0].classes('is-disabled')).toBeTruthy();
  });

  test('keyboard operations when option-group is disabled', async () => {
    const optionGroupData = [
      {
        label: 'Australia',
        disabled: true,
        options: [
          { value: 'Sydney', label: 'Sydney' },
          { value: 'Melbourne', label: 'Melbourne' },
        ],
      },
      {
        label: 'China',
        options: [
          { value: 'Shanghai', label: 'Shanghai' },
          { value: 'Shenzhen', label: 'Shenzhen' },
          { value: 'Guangzhou', label: 'Guangzhou' },
          { value: 'Dalian', label: 'Dalian' },
        ],
      },
    ];

    wrapper = getGroupSelectVm({}, optionGroupData);
    const select = wrapper.findComponent(LpSelect);
    const vm = select.vm as any;
    let i = 8;
    while (i--) {
      vm.navigateOptions('next');
    }
    vm.navigateOptions('prev');
    vm.navigateOptions('prev');
    vm.navigateOptions('prev');
    await nextTick();
    vm.selectOption();
    await nextTick();
    expect((wrapper.vm as any).value).toBe('Dalian');
  });

  test('visible event', async () => {
    wrapper = doMount(
      `<lp-select v-model:value="value" @visible-change="handleVisibleChange">
        <lp-option
          v-for="item in options"
          :label="item.label"
          :key="item.value"
          :value="item.value">
        </lp-option>
      </lp-select>`,
      () => ({
        options: [],
        value: '',
        visible: '',
      }),
      {
        methods: {
          handleVisibleChange(this: any, val: boolean) {
            this.visible = val;
          },
        },
      },
    );
    const select = wrapper.findComponent(LpSelect);
    const vm = wrapper.vm as any;
    const selectVm = select.vm as any;
    selectVm.visible = true;
    await selectVm.$nextTick();
    expect(vm.visible).toBe(true);
  });

  test('keyboard operations', async () => {
    vi.useFakeTimers();
    wrapper = getSelectVm();
    const select = wrapper.findComponent(LpSelect);
    const vm = select.vm as any;
    let i = 8;
    while (i--) {
      vm.navigateOptions('next');
    }
    vm.navigateOptions('prev');
    vm.navigateOptions('prev');
    vm.navigateOptions('prev');
    await nextTick();
    expect(vm.hoverIndex).toBe(3);
    vm.selectOption();
    await nextTick();
    expect((wrapper.vm as any).value).toBe(4);
    vm.toggleMenu();

    vi.runAllTimers();
    await nextTick();

    vm.toggleMenu();
    await nextTick();
    expect(vm.hoverIndex).toBe(3);
    vi.useRealTimers();
  });

  test('clearable', async () => {
    wrapper = getSelectVm({ clearable: true });
    const select = wrapper.findComponent(LpSelect);
    const vm = wrapper.vm as any;
    const selectVm = select.vm as any;
    vm.value = '选项1';
    await nextTick();
    selectVm.inputHovering = true;
    await selectVm.$nextTick();
    const iconClear = wrapper.findComponent(CircleClose);
    expect(iconClear.exists()).toBe(true);
    await iconClear.trigger('click');
    expect(vm.value).toBe('');
  });

  test('suffix icon', async () => {
    wrapper = doMount(`<lp-select></lp-select>`);
    let suffixIcon = wrapper.findComponent(ArrowDown);
    expect(suffixIcon.exists()).toBe(true);
    await wrapper.setProps({ suffixIcon: markRaw(CaretTop) });
    suffixIcon = wrapper.findComponent(CaretTop);
    expect(suffixIcon.exists()).toBe(true);
  });

  test('test remote show suffix', async () => {
    wrapper = doMount(`<lp-select></lp-select>`);
    await wrapper.setProps({
      remote: true,
      filters: true,
      remoteShowSuffix: true,
    });

    const suffixIcon = wrapper.findComponent(ArrowDown);
    expect(suffixIcon.exists()).toBe(true);
  });

  test('fitInputWidth', async () => {
    wrapper = getSelectVm({ fitInputWidth: true });
    const selectWrapper = wrapper.findComponent(LpSelect);
    const selectDom = selectWrapper.element;
    const selectRect = {
      height: 40,
      width: 221,
      x: 44,
      y: 8,
      top: 8,
    };
    const mockSelectWidth = vi
      .spyOn(selectDom, 'getBoundingClientRect')
      .mockReturnValue(selectRect as DOMRect);
    const dropdown = wrapper.findComponent(LpSelectDropdown);
    dropdown.vm.minWidth = `${selectWrapper.element.getBoundingClientRect().width}px`;
    await nextTick();
    expect((dropdown.element as HTMLElement).style.width).toBe('221px');
    mockSelectWidth.mockRestore();
  });

  test('check default first option', async () => {
    wrapper = getSelectVm({
      filterable: true,
      defaultFirstOption: true,
    });
    const select = wrapper.findComponent(LpSelect);
    const selectVm = select.vm as any;
    const input = wrapper.find('input');
    input.trigger('focus');

    expect(selectVm.hoverIndex).toBe(0);
    selectVm.navigateOptions('next');
    expect(selectVm.hoverIndex).toBe(1);
  });

  test('check default first option when the very first option is disabled', async () => {
    const demoOptions = [
      { value: 'HTML', label: 'HTML', disabled: true },
      { value: 'CSS', label: 'CSS', disabled: false },
      { value: 'JavaScript', label: 'JavaScript', disabled: false },
    ];
    wrapper = getSelectVm(
      { filterable: true, defaultFirstOption: true },
      demoOptions,
    );
    const select = wrapper.findComponent(LpSelect);
    const selectVm = select.vm as any;
    const input = wrapper.find('input');
    input.element.focus();

    expect(selectVm.hoverIndex).toBe(1); // index 0 was skipped
    selectVm.navigateOptions('next');
    expect(selectVm.hoverIndex).toBe(2);
    selectVm.navigateOptions('next');
    expect(selectVm.hoverIndex).toBe(1); // index 0 was skipped
  });

  test('multiple select', async () => {
    wrapper = getSelectVm({ multiple: true });
    await wrapper.find('.select-trigger').trigger('click');
    const options = getOptions();
    const vm = wrapper.vm as any;
    vm.value = ['选项1'];
    nextTick();
    options[1].click();
    await nextTick();
    options[3].click();
    await nextTick();
    expect(vm.value).toEqual([2, 4]);
    const tagCloseIcons = wrapper.findAll('.lp-tag__close');
    await tagCloseIcons[0].trigger('click');
    expect(vm.value.indexOf('选项1')).toBe(-1);
  });

  test('multiple select when content overflow', async () => {
    wrapper = doMount(
      `<lp-select v-model:value="selectedList" multiple placeholder="请选择">
        <lp-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </lp-select>`,
      () => ({
        options: [
          { value: '选项1', label: '黄金糕黄金糕黄金糕黄金糕黄金糕黄金糕黄金糕黄金糕黄金糕黄金糕黄金糕黄金糕黄金糕黄金糕黄金糕黄金糕黄金糕黄金糕黄金糕黄金糕' },
          { value: '选项2', label: '双皮奶双皮奶双皮奶双皮奶双皮奶双皮奶双皮奶双皮奶双皮奶双皮奶双皮奶双皮奶双皮奶' },
          { value: '选项3', label: '蚵仔煎蚵仔煎蚵仔煎蚵仔煎蚵仔煎蚵仔煎' },
          { value: '选项4', label: '龙须面' },
          { value: '选项5', label: '北京烤鸭' },
        ],
        selectedList: [],
      }),
    );
    await wrapper.find('.select-trigger').trigger('click');
    const options = getOptions();
    const selectWrapper = wrapper.findComponent(LpSelect);
    const inputWrapper = selectWrapper.findComponent({ ref: 'reference' });
    const inputDom = inputWrapper.element;
    const mockInputWidth = vi
      .spyOn(inputDom as HTMLElement, 'offsetWidth', 'get')
      .mockReturnValue(200);
    selectWrapper.vm.handleResize();
    options[0].click();
    await nextTick();
    options[1].click();
    await nextTick();
    options[2].click();
    await nextTick();
    const tagWrappers = wrapper.findAll('.lp-select__tags-text');
    for (const tagWrapper of tagWrappers) {
      const tagWrapperDom = tagWrapper.element;
      expect(Number.parseInt((tagWrapperDom as HTMLElement).style.maxWidth) === 200 - 75).toBe(
        true,
      );
    }
    mockInputWidth.mockRestore();
  });

  test('multiple select with collapseTags when content overflow', async () => {
    wrapper = doMount(
      `<lp-select v-model:value="selectedList" multiple collapseTags placeholder="请选择">
        <lp-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </lp-select>`,
      () => ({
        options: [
          {
            value: '选项1',
            label: '黄金糕黄金糕黄金糕黄金糕黄金糕黄金糕黄金糕黄金糕黄金糕黄金糕黄金糕黄金糕黄金糕黄金糕黄金糕黄金糕黄金糕黄金糕黄金糕黄金糕',
          },
          {
            value: '选项2',
            label: '双皮奶双皮奶双皮奶双皮奶双皮奶双皮奶双皮奶双皮奶双皮奶双皮奶双皮奶双皮奶双皮奶',
          },
          { value: '选项3', label: '蚵仔煎蚵仔煎蚵仔煎蚵仔煎蚵仔煎蚵仔煎' },
          { value: '选项4', label: '龙须面' },
          { value: '选项5', label: '北京烤鸭' },
        ],
        selectedList: [],
      }),
    );

    await wrapper.find('.select-trigger').trigger('click');
    const options = getOptions();
    const selectWrapper = wrapper.findComponent(LpSelect);
    const inputWrapper = selectWrapper.findComponent({ ref: 'reference' });
    const inputDom = inputWrapper.element;
    const mockInputWidth = vi
      .spyOn(inputDom as HTMLElement, 'offsetWidth', 'get')
      .mockReturnValue(200);
    selectWrapper.vm.handleResize();
    options[0].click();
    await nextTick();
    options[1].click();
    await nextTick();
    options[2].click();
    await nextTick();
    const tagWrappers = wrapper.findAll('.lp-select__tags-text');
    const tagWrapperDom = tagWrappers[0].element as HTMLElement;
    expect(Number.parseInt(tagWrapperDom.style.maxWidth) === 200 - 123).toBe(
      true,
    );
    mockInputWidth.mockRestore();
  });

  test('multiple select with collapseTagsTooltip', async () => {
    wrapper = doMount(
      `
      <lp-select v-model:value="selectedList" multiple collapseTags collapse-tags-tooltip placeholder="请选择">
        <lp-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
        </lp-option>
      </lp-select>
    `,
      () => ({
        options: [
          {
            value: '选项1',
            label: '黄金糕',
          },
          {
            value: '选项2',
            label: '双皮奶',
          },
          {
            value: '选项3',
            label: '蚵仔煎',
          },
          {
            value: '选项4',
            label: '龙须面',
          },
          {
            value: '选项5',
            label: '北京烤鸭',
          },
        ],
        selectedList: [],
      }),
    );
    await wrapper.find('.select-trigger').trigger('click');
    const options = getOptions();

    options[0].click();
    await nextTick();
    options[1].click();
    await nextTick();
    options[2].click();
    await nextTick();
    const triggerWrappers = wrapper.findAll('.lp-tooltip__trigger');
    expect(triggerWrappers[0]).toBeDefined();
    const tags = document.querySelectorAll('.lp-select__tags-text');
    expect(tags.length).toBe(4);
    expect(tags[3].textContent).toBe('蚵仔煎');
  });

  test('multiple remove-tag', async () => {
    wrapper = doMount(
      `
      <lp-select v-model:value="value" multiple @remove-tag="handleRemoveTag">
        <lp-option
          v-for="item in options"
          :label="item.label"
          :key="item.value"
          :value="item.value">
          <p>{{item.label}} {{item.value}}</p>
        </lp-option>
      </lp-select>
    `,
      () => ({
        options: [
          {
            value: '选项1',
            label: '黄金糕',
          },
          {
            value: '选项2',
            label: '双皮奶',
          },
          {
            value: '选项3',
            label: '蚵仔煎',
          },
          {
            value: '选项4',
            label: '龙须面',
          },
          {
            value: '选项5',
            label: '北京烤鸭',
          },
        ],
        value: ['选项1', '选项2'],
      }),
      {
        methods: {
          handleRemoveTag() {
            // pass
          },
        },
      },
    );

    const vm = wrapper.vm as any;
    await nextTick();
    expect(vm.value.length).toBe(2);
    const tagCloseIcons = wrapper.findAll('.lp-tag__close');
    await tagCloseIcons[1].trigger('click');
    expect(vm.value.length).toBe(1);
    await tagCloseIcons[0].trigger('click');
    expect(vm.value.length).toBe(0);
  });

  test('multiple limit', async () => {
    wrapper = getSelectVm({ multiple: true, multipleLimit: 1 });
    const vm = wrapper.vm as any;
    await wrapper.find('.select-trigger').trigger('click');
    const options = getOptions();
    options[1].click();
    await nextTick();
    expect(vm.value.includes(2)).toBe(true);
    options[3].click();
    await nextTick();
    expect(vm.value.indexOf(4)).toBe(-1);
  });

  test('event:focus & blur', async () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    wrapper = doMount(
      `<lp-select
      @focus="handleFocus"
      @blur="handleBlur" />`,
      () => ({
        handleFocus,
        handleBlur,
      }),
    );
    const select = wrapper.findComponent(LpSelect);
    const input = select.find('input');

    expect(input.exists()).toBe(true);
    await input.trigger('focus');
    expect(handleFocus).toHaveBeenCalled();
    await input.trigger('blur');
    expect(handleBlur).toHaveBeenCalled();
  });

  test('event:focus & blur for multiple & filterable select', async () => {
    const handleFocus = vi.fn();
    const handleBlur = vi.fn();
    wrapper = doMount(
      `<lp-select @focus="handleFocus" @blur="handleBlur" multiple filterable />`,
      () => ({ handleFocus, handleBlur }),
    );
    const select = wrapper.findComponent(LpSelect);
    const input = select.find('input');

    expect(input.exists()).toBe(true);
    await input.trigger('focus');
    expect(handleFocus).toHaveBeenCalled();
    await input.trigger('blur');
    expect(handleBlur).toHaveBeenCalled();
  });

  test('should not open popper when automatic-dropdown not set', async () => {
    wrapper = getSelectVm();
    const select = wrapper.findComponent(LpSelect);
    await select
      .findComponent({ ref: 'reference' })
      .find('input')
      .element.focus();
    expect((select.vm as any).visible).toBe(false);
  });

  test('should open popper when automatic-dropdown is set', async () => {
    wrapper = getSelectVm({ automaticDropdown: true });
    const select = wrapper.findComponent(LpSelect);
    await select
      .findComponent({ ref: 'reference' })
      .find('input')
      .trigger('focus');
    expect((select.vm as any).visible).toBe(true);
  });

  test('only emit change on user input', async () => {
    let callCount = 0;
    wrapper = doMount(
      `<lp-select v-model:value="value" @change="change" ref="select">
        <lp-option label="1" value="1" />
        <lp-option label="2" value="2" />
        <lp-option label="3" value="3" />
      </lp-select>`,
      () => ({
        value: '1',
        change: () => ++callCount,
      }),
    );

    expect(callCount).toBe(0);
    await wrapper.find('.select-trigger').trigger('click');
    const options = getOptions();
    options[2].click();
    expect(callCount).toBe(1);
  });

  test('render slot `empty`', async () => {
    wrapper = doMount(
      `
      <lp-select v-model:value="value">
        <template #empty>
          <div class="empty-slot">EmptySlot</div>
        </template>
      </lp-select>`,
      () => ({
        value: '1',
      }),
    );
    await wrapper.find('.select-trigger').trigger('click');
    expect(
      document.querySelector<HTMLElement>('.empty-slot')?.textContent,
    ).toBe('EmptySlot');
  });

  test('should set placeholder to label of selected option when filterable is true and multiple is false', async () => {
    wrapper = doMount(
      `<lp-select ref="select" v-model:value="value" filterable>
        <lp-option label="test" value="test" />
      </lp-select>`,
      () => ({ value: 'test' }),
    );
    const vm = wrapper.vm as any;
    await wrapper.trigger('mouseenter');
    await wrapper.trigger('click');
    const selectVm = wrapper.findComponent(LpSelect).vm as any;
    expect(selectVm.visible).toBe(true);
    expect(findInnerInput().placeholder).toBe('test');
    expect(vm.value).toBe('test');
  });

  test('default value is null or undefined', async () => {
    wrapper = doMount(
      `
    <lp-select v-model:value="value">
      <lp-option
        v-for="item in options"
        :label="item.label"
        :key="item.value"
        :value="item.value">
      </lp-option>
    </lp-select>`,
      () => ({
        options: [
          {
            value: '选项1',
            label: '黄金糕',
          },
          {
            value: '选项2',
            label: '双皮奶',
          },
        ],
        value: undefined,
      }),
    );
    const vm = wrapper.vm as any;
    vm.value = null;
    await nextTick();
    expect(findInnerInput().value).toBe('');
    vm.value = '选项1';
    await nextTick();
    expect(findInnerInput().value).toBe('黄金糕');
  });

  test('emptyText error show', async () => {
    wrapper = doMount(
      `<lp-select :value="value" filterable placeholder="Select">
        <lp-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </lp-option>
      </lp-select>`,
      () => ({
        options: [
          { value: 'Option1', label: 'Option1' },
          { value: 'Option2', label: 'Option2' },
          { value: 'Option3', label: 'Option3' },
          { value: 'Option4', label: 'Option4' },
          { value: 'Option5', label: 'Option5' },
        ],
        value: 'test',
      }),
    );
    const select = wrapper.findComponent(LpSelect);
    await select.trigger('mouseenter');
    await select.trigger('click');
    await nextTick();
    expect(
      !!(document.querySelector('.lp-select__popper') as HTMLElement).style
        .display,
    ).toBeFalsy();
    expect(wrapper.findAll('.lp-select-dropdown__empty').length).toBe(0);
  });

  test('multiple select with remote load', async () => {
    vi.useFakeTimers();
    wrapper = mount(defineComponent({
      components: { LpSelect, LpOption: LpSelectOption },
      data() {
        return {
          options: [] as OptionProps[],
          value: [],
          list: [] as OptionProps[],
          loading: false,
          states: [
            'Alabama',
            'Alaska',
            'Arizona',
            'Arkansas',
            'California',
            'Colorado',
            'Connecticut',
            'Delaware',
            'Florida',
            'Georgia',
            'Hawaii',
            'Idaho',
            'Illinois',
            'Indiana',
            'Iowa',
            'Kansas',
            'Kentucky',
            'Louisiana',
            'Maine',
            'Maryland',
            'Massachusetts',
            'Michigan',
            'Minnesota',
            'Mississippi',
            'Missouri',
            'Montana',
            'Nebraska',
            'Nevada',
            'New Hampshire',
            'New Jersey',
            'New Mexico',
            'New York',
            'North Carolina',
            'North Dakota',
            'Ohio',
            'Oklahoma',
            'Oregon',
            'Pennsylvania',
            'Rhode Island',
            'South Carolina',
            'South Dakota',
            'Tennessee',
            'Texas',
            'Utah',
            'Vermont',
            'Virginia',
            'Washington',
            'West Virginia',
            'Wisconsin',
            'Wyoming',
          ],
        };
      },
      mounted(this: any) {
        this.list = this.states.map((item: string) => {
          return { value: `value:${item}`, label: `label:${item}` };
        });
      },
      methods: {
        remoteMethod(query: string) {
          if (query === '') {
            this.options = [];
          } else {
            this.loading = true;
            setTimeout(() => {
              this.loading = false;
              this.options = this.list.filter(item => {
                return item.label.toLowerCase().includes(query.toLowerCase());
              });
            }, 200);
          }
        },
      },
      template: `<lp-select
        v-model:value="value"
        multiple
        filterable
        remote
        reserve-keyword
        placeholder="请输入关键词"
        :remote-method="remoteMethod"
        :loading="loading"
      >
        <lp-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item"
        />
      </lp-select>`,
    }));

    const select = wrapper.findComponent(LpSelect).vm;
    select.debouncedQueryChange({
      target: { value: '' },
    });

    select.debouncedQueryChange({
      target: {
        value: 'a',
      },
    });
    vi.runAllTimers();
    await nextTick();
    let options = getOptions();
    options[0].click();
    await nextTick();
    select.debouncedQueryChange({
      target: {
        value: 'n',
      },
    });
    vi.runAllTimers();
    await nextTick();
    options = getOptions();
    options[5].click();
    await nextTick();
    expect(select.selected.length === 2).toBeTruthy();
    expect(select.selected[0].currentLabel !== '').toBeTruthy();
    expect(select.selected[1].currentLabel !== '').toBeTruthy();
    vi.useRealTimers();
  });

  test('disabled group', async () => {
    wrapper = doMount(
      `<lp-select v-model:value="value">
        <lp-option-group
          v-for="group in options"
          :key="group.label"
          :label="group.label"
          :disabled="group.disabled">
          <lp-option
            v-for="item in group.options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </lp-option>
        </lp-option-group>
      </lp-select>`,
      () => ({
        options: [
          {
            label: 'Popular cities',
            options: [
              { value: 'Shanghai', label: 'Shanghai' },
              { value: 'Beijing', label: 'Beijing' },
            ],
          },
          {
            label: 'City name',
            options: [
              { value: 'Chengdu', label: 'Chengdu' },
              { value: 'Shenzhen', label: 'Shenzhen' },
              { value: 'Guangzhou', label: 'Guangzhou' },
              { value: 'Dalian', label: 'Dalian' },
            ],
          },
        ],
        value: '',
      }),
    );

    const vm = wrapper.vm as any;
    wrapper.find('.select-trigger').trigger('click');
    await nextTick();
    vm.options[1].disabled = true;
    await nextTick();
    const options = getOptions();
    expect(options[0].className).not.toContain('is-disabled');
    expect(options[2].className).toContain('is-disabled');
    options[0].click();
    await nextTick();
    expect(vm.value).toBe('Shanghai');
    options[2].click();
    await nextTick();
    expect(vm.value).toBe('Shanghai');
  });

  test('tag of disabled option is not closable', async () => {
    wrapper = doMount(
      `<lp-select v-model:value="vendors" multiple :collapse-tags="isCollapsed" :clearable="isClearable" placeholder="Select Business Unit">
        <lp-option
          v-for="(vendor, index) in options"
          :key="index"
          :value="index + 1"
          :label="vendor.name"
          :disabled="vendor.isDisabled"
        >
        </lp-option>
      </lp-select>`,
      () => ({
        vendors: [2, 3, 4],
        isCollapsed: false,
        isClearable: false,
        options: [
          { name: 'Test 1', isDisabled: false },
          { name: 'Test 2', isDisabled: true },
          { name: 'Test 3', isDisabled: false },
          { name: 'Test 4', isDisabled: true },
        ],
      }),
    );
    const vm = wrapper.vm as any;
    await nextTick();
    const selectVm = wrapper.findComponent(LpSelect).vm as any;
    expect(wrapper.findAll('.lp-tag').length).toBe(3);
    const tagCloseIcons = wrapper.findAll('.lp-tag__close');
    expect(tagCloseIcons.length).toBe(1);
    await tagCloseIcons[0].trigger('click');
    expect(wrapper.findAll('.lp-tag__close').length).toBe(0);
    expect(wrapper.findAll('.lp-tag').length).toBe(2);

    //test if is clearable
    vm.isClearable = true;
    vm.vendors = [2, 3, 4];
    await nextTick();
    selectVm.inputHovering = true;
    await selectVm.$nextTick();
    const iconClear = wrapper.findComponent(CircleClose);
    expect(wrapper.findAll('.lp-tag').length).toBe(3);
    await iconClear.trigger('click');
    expect(wrapper.findAll('.lp-tag').length).toBe(2);

    // test for collapse select
    vm.vendors = [1, 2, 4];
    vm.isCollapsed = true;
    vm.isClearable = false;
    await nextTick();
    expect(
      wrapper.findAll('.lp-tag').filter(item => {
        return !hasClass(item.element, 'in-tooltip');
      }).length,
    ).toBe(2);
    await wrapper.find('.lp-tag__close').trigger('click');
    expect(
      wrapper.findAll('.lp-tag').filter(item => {
        return !hasClass(item.element, 'in-tooltip');
      }).length,
    ).toBe(2);
    expect(wrapper.findAll('.lp-tag__close').length).toBe(0);

    // test for collapse select if is clearable
    vm.vendors = [1, 2, 4];
    vm.isCollapsed = true;
    vm.isClearable = true;
    await nextTick();
    expect(
      wrapper.findAll('.lp-tag__close').filter(item => {
        return !hasClass(item.element.parentElement!, 'in-tooltip');
      }).length,
    ).toBe(1);
    await wrapper.find('.lp-tag__close').trigger('click');
    expect(
      wrapper.findAll('.lp-tag').filter(item => {
        return !hasClass(item.element, 'in-tooltip');
      }).length,
    ).toBe(2);
    expect(wrapper.findAll('.lp-tag__close').length).toBe(0);
  });

  test('tag type', async () => {
    wrapper = doMount(
      `
      <lp-select v-model:value="value" multiple tag-type="success">
        <lp-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </lp-option>
      </lp-select>
    `,
      () => ({
        options: [
          {
            value: '选项1',
            label: '黄金糕',
          },
          {
            value: '选项2',
            label: '双皮奶',
          },
        ],
        value: [],
      }),
    );

    await wrapper.find('.select-trigger').trigger('click');
    const options = getOptions();
    options[1].click();
    await nextTick();
    expect(wrapper.find('.lp-tag').classes()).toContain('lp-tag--success');
  });

  test('vModel:value should be deep reactive in multiple mode', async () => {
    wrapper = doMount(
      `<lp-select v-model:value="value" multiple>
        <lp-option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :label="option.label"
        >
        </lp-option>
      </lp-select>`,
      () => ({
        value: [1],
        options: [
          { label: 'Test 1', value: 1 },
          { label: 'Test 2', value: 2 },
          { label: 'Test 3', value: 3 },
          { label: 'Test 4', value: 4 },
        ],
      }),
    );
    const vm = wrapper.vm as any;
    await nextTick();
    expect(wrapper.findAll('.lp-tag').length).toBe(1);

    vm.value.splice(0, 1);

    await nextTick();
    expect(wrapper.findAll('.lp-tag').length).toBe(0);
  });

  test('should reset placeholder after clear when both multiple and filterable are true', async () => {
    const placeholder = 'placeholder';
    wrapper = doMount(
      `<lp-select v-model:value="value" multiple filterable placeholder=${placeholder}>
        <lp-option label="1" value="1" />
      </lp-select>`,
      () => ({ value: ['1'] }),
    );
    await nextTick();

    const innerInput = wrapper.find('.lp-input__inner');
    const innerInputEl = innerInput.element as HTMLInputElement;
    expect(innerInputEl.placeholder).toBe('');

    const tagCloseIcon = wrapper.find('.lp-tag__close');
    await tagCloseIcon.trigger('click');
    expect(innerInputEl.placeholder).toBe(placeholder);

    const selectInput = wrapper.find('.lp-select__input');
    const selectInputEl = selectInput.element as HTMLInputElement;
    selectInputEl.value = 'a';
    vi.useFakeTimers();
    selectInput.trigger('input');
    await nextTick();
    vi.runAllTimers();
    await nextTick();

    expect(innerInputEl.placeholder).toBe('');

    selectInput.trigger('keydown', {
      key: EVENT_CODE.backspace,
    });
    await nextTick();
    expect(innerInputEl.placeholder).toBe(placeholder);
    vi.useRealTimers();
  });

  test('should close popper when click icon twice', async () => {
    wrapper = getSelectVm({
      filterable: true,
      clearable: true,
    });
    const select = wrapper.findComponent(LpSelect);
    await select.trigger('mouseenter');
    const suffixIcon = select.find('.lp-input__suffix');
    await suffixIcon.trigger('click');
    expect((select.vm as any).visible).toBe(true);
    await suffixIcon.trigger('click');
    expect((select.vm as any).visible).toBe(false);
  });

  test('mouseenter click', async () => {
    wrapper = getSelectVm({
      filterable: true,
      clearable: true,
    });
    const select = wrapper.findComponent(LpSelect);

    await select.trigger('click');
    expect((select.vm as any).visible).toBe(false);

    await select.trigger('mouseenter');
    await select.trigger('click');
    expect((select.vm as any).visible).toBe(true);
  });

  describe('should show all options when open select dropdown', () => {
    async function testShowOptions({ filterable, multiple }: SelectProps = {}) {
      wrapper = getSelectVm({ filterable, multiple });
      const options = wrapper.findAllComponents(LpOption);

      await wrapper.find('.select-trigger').trigger('click');
      expect(options.every(option => option.vm.visible)).toBe(true);

      await options[1].trigger('click');
      await wrapper.find('.select-trigger').trigger('click');
      expect(options.every(option => option.vm.visible)).toBe(true);
    }

    test('both filterable and multiple are false', async () => {
      await testShowOptions();
    });

    test('filterable is true and multiple is false', async () => {
      await testShowOptions({ filterable: true });
    });

    test('filterable is false and multiple is true', async () => {
      await testShowOptions({ multiple: true });
    });

    test('both filterable and multiple are true', async () => {
      await testShowOptions({ filterable: true, multiple: true });
    });

    test.skip('filterable is true with grouping', async () => {
      wrapper = getGroupSelectVm({ filterable: true });
      await wrapper.find('.select-trigger').trigger('click');
      await nextTick();
      const vm = wrapper.findComponent(LpSelect).vm;
      const event = { target: { value: 'sh' } };
      vm.debouncedQueryChange(event);
      await nextTick();
      const groups = wrapper.findAllComponents(LpOptionGroup);
      expect(
        groups.filter(group => {
          const vm = group.vm as any;
          return vm.visible;
        }).length,
      ).toBe(1);
    });
  });

  describe('after search', () => {
    async function testAfterSearch({
      multiple,
      filterMethod,
      remote,
      remoteMethod,
    }: SelectProps) {
      wrapper = getSelectVm({
        filterable: true,
        multiple,
        filterMethod,
        remote,
        remoteMethod,
      });
      const method = remote ? remoteMethod : filterMethod;
      const firstInputLetter = 'a';
      const secondInputLetter = 'aa';

      await nextTick();
      await wrapper.trigger('mouseenter');

      const input = wrapper.find(
        multiple ? '.lp-select__input' : '.lp-input__inner',
      );
      const inputEl = input.element as HTMLInputElement;
      await input.trigger('click');
      inputEl.value = firstInputLetter;
      await input.trigger('input');
      expect(method).toBeCalled();
      expect(method.mock.calls[0][0]).toBe(firstInputLetter);

      inputEl.value = secondInputLetter;
      await input.trigger('input');
      expect(method).toBeCalledTimes(2);
      expect(method.mock.calls[1][0]).toBe(secondInputLetter);
    }

    test('should call filter method', async () => {
      const filterMethod = vi.fn();
      await testAfterSearch({ filterMethod });
    });

    test('should call filter method in multiple mode', async () => {
      const filterMethod = vi.fn();
      await testAfterSearch({ multiple: true, filterMethod });
    });

    test('should call remote method', async () => {
      const remoteMethod = vi.fn();
      await testAfterSearch({ remote: true, remoteMethod });
    });

    test('should call remote method in multiple mode', async () => {
      const remoteMethod = vi.fn();
      await testAfterSearch({ multiple: true, remote: true, remoteMethod });
    });
  });

  describe('teleported API', () => {
    test.skip('should mount on popper container', async () => {
      expect(document.body.innerHTML).toBe('');
      wrapper = doMount(
        `<lp-select v-model:value="value" multiple>
          <lp-option
            v-for="option in options"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          >
          </lp-option>
        </lp-select>`,
        () => ({
          value: [1],
          options: [
            { label: 'Test 1', value: 1 },
            { label: 'Test 2', value: 2 },
            { label: 'Test 3', value: 3 },
            { label: 'Test 4', value: 4 },
          ],
        }),
      );

      await nextTick();
      expect(document.body.querySelector(POPPER_CONTAINER_ID)!.innerHTML).not.toBe('');
    });

    test.skip('should not mount on the popper container', async () => {
      expect(document.body.innerHTML).toBe('');
      wrapper = doMount(
        `<lp-select v-model:value="value" multiple :teleported="false">
          <lp-option
            v-for="option in options"
            :key="option.value"
            :value="option.value"
            :label="option.label"
          >
          </lp-option>
        </lp-select>`,
        () => ({
          value: [1],
          options: [
            { label: 'Test 1', value: 1 },
            { label: 'Test 2', value: 2 },
            { label: 'Test 3', value: 3 },
            { label: 'Test 4', value: 4 },
          ],
        }),
      );

      await nextTick();
      expect(document.body.querySelector(POPPER_CONTAINER_ID)!.innerHTML).toBe('');
    });
  });

  test('multiple select has an initial value', async () => {
    const options = [{ value: `value:Alaska`, label: `label:Alaska` }];
    const value = [{ value: `value:Alaska`, label: `label:Alaska` }];
    const wrapper = doMount(
      `<lp-select v-model:value="value"
        multiple
        value-key="value"
        filterable>
        <lp-option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :label="option.label"
        >
        </lp-option>
      </lp-select>`,
      () => ({
        value,
        options,
      }),
    );
    const select = wrapper.findComponent(LpSelect).vm;
    expect(select.selected[0].currentLabel).toBe(options[0].label);
  });

  test('should reset selectedLabel when toggle multiple', async () => {
    wrapper = getSelectVm({ multiple: false });
    const select = wrapper.findComponent(LpSelect);
    const vm = wrapper.vm as any;
    const selectVm = select.vm as any;
    vm.value = 1;
    await nextTick();
    expect(selectVm.selectedLabel).toBe('黄金糕');
    vm.multiple = true;
    vm.value = [];
    await nextTick();
    expect(selectVm.selectedLabel).toBe('');
  });

  test('should modify size height change', async () => {
    wrapper = getSelectVm();

    // large size
    await wrapper.setProps({
      size: 'large',
    });
    await nextTick(nextTick);
    const inputEl = wrapper.find('input').element as HTMLDivElement;
    const sizeMap: Record<string, number> = {
      small: 24,
      default: 32,
      large: 40,
    };

    for (const size in sizeMap) {
      await wrapper.setProps({
        size,
      });
      await nextTick(nextTick);
      expect(inputEl.style.height).toEqual(`${sizeMap[size] - 2}px`);
    }
  });

  describe('form item accessibility integration', () => {
    it('automatic id attachment', async () => {
      const wrapper = doMount(
        `<lp-form-item label="Foobar" data-test-ref="item">
          <lp-select v-model:value="value">
            <lp-option label="1" value="1" />
          </lp-select>
        </lp-form-item>`,
        () => ({
          value: 1,
        }),
      );

      await nextTick();
      const formItem = wrapper.find('[data-test-ref="item"]');
      const formItemLabel = formItem.find('.lp-form-item__label');
      const innerInput = wrapper.find('.lp-input__inner');
      expect(formItem.attributes().role).toBeFalsy();
      expect(formItemLabel.attributes().for).toBe(innerInput.attributes().id);
    });

    it('specified id attachment', async () => {
      const wrapper = doMount(
        `<lp-form-item label="Foobar" data-test-ref="item">
          <lp-select id="foobar" v-model:value="value">
            <lp-option label="1" value="1" />
          </lp-select>
        </lp-form-item>`,
        () => ({
          value: 1,
        }),
      );

      await nextTick();
      const formItem = wrapper.find('[data-test-ref="item"]');
      const formItemLabel = formItem.find('.lp-form-item__label');
      const innerInput = wrapper.find('.lp-input__inner');
      expect(formItem.attributes().role).toBeFalsy();
      expect(innerInput.attributes().id).toBe('foobar');
      expect(formItemLabel.attributes().for).toBe(innerInput.attributes().id);
    });

    it('form item role is group when multiple inputs', async () => {
      const wrapper = doMount(
        `<lp-form-item label="Foobar" data-test-ref="item">
          <lp-select v-model:value="value">
            <lp-option label="1" value="1" />
          </lp-select>
          <lp-select v-model:value="value">
            <lp-option label="1" value="1" />
          </lp-select>
        </lp-form-item>`,
        () => ({
          value: 1,
        }),
      );

      await nextTick();
      const formItem = wrapper.find('[data-test-ref="item"]');
      expect(formItem.attributes().role).toBe('group');
    });
    // fix: 8544
    it('When props are changed, label can be displayed correctly after selecting operation', async () => {
      wrapper = getGroupSelectVm({}, [
        {
          label: 'group1',
          options: [
            { value: 0, label: 'x' },
            { value: 1, label: 'y' },
            { value: 2, label: 'z' },
          ],
        },
      ]);
      await wrapper.find('.select-trigger').trigger('click');
      let options = getOptions();
      const vm = wrapper.vm as any;
      expect(vm.value).toBe('');
      expect(findInnerInput().value).toBe('');
      await nextTick();
      options[1].click();
      await nextTick();
      expect(vm.value).toBe(1);
      expect(findInnerInput().value).toBe('y');
      (wrapper.vm as any).options = [
        {
          label: 'group2',
          options: [
            { value: 0, label: 'x' },
            { value: 1, label: 'y' },
            { value: 2, label: 'z' },
          ],
        },
      ];

      await nextTick();
      options = getOptions();
      options[1].click();
      await nextTick();
      expect(vm.value).toBe(1);
      expect(findInnerInput().value).toBe('y');
      options[2].click();
      await nextTick();
      expect(vm.value).toBe(2);
      expect(findInnerInput().value).toBe('z');
    });
  });
});
