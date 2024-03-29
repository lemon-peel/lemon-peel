import { nextTick, reactive } from 'vue';
import { mount } from '@vue/test-utils';
import { NOOP } from '@vue/shared';
import { beforeEach, afterEach, describe, expect, it, test, vi } from 'vitest';

import { POPPER_CONTAINER_SELECTOR } from '@lemon-peel/hooks';
import { LpFormItem as FormItem } from '@lemon-peel/components/form';

import Autocomplete from '../src/AutoComplete.vue';
import type { AutocompleteProps } from '../src/autoComplete';

vi.useFakeTimers();

function doMount(
  props: Partial<AutocompleteProps> & Partial<HTMLInputElement>  = {},
  type: 'fn-cb' | 'fn-promise' | 'fn-arr' | 'fn-async' | 'arr' = 'fn-cb',
) {
  return mount({
    setup() {
      const state = reactive({
        value: '',
        list: [
          { value: 'Java', tag: 'java' },
          { value: 'Go', tag: 'go' },
          { value: 'JavaScript', tag: 'javascript' },
          { value: 'Python', tag: 'python' },
        ],
      });

      const filterList = (queryString: string) => {
        return queryString
          ? state.list.filter(
            i => i.value.indexOf(queryString.toLowerCase()) === 0,
          )
          : state.list;
      };

      const querySearch = (() => {
        switch (type) {
          case 'fn-cb': {
            return (
              queryString: string,
              cb: (arg: typeof state.list) => void,
            ) => {
              cb(filterList(queryString));
            };
          }
          case 'fn-promise': {
            return (queryString: string) =>
              Promise.resolve(filterList(queryString));
          }
          case 'fn-async': {
            return async (queryString: string) => {
              await Promise.resolve();
              return filterList(queryString);
            };
          }
          case 'fn-arr': {
            return (queryString: string) => filterList(queryString);
          }
          case 'arr': {
            return state.list;
          }
        }
      })();

      return () => (
      <Autocomplete
        ref="autocomplete"
        v-model:value={state.value}
        {
          ...{
            ...props,
            fetchSuggestions: props.fetchSuggestions || querySearch,
          }
        }
      />
      );
    },
  }, {
    attachTo: document.body,
  });
}

