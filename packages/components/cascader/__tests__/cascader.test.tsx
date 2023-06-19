import { nextTick, reactive, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, test, vi } from 'vitest';
import { EVENT_CODE } from '@lemon-peel/constants';
import triggerEvent from '@lemon-peel/test-utils/triggerEvent';
import { ArrowDown, Check, CircleClose } from '@element-plus/icons-vue';
import { POPPER_CONTAINER_SELECTOR } from '@lemon-peel/hooks';
import { hasClass } from '@lemon-peel/utils';
import LpForm, { LpFormItem } from '@lemon-peel/components/form';
import Cascader from '../src/Cascader.vue';

import type { VNode } from 'vue';

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

const OPTIONS = [
  {
    value: 'zhejiang',
    label: 'Zhejiang',
    children: [
      { value: 'hangzhou', label: 'Hangzhou' },
      { value: 'ningbo', label: 'Ningbo' },
      { value: 'wenzhou', label: 'Wenzhou' },
    ],
  },
];

const AXIOM = 'Rem is the best girl';

const TRIGGER = '.lp-cascader';
const NODE = '.lp-cascader-node';
const TAG = '.lp-tag';
const SUGGESTION_ITEM = '.lp-cascader__suggestion-item';
const SUGGESTION_PANEL = '.lp-cascader__suggestion-panel';
const DROPDOWN = '.lp-cascader__dropdown';

const doMount = (render: () => VNode) => {
  return mount(render, {
    attachTo: 'body',
  });
};

afterEach(() => {
  document.body.innerHTML = '';
});