describe('Autocomplete.vue', () => {
  let wrapper: ReturnType<typeof doMount>;

  beforeEach(() => {
    document.body.innerHTML = '';
  });

  afterEach(() => {
    wrapper?.unmount();
  });

  test('placeholder', async () => {
    wrapper = doMount({
      placeholder: 'placeholder',
    });
    await nextTick();

    wrapper.setProps({ placeholder: 'autocomplete' });
    await nextTick();
    expect(wrapper.find('input').attributes('placeholder')).toBe('autocomplete');

    wrapper.setProps({ placeholder: 'placeholder' });
    await nextTick();
    expect(wrapper.find('input').attributes('placeholder')).toBe('placeholder');
  });

  test('triggerOnFocus', async () => {
    const fetchSuggestions = vi.fn();
    wrapper = doMount({
      triggerOnFocus: false,
      fetchSuggestions: fetchSuggestions as any,
    });
    await nextTick();

    const input = wrapper.find('input');
    await nextTick();
    expect(fetchSuggestions).toBeCalledTimes(0);

    await wrapper.setProps({ triggerOnFocus: true });
    await input.trigger('focus');
    vi.runAllTimers();
    await nextTick();

    expect(fetchSuggestions).toBeCalledTimes(1);
  });

  test('popperClass', async () => {
    const wrapper = doMount();
    await nextTick();

    await wrapper.setProps({ popperClass: 'error' });
    expect(
      document.body.querySelector('.lp-popper')?.classList.contains('error'),
    ).toBe(true);

    await wrapper.setProps({ popperClass: 'success' });
    expect(
      document.body.querySelector('.lp-popper')?.classList.contains('error'),
    ).toBe(false);
    expect(
      document.body.querySelector('.lp-popper')?.classList.contains('success'),
    ).toBe(true);
  });

  test('teleported', async () => {
    doMount({ teleported: false });
    expect(document.body.querySelector('.lp-popper__mask')).toBeNull();
  });

  test('debounce / fetchSuggestions', async () => {
    const fetchSuggestions = vi.fn();
    const wrapper = doMount({
      debounce: 500,
      fetchSuggestions: fetchSuggestions as any,
    });
    await nextTick();

    const input = wrapper.find('input');
    await input.trigger('focus');
    await input.trigger('blur');
    await input.trigger('focus');
    await input.trigger('blur');
    await input.trigger('focus');
    await input.trigger('blur');
    await input.trigger('focus');
    expect(fetchSuggestions).toHaveBeenCalledTimes(0);
    vi.runAllTimers();
    await nextTick();

    expect(fetchSuggestions).toHaveBeenCalledTimes(1);
    await wrapper.find('input').trigger('focus');
    vi.runAllTimers();
    await nextTick();

    expect(fetchSuggestions).toHaveBeenCalledTimes(2);
  });

  test('fetchSuggestions with fn-promise', async () => {
    const wrapper = doMount({ debounce: 10 }, 'fn-promise');
    await nextTick();
    await wrapper.find('input').trigger('focus');
    vi.runAllTimers();
    await nextTick();

    const target = wrapper.getComponent(Autocomplete).vm as InstanceType<
      typeof Autocomplete
    >;

    expect(target.suggestions.length).toBe(4);
  });

  test('fetchSuggestions with fn-async', async () => {
    const wrapper = doMount({ debounce: 10 }, 'fn-async');
    await nextTick();
    await wrapper.find('input').trigger('focus');
    vi.runAllTimers();
    await nextTick();
    await nextTick();

    const target = wrapper.getComponent(Autocomplete).vm as InstanceType<
      typeof Autocomplete
    >;

    expect(target.suggestions.length).toBe(4);
  });

  test('fetchSuggestions with fn-arr', async () => {
    const wrapper = doMount({ debounce: 10 }, 'fn-arr');
    await nextTick();
    await wrapper.find('input').trigger('focus');
    vi.runAllTimers();
    await nextTick();

    const target = wrapper.getComponent(Autocomplete).vm as InstanceType<
      typeof Autocomplete
    >;

    expect(target.suggestions.length).toBe(4);
  });

  test('fetchSuggestions with arr', async () => {
    const wrapper = doMount({ debounce: 10 }, 'arr');
    await nextTick();
    await wrapper.find('input').trigger('focus');
    vi.runAllTimers();
    await nextTick();

    const target = wrapper.getComponent(Autocomplete).vm as InstanceType<
      typeof Autocomplete
    >;

    expect(target.suggestions.length).toBe(4);
  });

  test('valueKey / vModel:value', async () => {
    const wrapper = doMount();
    await nextTick();

    const target = wrapper.getComponent(Autocomplete).vm as InstanceType<
      typeof Autocomplete
    >;

    await target.handleSelect({ value: 'Go', tag: 'go' });

    expect(target.value).toBe('Go');

    await wrapper.setProps({ valueKey: 'tag' });

    await target.handleSelect({ value: 'Go', tag: 'go' });
    expect(target.value).toBe('go');
  });

  test('hideLoading', async () => {
    const wrapper = doMount({
      hideLoading: false,
      fetchSuggestions: NOOP,
      debounce: 10,
    });
    await nextTick();
    await wrapper.find('input').trigger('focus');
    vi.runAllTimers();
    await nextTick();

    expect(document.body.querySelector('.lp-icon-loading')).toBeDefined();
    await wrapper.setProps({ hideLoading: true });
    expect(document.body.querySelector('.lp-icon-loading')).toBeNull();
  });

  test('selectWhenUnmatched', async () => {
    const wrapper = doMount({
      selectWhenUnmatched: true,
      debounce: 10,
    });
    await nextTick();
    const target = wrapper.getComponent(Autocomplete).vm as InstanceType<
      typeof Autocomplete
    >;

    target.highlightedIndex = 0;
    target.handleKeyEnter();
    vi.runAllTimers();
    await nextTick();

    expect(target.highlightedIndex).toBe(-1);
  });

  test('highlightFirstItem', async () => {
    const wrapper = doMount({
      highlightFirstItem: false,
      debounce: 10,
    });
    await nextTick();

    await wrapper.find('input').trigger('focus');
    vi.runAllTimers();
    await nextTick();

    expect(document.body.querySelector('.highlighted')).toBeNull();

    await wrapper.setProps({ highlightFirstItem: true });

    await wrapper.find('input').trigger('focus');
    vi.runAllTimers();
    await nextTick();

    expect(document.body.querySelector('.highlighted')).toBeDefined();
  });

  test('fitInputWidth', async () => {
    const wrapper = doMount({
      fitInputWidth: true,
    });
    await nextTick();

    const inputDom = wrapper.find('.lp-input').element;
    const mockInputWidth = vi
      .spyOn(inputDom as HTMLElement, 'offsetWidth', 'get')
      .mockReturnValue(200);
    await wrapper.find('input').trigger('focus');
    vi.runAllTimers();
    await nextTick();
    await nextTick();
    await nextTick();

    expect(
      (
        document.body.querySelector(
          '.lp-autocomplete-suggestion',
        ) as HTMLElement
      ).style.width,
    ).toBe('200px');
    mockInputWidth.mockRestore();
  });

  describe('teleported API', () => {
    it('should mount on popper container', async () => {
      expect(document.body.innerHTML).toBe('');
      doMount();

      await nextTick();
      expect(
        document.body.querySelector(POPPER_CONTAINER_SELECTOR)?.innerHTML,
      ).not.toBe('');
    });

    it('should not mount on the popper container', async () => {
      expect(document.body.innerHTML).toBe('');
      doMount({
        teleported: false,
      });

      await nextTick();
      expect(
        document.body.querySelector(POPPER_CONTAINER_SELECTOR)?.innerHTML,
      ).toBe('');
    });
  });

  describe('form item accessibility integration', () => {
    test('automatic id attachment', async () => {
      const wrapper = mount(() => (
        <FormItem label="Foobar" data-test-ref="item">
          <Autocomplete data-test-ref="input" />
        </FormItem>
      ));

      await nextTick();
      const formItem = wrapper.find('[data-test-ref="item"]');
      const input = await wrapper.find('[data-test-ref="input"]');
      const formItemLabel = formItem.find('.lp-form-item__label');
      expect(formItem.attributes().role).toBeFalsy();
      expect(formItemLabel.attributes().for).toBe(input.attributes().id);
    });

    test('specified id attachment', async () => {
      const wrapper = mount(() => (
        <FormItem label="Foobar" data-test-ref="item">
          <Autocomplete id="foobar" data-test-ref="input" />
        </FormItem>
      ));

      await nextTick();
      const formItem = wrapper.find('[data-test-ref="item"]');
      const input = await wrapper.find('[data-test-ref="input"]');
      const formItemLabel = formItem.find('.lp-form-item__label');
      expect(formItem.attributes().role).toBeFalsy();
      expect(input.attributes().id).toBe('foobar');
      expect(formItemLabel.attributes().for).toBe(input.attributes().id);
    });

    test('form item role is group when multiple autocompletes', async () => {
      const wrapper = mount(() => (
        <FormItem label="Foobar" data-test-ref="item">
          <Autocomplete data-test-ref="input1" />
          <Autocomplete data-test-ref="input2" />
        </FormItem>
      ));

      await nextTick();
      const formItem = wrapper.find('[data-test-ref="item"]');
      expect(formItem.attributes().role).toBe('group');
    });
  });
});