describe('Cascader.vue', () => {
  test('toggle popper visible', async () => {
    const handleVisibleChange = vi.fn();
    const wrapper = doMount(() => (
      <Cascader onVisibleChange={handleVisibleChange} />
    ));

    const trigger = wrapper.find(TRIGGER);
    const dropdown = wrapper.findComponent(ArrowDown).element as HTMLDivElement;

    await trigger.trigger('click');
    expect(dropdown.style.display).not.toBe('none');
    expect(handleVisibleChange).toBeCalledWith(true);
    await trigger.trigger('click');
    expect(handleVisibleChange).toBeCalledWith(false);
    await trigger.trigger('click');
    document.body.click();
    expect(handleVisibleChange).toBeCalledWith(false);
  });

  test('expand and check', async () => {
    const handleChange = vi.fn();
    const handleExpandChange = vi.fn();
    const value = ref([]);

    const wrapper = doMount(() => (
      <Cascader
        v-model:value={value.value}
        options={OPTIONS}
        onChange={handleChange}
        onExpandChange={handleExpandChange}
      />
    ));

    const trigger = wrapper.find(TRIGGER);
    await trigger.trigger('click');
    (document.querySelector(NODE) as HTMLElement).click();
    await nextTick();
    expect(handleExpandChange).toBeCalledWith(['zhejiang']);
    (document.querySelectorAll(NODE)[1] as HTMLElement).click();
    await nextTick();
    expect(handleChange).toBeCalledWith(['zhejiang', 'hangzhou']);
    expect(value.value).toEqual(['zhejiang', 'hangzhou']);
    expect(wrapper.find('input').element.value).toBe('Zhejiang / Hangzhou');
  });

  test('with default value', async () => {
    const value = ref(['zhejiang', 'hangzhou']);
    const wrapper = doMount(() => (
      <Cascader v-model:value={value.value} options={OPTIONS} />
    ));

    await nextTick();
    expect(wrapper.find('input').element.value).toBe('Zhejiang / Hangzhou');
    value.value = ['zhejiang', 'ningbo'];
    await nextTick();
    expect(wrapper.find('input').element.value).toBe('Zhejiang / Ningbo');
  });

  test('options change', async () => {
    const value = ref(['zhejiang', 'hangzhou']);
    const options = ref(OPTIONS);
    const wrapper = doMount(() => (
      <Cascader v-model:value={value.value} options={options.value} />
    ));

    options.value = [];
    await nextTick();
    expect(wrapper.find('input').element.value).toBe('');
  });

  test('disabled', async () => {
    const handleVisibleChange = vi.fn();
    const wrapper = doMount(() => (
      <Cascader disabled onVisibleChange={handleVisibleChange} />
    ));

    await wrapper.find(TRIGGER).trigger('click');
    expect(handleVisibleChange).not.toBeCalled();
    expect(wrapper.find('input[disabled]').exists()).toBe(true);
  });

  test('custom placeholder', async () => {
    const wrapper = doMount(() => <Cascader placeholder={AXIOM} />);

    expect(wrapper.find('input').attributes().placeholder).toBe(AXIOM);
  });

  test('clearable', async () => {
    const wrapper = doMount(() => (
      <Cascader
        value={['zhejiang', 'hangzhou']}
        clearable
        options={OPTIONS}
      />
    ));

    const trigger = wrapper.find(TRIGGER);
    expect(wrapper.findComponent(ArrowDown).exists()).toBe(true);
    await trigger.trigger('mouseenter');
    expect(wrapper.findComponent(ArrowDown).exists()).toBe(false);
    await wrapper.findComponent(CircleClose).trigger('click');
    expect(wrapper.find('input').element.value).toBe('');
    expect(
      wrapper.findComponent(Cascader).vm.getCheckedNodes(false)?.length,
    ).toBe(0);
    await trigger.trigger('mouseleave');
    await trigger.trigger('mouseenter');
    await expect(wrapper.findComponent(CircleClose).exists()).toBe(false);
  });

  test('show last level label', async () => {
    const wrapper = doMount(() => (
      <Cascader
        value={['zhejiang', 'hangzhou']}
        showAllLevels={false}
        options={OPTIONS}
      />
    ));

    await nextTick();
    expect(wrapper.find('input').element.value).toBe('Hangzhou');
  });

  test('multiple mode', async () => {
    const value = ref([
      ['zhejiang', 'hangzhou'],
      ['zhejiang', 'ningbo'],
    ]);
    const config = { multiple: true };
    const wrapper = doMount(() => (
      <Cascader v-model:value={value.value} config={config} options={OPTIONS} />
    ));

    await nextTick();
    const tags = wrapper.findAll(TAG);
    const [firstTag, secondTag] = tags;
    expect(tags.length).toBe(2);
    expect(firstTag.text()).toBe('Zhejiang / Hangzhou');
    expect(secondTag.text()).toBe('Zhejiang / Ningbo');
    await firstTag.find('.lp-tag__close').trigger('click');
    expect(wrapper.findAll(TAG).length).toBe(1);
    expect(value.value).toEqual([['zhejiang', 'ningbo']]);
  });

  test('collapse tags', async () => {
    const props = { multiple: true };
    const wrapper = doMount(() => (
      <Cascader
        value={[
          ['zhejiang', 'hangzhou'],
          ['zhejiang', 'ningbo'],
          ['zhejiang', 'wenzhou'],
        ]}
        collapseTags
        config={props}
        options={OPTIONS}
      />
    ));

    await nextTick();
    const tags = wrapper.findAll(TAG).filter(item => {
      return !hasClass(item.element, 'in-tooltip');
    });
    expect(tags[0].text()).toBe('Zhejiang / Hangzhou');
    expect(tags.length).toBe(2);
  });

  test('collapse tags tooltip', async () => {
    const props = { multiple: true };
    const wrapper = doMount(() => (
      <Cascader
        value={[
          ['zhejiang', 'hangzhou'],
          ['zhejiang', 'ningbo'],
          ['zhejiang', 'wenzhou'],
        ]}
        collapseTags
        collapseTagsTooltip
        config={props}
        options={OPTIONS}
      />
    ));

    await nextTick();
    expect(wrapper.findAll(TAG).length).toBe(4);
    const tags = wrapper.findAll(TAG).filter(item => {
      return hasClass(item.element, 'in-tooltip');
    });
    expect(tags[0].text()).toBe('Zhejiang / Ningbo');
    expect(tags[1].text()).toBe('Zhejiang / Wenzhou');
  });

  test('tag type', async () => {
    const props = { multiple: true };
    const wrapper = doMount(() => (
      <Cascader
        value={[['zhejiang', 'hangzhou']]}
        tagType="success"
        config={props}
        options={OPTIONS}
      />
    ));

    await nextTick();
    expect(wrapper.find('.lp-tag').classes()).toContain('lp-tag--success');
  });

  test('filterable', async () => {
    const value = ref([]);
    const wrapper = doMount(() => (
      <Cascader v-model:value={value.value} filterable options={OPTIONS} />
    ));

    const input = wrapper.find('input');
    input.element.value = 'Ni';
    await input.trigger('compositionstart');
    await input.trigger('input');
    input.element.value = 'Ha';
    await input.trigger('compositionupdate');
    await input.trigger('input');
    await input.trigger('compositionend');
    const suggestions = document.querySelectorAll(
      SUGGESTION_ITEM,
    ) as NodeListOf<HTMLElement>;
    const hzSuggestion = suggestions[0];
    expect(suggestions.length).toBe(1);
    expect(hzSuggestion.textContent).toBe('Zhejiang / Hangzhou');
    hzSuggestion.click();
    await nextTick();
    expect(wrapper.findComponent(Check).exists()).toBeTruthy();
    expect(value.value).toEqual(['zhejiang', 'hangzhou']);
    hzSuggestion.click();
    await nextTick();
    expect(value.value).toEqual(['zhejiang', 'hangzhou']);
  });

  test('filterable in multiple mode', async () => {
    const value = ref([]);
    const props = { multiple: true };
    const wrapper = doMount(() => (
      <Cascader
        v-model:value={value.value}
        config={props}
        filterable
        options={OPTIONS}
      />
    ));

    const input = wrapper.find('.lp-cascader__search-input')
    ;(input.element as HTMLInputElement).value = 'Ha';
    await input.trigger('input');
    await nextTick();
    const hzSuggestion = document.querySelector(SUGGESTION_ITEM) as HTMLElement;
    hzSuggestion.click();
    await nextTick();
    expect(value.value).toEqual([['zhejiang', 'hangzhou']]);
    hzSuggestion.click();
    await nextTick();
    expect(value.value).toEqual([]);
  });

  test('filter method', async () => {
    const filterMethod = vi.fn((node, keyword) => {
      const { text, value } = node;
      return text.includes(keyword) || value.includes(keyword);
    });
    const wrapper = doMount(() => (
      <Cascader filterMethod={filterMethod} filterable options={OPTIONS} />
    ));

    const input = wrapper.find('input');
    input.element.value = 'ha';
    await input.trigger('input');
    const hzSuggestion = document.querySelector(SUGGESTION_ITEM) as HTMLElement;
    expect(filterMethod).toBeCalled();
    expect(hzSuggestion.textContent).toBe('Zhejiang / Hangzhou');
  });

  test('filterable keyboard selection', async () => {
    const value = ref([]);
    const wrapper = doMount(() => (
      <Cascader v-model:value={value.value} filterable options={OPTIONS} />
    ));

    const input = wrapper.find('input');
    const dropdown = document.querySelector(DROPDOWN)!;
    input.element.value = 'h';
    await input.trigger('input');
    const suggestionsPanel = document.querySelector(
      SUGGESTION_PANEL,
    ) as HTMLDivElement;
    const suggestions = dropdown.querySelectorAll(
      SUGGESTION_ITEM,
    ) as NodeListOf<HTMLElement>;
    const hzSuggestion = suggestions[0];
    triggerEvent(suggestionsPanel, 'keydown', EVENT_CODE.down);
    expect(document.activeElement!.textContent).toBe('Zhejiang / Hangzhou');
    triggerEvent(hzSuggestion, 'keydown', EVENT_CODE.down);
    expect(document.activeElement!.textContent).toBe('Zhejiang / Ningbo');
    triggerEvent(hzSuggestion, 'keydown', EVENT_CODE.enter);
    await nextTick();
    expect(value.value).toEqual(['zhejiang', 'hangzhou']);
  });

  describe('teleported API', () => {
    it('should mount on popper container', async () => {
      expect(document.body.innerHTML).toBe('');
      const value = ref([]);
      doMount(() => (
        <Cascader v-model:value={value.value} filterable options={OPTIONS} />
      ));

      await nextTick();
      expect(
        document.body.querySelector(POPPER_CONTAINER_SELECTOR)!.innerHTML,
      ).not.toBe('');
    });

    it('should not mount on the popper container', async () => {
      expect(document.body.innerHTML).toBe('');
      const value = ref([]);
      doMount(() => (
        <Cascader
          v-model:value={value.value}
          filterable
          teleported={false}
          options={OPTIONS}
        />
      ));

      await nextTick();
      expect(
        document.body.querySelector(POPPER_CONTAINER_SELECTOR)!.innerHTML,
      ).toBe('');
    });
  });

  test('placeholder disappear when resetForm', async () => {
    const model = reactive({
      name: new Array<string>(),
    });

    const wrapper = doMount(() => (
      <LpForm model={model}>
        <LpFormItem label="Activity name" prop="name">
          <Cascader
            v-model:value={model.name}
            options={OPTIONS}
            filterable
            placeholder={AXIOM}
          />
        </LpFormItem>
      </LpForm>
    ));

    model.name = ['zhejiang', 'hangzhou'];
    await nextTick();
    expect(wrapper.find('input').element.placeholder).toBe('');

    wrapper.findComponent(LpForm).vm.$.exposed!.resetFields();
    await nextTick();
    expect(wrapper.find('input').element.placeholder).toBe(AXIOM);
  });
});
