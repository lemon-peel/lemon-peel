import dayjs from 'dayjs';
import { defineComponent, nextTick, provide, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { rAF } from '@lemon-peel/test-utils/tick';

import ConfigProvider from '@lemon-peel/components/configProvider';
import { LpFormItem } from '@lemon-peel/components/form';
import { CommonPicker } from '@lemon-peel/components/timePicker';
import { EVENT_CODE } from '@lemon-peel/constants';

import Input from '@lemon-peel/components/input';
import zhCn from '@lemon-peel/locale/lang/zhCn';
import enUs from '@lemon-peel/locale/lang/en';

import 'dayjs/locale/zh-cn';
import DatePicker from '../src/DatePicker.vue';
import type { VueWrapper } from '@vue/test-utils';

let wrapper: VueWrapper<any>;

afterEach(() => {
  wrapper?.unmount();
  document.documentElement.innerHTML = '';
});

const testDatePickerPanelChange = async (type: 'date' | 'daterange') => {
  let mode: string | undefined;
  const value = ref(type === 'daterange' ? [] : '');
  const onPanelChange = (_: Date, m: string) => {
    mode = m;
  };

  const wrapper = mount(
    () => (<DatePicker type={type} v-model:value={value.value} onPanelChange={onPanelChange} />),
    { attachTo: document.body },
  );

  const reset = () => {
    mode = undefined;
  };

  const input = wrapper.find('input');
  input.trigger('blur');
  input.trigger('focus');
  await nextTick();
  const prevMonth = document.querySelector<HTMLElement>('button.arrow-left')!;
  const prevYear = document.querySelector<HTMLElement>('button.d-arrow-left')!;
  const nextMonth = document.querySelector<HTMLElement>('button.arrow-right')!;
  const nextYear = document.querySelector<HTMLElement>('button.d-arrow-right')!;
  prevMonth.click();
  await nextTick();
  expect(mode).toBe('month');
  reset();
  nextMonth.click();
  await nextTick();
  expect(mode).toBe('month');
  reset();
  prevYear.click();
  await nextTick();
  expect(mode).toBe('year');
  reset();
  nextYear.click();
  await nextTick();
  expect(mode).toBe('year');
};

describe('DatePicker', () => {
  test('create & custom class & style', async () => {
    const popperClassName = 'popper-class-test';
    const customClassName = 'custom-class-test';

    wrapper = mount(
      () => (
        <DatePicker value={new Date()} readonly={true} placeholder="test_" format="HH-mm-ss" style={{ color: 'red' }}
          class={customClassName} popperClass={popperClassName} />
      ),
      { attachTo: document.body },
    );

    const input = wrapper.find('input');
    expect(input.attributes('placeholder')).toBe('test_');
    expect(input.attributes('readonly')).not.toBeUndefined();
    const outterInput = wrapper.find('.lp-input');
    expect(outterInput.classes()).toContain(customClassName);
    expect(outterInput.attributes().style).toBeDefined();
    input.trigger('blur');
    input.trigger('focus');
    await nextTick();
    expect(
      document
        .querySelector('.lp-picker__popper')!
        .classList.contains(popperClassName),
    ).toBe(true);
  });

  test('select date', async () => {
    const value = ref('');
    wrapper = mount(
      () => (<DatePicker v-model:value={value.value} />),
      { attachTo: document.body },
    );
    const date = dayjs();

    const input = wrapper.find('input');
    input.trigger('blur');
    input.trigger('focus');
    await nextTick();
    const spans = document.querySelectorAll('.lp-date-picker__header-label');
    const arrowLeftElm = document.querySelector<HTMLElement>('.lp-date-picker__prev-btn .arrow-left')!;
    const arrowRightElm = document.querySelector<HTMLElement>('.lp-date-picker__next-btn .arrow-right')!;

    expect(spans[0].textContent).toContain(date.year());
    expect(spans[1].textContent).toContain(date.format('MMMM'));

    const arrowLeftYeayElm = document.querySelector<HTMLElement>('.lp-date-picker__prev-btn .d-arrow-left')!;
    arrowLeftYeayElm.click();
    let count = 20;
    while (--count) {
      arrowLeftElm.click();
    }
    count = 20;
    while (--count) {
      arrowRightElm.click();
    }

    await nextTick();
    expect(spans[0].textContent).toContain(date.add(-1, 'year').year());
    expect(spans[1].textContent).toContain(date.format('MMMM'));
    document.querySelector<HTMLElement>('td.available')!.click();
    await nextTick();

    expect(value.value).toBeDefined();
  });

  test('defaultTime and clear value', async () => {
    const value = ref<Date | undefined>(undefined);
    wrapper = mount(
      () => (<DatePicker v-model:value={value.value} default-time={new Date(2011, 1, 1, 12, 0, 1)} />),
      { attachTo: document.body },
    );
    const input = wrapper.find('input');
    input.trigger('blur');
    input.trigger('focus');
    await nextTick();

    (document.querySelector('td.available') as HTMLElement).click();
    await nextTick();

    expect(value.value).toBeDefined();
    expect(value.value!.getHours()).toBe(12);
    expect(value.value!.getMinutes()).toBe(0);
    expect(value.value!.getSeconds()).toBe(1);
    const picker = wrapper.findComponent(CommonPicker);

    (picker.vm as any).showClose = true;
    await nextTick();

    (document.querySelector('.clear-icon') as HTMLElement).click();
    expect(value.value).toBeNull();
  });

  test('defaultValue', async () => {
    const value = ref<Date | undefined>(undefined);
    const defaultValue = ref(new Date(2011, 10, 1));
    wrapper = mount(
      () => (<DatePicker v-model:value={value.value} default-value={defaultValue.value} />),
      { attachTo: document.body },
    );
    const input = wrapper.find('input');
    input.trigger('blur');
    input.trigger('focus');
    await nextTick();
    document.querySelector<HTMLElement>('td.available')!.click();
    await nextTick();

    expect(value.value).toBeDefined();
    expect(value.value!.getFullYear()).toBe(2011);
    expect(value.value!.getMonth()).toBe(10);
    expect(value.value!.getDate()).toBe(1);

    const picker = wrapper.findComponent(CommonPicker);
    (picker.vm as any).showClose = true;
    await nextTick();

    document.querySelector<HTMLElement>('.clear-icon')!.click();
    expect(value.value).toBeNull();

    defaultValue.value = new Date(2031, 5, 1);
    await nextTick();

    input.trigger('blur');
    input.trigger('focus');
    await nextTick();

    document.querySelector<HTMLElement>('td.available')!.click();
    await nextTick();

    expect(value.value).toBeDefined();
    expect(value.value!.getFullYear()).toBe(2031);
    expect(value.value!.getMonth()).toBe(5);
    expect(value.value!.getDate()).toBe(1);
  });

  test('event change, focus, blur, keydown', async () => {
    const changeHandler = vi.fn();
    const focusHandler = vi.fn();
    const blurHandler = vi.fn();
    const keydownHandler = vi.fn();
    let onChangeValue: Date | undefined;

    const onChange = (e?: Date) => {
      onChangeValue = e;
      return changeHandler(e);
    };

    const value = ref(new Date(2016, 9, 10, 18, 40));
    wrapper = mount(
      () => (<DatePicker v-model:value={value.value}
        onChange={onChange} onFocus={focusHandler} onBlur={blurHandler} onKeydown={keydownHandler} />),
      { attachTo: document.body },
    );

    const input = wrapper.find('input');

    input.trigger('focus');
    input.trigger('blur');
    input.trigger('keydown');
    await nextTick();
    await rAF();
    expect(focusHandler).toBeCalled();
    expect(blurHandler).toBeCalled();
    expect(keydownHandler).toBeCalled();

    input.trigger('focus');
    await nextTick();

    document.querySelector<HTMLElement>('td.available')!.click();
    await nextTick();
    await rAF();
    expect(changeHandler).toBeCalled();
    expect(onChangeValue?.getTime()).toBe(new Date(2016, 9, 1).getTime());
  });

  test('emits focus on click when not currently focused', async () => {
    const focusHandler = vi.fn();
    wrapper = mount(
      () => (<DatePicker value={new Date(2016, 9, 10, 18, 40)} onFocus={focusHandler} />),
      { attachTo: document.body },
    );

    const input = wrapper.find('input');
    input.trigger('mousedown');
    input.trigger('focus');
    await nextTick();
    await rAF();
    expect(focusHandler).toHaveBeenCalledTimes(1);
  });

  test('opens popper on click when input is focused', async () => {
    wrapper = mount(
      () => (<DatePicker value={new Date(2016, 9, 10, 18, 40)} />),
      { attachTo: document.body },
    );

    const popperEl = document.querySelector('.lp-picker__popper') as HTMLElement;
    expect(popperEl.style.display).toBe('none');
    const input = wrapper.find('input');
    input.element.focus();
    input.trigger('mousedown');
    await nextTick();
    await rAF();

    expect(popperEl.style.display).not.toBe('none');
  });

  test('shortcuts', async () => {
    const model = ref('');
    const text = 'Yesterday';
    const value = dayjs().add(-1, 'day').startOf('day').toDate();
    const shortcuts = [{ text, value }];
    wrapper = mount(
      () => (<DatePicker v-model:value={model.value} shortcuts={shortcuts} />),
      { attachTo: document.body },
    );

    const input = wrapper.find('input');
    input.trigger('blur');
    input.trigger('focus');
    await nextTick();
    const shortcut = document.querySelector<HTMLElement>('.lp-picker-panel__shortcut')!;
    expect(shortcut.textContent).toBe(text);
    expect(document.querySelector('.lp-picker-panel__sidebar')).not.toBeNull();
    shortcut.click();
    await nextTick();
    await nextTick();
    expect(model.value.valueOf()).toBe(value.valueOf());
  });

  test('disabledDate', async () => {
    wrapper = mount(
      () => (<DatePicker value="" disabled-date={(time: Date) => time.getTime() < Date.now() - 8.64e7} />),
      { attachTo: document.body },
    );

    const input = wrapper.find('input');
    input.trigger('blur');
    input.trigger('focus');
    await nextTick();
    expect(document.querySelector('.disabled')).not.toBeNull();
  });

  test('ref focus', async () => {
    wrapper = mount(
      () => (<DatePicker value="" />),
      { attachTo: document.body },
    );

    await nextTick();
    await rAF();

    wrapper.findComponent(DatePicker).vm.focus();

    await nextTick();
    await rAF();

    const popperEl = document.querySelector('.lp-picker__popper')!;
    const attr = popperEl.getAttribute('aria-hidden');
    expect(attr).toEqual('false');
  });

  test('ref handleOpen', async () => {
    wrapper = mount(
      () => (<DatePicker value="" />),
      { attachTo: document.body },
    );
    await nextTick();

    wrapper.findComponent(DatePicker).vm.handleOpen();

    await nextTick();
    await rAF();

    const popperEl = document.querySelector('.lp-picker__popper')!;
    const attr = popperEl.getAttribute('aria-hidden');
    expect(attr).toEqual('false');
  });

  test('ref handleClose', async () => {
    vi.useFakeTimers();

    wrapper = mount(
      () => (<DatePicker value="" />),
      { attachTo: document.body },
    );

    await nextTick();
    const picker = wrapper.findComponent(DatePicker);

    picker.vm.handleOpen();

    setTimeout(() => picker.vm.handleClose(), 1_000_000);
    vi.runAllTimers();

    await nextTick();
    const popperEl = document.querySelector('.lp-picker__popper')!;
    const attr = popperEl.getAttribute('aria-hidden');
    expect(attr).toEqual('true');

    vi.useRealTimers();
  });

  test('custom content', async () => {
    const value = ref('');
    wrapper = mount(
      () => (<DatePicker v-model:value={value.value} v-slots={{
        default: ({ isCurrent, text }: { text: string, isCurrent: boolean }) => <div class={['cell', isCurrent ? 'current' : '']}>{text}</div>,
      }} />),
      { attachTo: document.body },
    );

    await nextTick();
    const vm = wrapper.findComponent(DatePicker).vm;
    vm.focus();

    await nextTick();
    const input = wrapper.find('input');
    input.trigger('blur');
    input.trigger('focus');
    await nextTick();

    const cell = document.querySelector<HTMLElement>('td.available .cell')!;

    cell.click();
    input.trigger('focus');

    await nextTick();

    expect(cell
      .classList.contains('current'))
      .toBeTruthy();
  });

  test('custom content value validate', async () => {
    wrapper = mount(
      () => (<DatePicker value="" v-slots={{
        default: ({ isCurrent, text }: { text: string, isCurrent: boolean }) => <div class={['cell', isCurrent ? 'current' : '']}>{text}csw</div>,
      }} />),
      { attachTo: document.body },
    );

    await nextTick();
    wrapper.findComponent(DatePicker).vm.focus();

    await nextTick();
    const el = document.querySelector('td.available .cell')!;
    const text = el.textContent!;
    expect(text.includes('csw')).toBeTruthy();
  });

  test('custom content bail out slot compoent', async () => {
    wrapper = mount(
      () => (<DatePicker value="" v-slots={{
        testest: () => '',
      }} />),
      { attachTo: document.body },
    );

    await nextTick();
    wrapper.findComponent(DatePicker).vm.focus();

    await nextTick();
    const el = document.querySelector<HTMLElement>('td.available')!;
    const text = el.textContent;
    expect(!!text).toBeTruthy();
  });

  describe('value-format', () => {
    test('with literal string', async () => {
      const day = dayjs();
      const format = 'YYYY-MM-DD';
      const valueFormat = '[Lemon-Peel] DD/MM YYYY';
      const value = ref(day.format(valueFormat));

      wrapper = mount(
        () => (<DatePicker v-model:value={value.value} type='date' format={format} value-format={valueFormat} />),
        { attachTo: document.body },
      );

      const input = wrapper.find('input');
      await input.trigger('blur');
      await input.trigger('focus');
      await nextTick();

      document.querySelector<HTMLElement>('td.available')!.click();
      await nextTick();

      expect(value.value).toBe(
        dayjs(
          `[Lemon-Peel] 01/${  `0${day.month() + 1}`.slice(-2)  } ${  day.year()}`,
          valueFormat,
        ).format(valueFormat),
      );

      value.value = '[Lemon-Peel] 31/05 2021';
      await nextTick();
      expect(wrapper.findComponent(Input).vm.value).toBe('2021-05-31');
    });

    test('with "x"', async () => {
      const dateStr = '2021/05/31';
      const format = 'YYYY/MM/DD';
      const valueFormat = 'x';
      const value = ref(Date.now());

      wrapper = mount(
        () => (<DatePicker v-model:value={value.value} type='date' format={format} value-format={valueFormat} />),
        { attachTo: document.body },
      );

      const input = wrapper.find('input');
      await input.trigger('blur');
      await input.trigger('focus');
      await nextTick();

      document.querySelector<HTMLElement>('td.available')!.click();
      await nextTick();
      expect(value.value).toBe(+dayjs().startOf('M'));

      value.value = +new Date(dateStr);
      await nextTick();
      expect(wrapper.findComponent(Input).vm.value).toBe(dateStr);
    });
  });
});

describe('DatePicker Navigation', () => {
  let prevMonth: HTMLElement;
  let prevYear: HTMLElement;
  let nextMonth: HTMLElement;
  let nextYear: HTMLElement;
  let getYearLabel: () => string;
  let getMonthLabel: () => string;

  const initNavigationTest = async (value: Date) => {
    wrapper = mount(
      () => (<DatePicker value={value} />),
      { attachTo: document.body },
    );

    const input = wrapper.find('input');
    input.trigger('blur');
    input.trigger('focus');
    await nextTick();
    prevMonth = document.querySelector('button.arrow-left')!;
    prevYear = document.querySelector('button.d-arrow-left')!;
    nextMonth = document.querySelector('button.arrow-right')!;
    nextYear = document.querySelector('button.d-arrow-right')!;
    getYearLabel = () =>
      document.querySelectorAll('.lp-date-picker__header-label')[0].textContent!;
    getMonthLabel = () =>
      document.querySelectorAll('.lp-date-picker__header-label')[1].textContent!;
  };

  test('month, year', async () => {
    await initNavigationTest(new Date(2000, 0, 1));
    expect(getYearLabel()).toContain('2000');
    expect(getMonthLabel()).toContain('January');

    prevMonth.click();
    await nextTick();
    expect(getYearLabel()).toContain('1999');
    expect(getMonthLabel()).toContain('December');

    prevYear.click();
    await nextTick();
    expect(getYearLabel()).toContain('1998');
    expect(getMonthLabel()).toContain('December');

    nextMonth.click();
    await nextTick();
    expect(getYearLabel()).toContain('1999');
    expect(getMonthLabel()).toContain('January');

    nextYear.click();
    await nextTick();
    expect(getYearLabel()).toContain('2000');
    expect(getMonthLabel()).toContain('January');
  });

  test('month with fewer dates', async () => {
    // July has 31 days, June has 30
    await initNavigationTest(new Date(2000, 6, 31));
    prevMonth.click();
    await nextTick();
    expect(getYearLabel()).toContain('2000');
    expect(getMonthLabel()).toContain('June');
  });

  test('year with fewer Feburary dates', async () => {
    // Feburary 2008 has 29 days, Feburary 2007 has 28
    await initNavigationTest(new Date(2008, 1, 29));
    prevYear.click();
    await nextTick();
    expect(getYearLabel()).toContain('2007');
    expect(getMonthLabel()).toContain('February');
  });

  test('month label with fewer dates', async () => {
    await initNavigationTest(new Date(2000, 6, 31));
    const yearLabel = document.querySelectorAll(
      '.lp-date-picker__header-label',
    )[0]
    ;(yearLabel as HTMLElement).click();
    await nextTick();
    const year1999Label = document.querySelectorAll('.lp-year-table td')[1]
    ;(year1999Label as HTMLElement).click();
    await nextTick();
    const juneLabel = document.querySelectorAll('.lp-month-table td')[5]
    ;(juneLabel as HTMLElement).click();
    await nextTick();
    expect(getYearLabel()).toContain('2001');
    expect(getMonthLabel()).toContain('June');
    const monthLabel = document.querySelectorAll(
      '.lp-date-picker__header-label',
    )[1]
    ;(monthLabel as HTMLElement).click();
    await nextTick();
    const janLabel = document.querySelectorAll('.lp-month-table td')[0]
    ;(janLabel as HTMLElement).click();
    await nextTick();
    expect(getYearLabel()).toContain('2001');
    expect(getMonthLabel()).toContain('January');
  });

  test('panel change event', async () => {
    await testDatePickerPanelChange('date');
  });
});

describe('MonthPicker', () => {
  test('basic', async () => {
    const value = ref(new Date(2020, 7, 1));
    wrapper = mount(
      () => (<DatePicker type='month' v-model:value={value.value} />),
      { attachTo: document.body },
    );

    const input = wrapper.find('input');
    input.trigger('blur');
    input.trigger('focus');
    await nextTick();
    expect(
      document.querySelector<HTMLElement>('.lp-month-table')!.style.display,
    ).toBe('');

    expect(document.querySelector('.lp-year-table')).toBeNull();
    document.querySelector<HTMLElement>('.lp-month-table .cell')!.click();

    await nextTick();
    expect(value.value.getMonth()).toBe(0);
  });

  test('value-format', async () => {
    const valueFormat = '[Lemon-Peel] YYYY.MM';
    const value = ref(dayjs(new Date(2020, 7, 1)).format(valueFormat));
    wrapper = mount(
      () => (<DatePicker type='month' value-format={valueFormat} v-model:value={value.value} />),
      { attachTo: document.body },
    );

    await nextTick();
    expect(wrapper.findComponent(Input).vm.value).toBe('2020-08');
    const input = wrapper.find('input');
    input.trigger('blur');
    input.trigger('focus');
    await nextTick();

    document.querySelector<HTMLElement>('.lp-month-table .cell')!.click();
    await nextTick();

    expect(wrapper.findComponent(Input).vm.value).toBe('2020-01');
    expect(value.value).toBe(
      dayjs(new Date(2020, 0, 1)).format(valueFormat),
    );
  });
});

describe('YearPicker', () => {
  test('basic', async () => {
    const value = ref(new Date(2020, 7, 1));
    const wrapper = mount(
      () => (<DatePicker type='year' v-model:value={value.value} />),
      { attachTo: document.body },
    );

    const input = wrapper.find('input');
    input.trigger('blur');
    input.trigger('focus');
    await nextTick();
    expect(
      document.querySelector<HTMLElement>('.lp-year-table')!.style.display,
    ).toBe('');
    expect(document.querySelector('.lp-month-table')).toBeNull();

    const leftBtn = document.querySelector('.d-arrow-left') as HTMLElement;
    const rightBtn = document.querySelector('.d-arrow-right') as HTMLElement;
    let count = 2;

    while (--count) {
      leftBtn.click();
    }
    count = 3;
    while (--count) {
      rightBtn.click();
    }

    await nextTick();
    document.querySelector<HTMLElement>('.lp-year-table .cell')!.click();
    await nextTick();
    expect(value.value.getFullYear()).toBe(2030);
  });

  test('value-format', async () => {
    const valueFormat = '[Lemon-Peel] YYYY';
    const value = ref(dayjs(new Date(2005, 7, 1)).format(valueFormat));
    wrapper = mount(
      () => (<DatePicker type='year' value-format={valueFormat} v-model:value={value.value} />),
      { attachTo: document.body },
    );

    await nextTick();
    expect(wrapper.findComponent(Input).vm.value).toBe('2005');
    const input = wrapper.find('input');
    input.trigger('blur');
    input.trigger('focus');
    await nextTick();
    const cell = document.querySelector('.lp-year-table .cell') as HTMLElement;
    cell.click();
    await nextTick();
    expect(value.value).toBe(
      dayjs(new Date(Number.parseInt(cell.innerHTML.trim()), 0, 1)).format(
        valueFormat,
      ),
    );
  });
});

describe('WeekPicker', () => {
  test('create', async () => {
    const value = ref(new Date(2020, 7, 15));
    const wrapper = mount(
      () => (<DatePicker type='week' v-model:value={value.value} />),
      { attachTo: document.body },
    );

    const input = wrapper.find('input');
    input.trigger('blur');
    input.trigger('focus');
    await nextTick();
    expect(document.querySelector('.is-week-mode')).not.toBeNull();
    // select month still is in week-mode
    document.querySelectorAll<HTMLElement>('.lp-date-picker__header-label')[1]!.click();
    await nextTick();
    document.querySelectorAll<HTMLElement>('.lp-month-table .cell')[7]!.click();
    await nextTick();
    expect(document.querySelector('.is-week-mode')).not.toBeNull();

    const numberOfHighlightRows = () =>
      document.querySelectorAll('.lp-date-table__row.current').length;

    document.querySelector<HTMLElement>('.lp-date-table__row ~ .lp-date-table__row td.available')!.click();
    await nextTick();
    const vm = wrapper.vm as any;
    expect(vm.value).not.toBeNull();

    input.trigger('blur');
    input.trigger('focus');
    await nextTick();
    expect(numberOfHighlightRows()).toBe(1);

    // test: next month should not have highlight
    document.querySelector<HTMLElement>('.arrow-right')!.click();
    await nextTick();
    expect(numberOfHighlightRows()).toBe(0);

    // test: next year should not have highlight
    document.querySelector<HTMLElement>('.arrow-left')!.click();
    await nextTick();

    document.querySelector<HTMLElement>('.d-arrow-right')!.click();
    await nextTick();

    expect(numberOfHighlightRows()).toBe(0);
  });

  for (const loObj of [
    { locale: enUs, name: 'Sunday', value: 0 },
    { locale: zhCn, name: 'Monday', value: 1 },
  ]) {
    test(`emit first day of the week, ${loObj.locale.name} locale, ${loObj.name}`, async () => {
      const wrapper = mount(
        {
          components: {
            'lp-date-picker': DatePicker,
            'lp-config-provider': ConfigProvider,
          },
          template: `<lp-config-provider :locale="locale">
            <lp-date-picker type='week' v-model:value="value" />
          </lp-config-provider>`,
          data() {
            return {
              locale: loObj.locale,
              value: '',
            };
          },
        },
        {
          attachTo: 'body',
        },
      );
      const input = wrapper.find('input');
      input.trigger('blur');
      input.trigger('focus');
      await nextTick();
      // click Wednesday
      document.querySelectorAll<HTMLElement>('.lp-date-table__row ~ .lp-date-table__row td')[3]!.click();
      await nextTick();
      const vm = wrapper.vm as any;
      expect(vm.value).not.toBeNull();
      expect(+dayjs(vm.value).locale(loObj.locale.name)).toBe(
        +dayjs(vm.value).locale(loObj.locale.name).startOf('week'),
      );
      expect(dayjs(vm.value).locale(loObj.locale.name).day()).toBe(loObj.value); // Sunday or Monday
    });
  }
});

describe('DatePicker dates', () => {
  test('create', async () => {
    const value = ref('');
    const wrapper = mount(
      () => (<DatePicker type='dates' v-model:value={value.value} />),
      { attachTo: document.body },
    );

    const input = wrapper.find('input');
    input.trigger('blur');
    input.trigger('focus');
    await nextTick();
    const td = document.querySelectorAll<HTMLElement>('.lp-date-table__row .available');

    td[0].click();
    await nextTick();
    expect(value.value.length).toBe(1);
    td[1].click();
    await nextTick();
    expect(value.value.length).toBe(2);
    expect(
      document.querySelectorAll('.lp-date-table__row .selected').length,
    ).toBe(2);
    td[0].click();
    await nextTick();
    expect(value.value.length).toBe(1);
    td[1].click();
    await nextTick();
    expect(value.value.length).toBe(0);
  });
});

describe('DatePicker keyboard events', () => {
  test('enter', async () => {
    const value = ref('');
    const wrapper = mount(
      () => (<DatePicker type='date' v-model:value={value.value} />),
      { attachTo: document.body },
    );

    const input = wrapper.find('.lp-input__inner');
    await input.trigger('focus');
    await input.trigger('click');
    await nextTick();

    const popperEl = document.querySelectorAll('.lp-picker__popper')[0];
    const attr = popperEl.getAttribute('aria-hidden');
    expect(attr).toEqual('false');

    await input.trigger('keydown', {
      code: EVENT_CODE.enter,
    });
    const popperEl2 = document.querySelectorAll('.lp-picker__popper')[0];
    const attr2 = popperEl2.getAttribute('aria-hidden');
    expect(attr2).toEqual('true');
  });

  test('numpadEnter', async () => {
    const value = ref('');
    const wrapper = mount(
      () => (<DatePicker type='date' v-model:value={value.value} />),
      { attachTo: document.body },
    );

    const input = wrapper.find('.lp-input__inner');
    await input.trigger('focus');
    await input.trigger('click');
    await nextTick();

    const popperEl = document.querySelectorAll('.lp-picker__popper')[0];
    const attr = popperEl.getAttribute('aria-hidden');
    expect(attr).toEqual('false');

    await input.trigger('keydown', {
      code: EVENT_CODE.numpadEnter,
    });
    const popperEl2 = document.querySelectorAll('.lp-picker__popper')[0];
    const attr2 = popperEl2.getAttribute('aria-hidden');
    expect(attr2).toEqual('true');
  });
});

describe('DateRangePicker', () => {
  test('create & custom class & style', async () => {
    let calendarChangeValue: Array<Date> | null = null;
    const changeHandler = vi.fn();
    const popperClassName = 'popper-class-test';
    const customClassName = 'custom-class-test';
    const onCalendarChange = (e: Date[]) => {
      calendarChangeValue = e;
      changeHandler(e);
    };
    const value = ref('');
    wrapper = mount(
      () => (<DatePicker type='daterange' v-model:value={value.value} onCalendarChange={onCalendarChange} style={{ color:'red' }} class={customClassName} popperClass={popperClassName} />),
      { attachTo: document.body },
    );

    const inputs = wrapper.findAll('input');
    inputs[0].trigger('blur');
    inputs[0].trigger('focus');
    await nextTick();

    const outterInput = wrapper.find('.lp-range-editor.lp-input__wrapper');
    expect(outterInput.classes()).toContain(customClassName);
    expect(outterInput.attributes().style).toBeDefined();

    const panels = document.querySelectorAll('.lp-date-range-picker__content');
    expect(panels.length).toBe(2);
    panels[0].querySelector<HTMLElement>('td.available')!.click();
    await nextTick();

    panels[1].querySelector<HTMLElement>('td.available')!.click();
    await nextTick();

    inputs[0].trigger('blur');
    inputs[0].trigger('focus');
    await nextTick();

    // popperClassName
    expect(
      document
        .querySelector('.lp-picker__popper')!
        .classList.contains(popperClassName),
    ).toBe(true);
    // correct highlight
    const startDate = document.querySelectorAll('.start-date');
    const endDate = document.querySelectorAll('.end-date');
    const inRangeDate = document.querySelectorAll('.in-range');
    expect(startDate.length).toBe(1);
    expect(endDate.length).toBe(1);
    expect(inRangeDate.length).toBeGreaterThan(28);
    // value is array
    expect(Array.isArray(value.value)).toBeTruthy();
    // input text is something like date string
    expect(inputs[0].element.value.length).toBe(10);
    expect(inputs[1].element.value.length).toBe(10);
    // calendar-change event
    expect(changeHandler).toHaveBeenCalledTimes(2);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    expect(calendarChangeValue && calendarChangeValue.length).toBe(2);
    expect(calendarChangeValue && calendarChangeValue[0]).toBeInstanceOf(Date);
    expect(calendarChangeValue && calendarChangeValue[1]).toBeInstanceOf(Date);
  });

  test('reverse selection', async () => {
    const value = ref<'' | Date[]>('');
    wrapper = mount(
      () => (<DatePicker type='daterange' v-model:value={value.value} />),
      { attachTo: document.body },
    );

    const inputs = wrapper.findAll('input');
    inputs[0].trigger('blur');
    inputs[0].trigger('focus');
    await nextTick();

    const panels = document.querySelectorAll('.lp-date-range-picker__content');
    panels[1].querySelector<HTMLElement>('td.available')!.click();
    await nextTick();
    panels[0].querySelector<HTMLElement>('td.available')!.click();
    await nextTick();
    inputs[0].trigger('blur');
    inputs[0].trigger('focus');
    await nextTick();
    // correct highlight
    const startDate = document.querySelectorAll('.start-date');
    const endDate = document.querySelectorAll('.end-date');
    const inRangeDate = document.querySelectorAll('.in-range');
    expect(startDate.length).toBe(1);
    expect(endDate.length).toBe(1);
    expect(inRangeDate.length).toBeGreaterThan(28);
    expect((value.value as Date[])[0].getTime() < (value.value as Date[])[1].getTime()).toBeTruthy();
  });

  test('reset selection', async () => {
    const value = ref('');
    const wrapper = mount(
      () => (<DatePicker type='daterange' v-model:value={value.value} />),
      { attachTo: document.body },
    );

    const inputs = wrapper.findAll('input');
    inputs[0].trigger('blur');
    inputs[0].trigger('focus');
    await nextTick();
    const panels = document.querySelectorAll('.lp-date-range-picker__content');
    panels[1].querySelector<HTMLElement>('td.available')!.click();
    await nextTick();
    panels[0].querySelector<HTMLElement>('td.available')!.click();
    await nextTick();

    value.value = '';
    inputs[0].trigger('blur');
    inputs[0].trigger('focus');
    await nextTick();

    const inRangeDate = document.querySelectorAll('.in-range');
    expect(inRangeDate.length).toBe(0);
  });

  test('range, start-date and end-date', async () => {
    const value = ref('');
    wrapper = mount(
      () => (<DatePicker type='daterange' v-model:value={value.value} />),
      { attachTo: document.body },
    );

    const table = document.querySelector<HTMLTableElement>('.lp-date-table')!;
    const availableTds = table.querySelectorAll<HTMLElement>('td.available');

    availableTds[0]!.click();
    await nextTick();
    availableTds[1]!.click();
    await nextTick();

    expect(availableTds[0].classList.contains('in-range')).toBeTruthy();
    expect(availableTds[0].classList.contains('start-date')).toBeTruthy();
    expect(availableTds[1].classList.contains('in-range')).toBeTruthy();
    expect(availableTds[1].classList.contains('end-date')).toBeTruthy();
    availableTds[1]!.click();
    await nextTick();
    availableTds[0]!.click();
    await nextTick();

    expect(availableTds[0].classList.contains('in-range')).toBeTruthy();
    expect(availableTds[0].classList.contains('start-date')).toBeTruthy();
    expect(availableTds[1].classList.contains('in-range')).toBeTruthy();
    expect(availableTds[1].classList.contains('end-date')).toBeTruthy();

    const startDate = document.querySelectorAll('.start-date');
    const endDate = document.querySelectorAll('.end-date');
    const inRangeDate = document.querySelectorAll('.in-range');
    expect(startDate.length).toBe(1);
    expect(endDate.length).toBe(1);
    expect(inRangeDate.length).toBe(2);
  });

  test('unlink:true', async () => {
    const value = ref([new Date(2000, 9, 1), new Date(2000, 11, 2)]);
    wrapper = mount(
      () => (<DatePicker type='daterange' unlink-panels v-model:value={value} />),
      { attachTo: document.body },
    );

    const inputs = wrapper.findAll('input');
    inputs[0].trigger('blur');
    inputs[0].trigger('focus');
    await nextTick();

    const panels = document.querySelectorAll('.lp-date-range-picker__content');
    const left = panels[0].querySelector('.lp-date-range-picker__header')!;
    const right = panels[1].querySelector('.is-right .lp-date-range-picker__header')!;
    expect(left.textContent).toBe('2000  October');
    expect(right.textContent).toBe('2000  December');

    panels[1].querySelector<HTMLElement>('.d-arrow-right')!.click();
    await nextTick();

    panels[1].querySelector<HTMLElement>('.arrow-right')!.click();
    await nextTick();
    expect(left.textContent).toBe('2000  October');
    expect(right.textContent).toBe('2002  January');
  });

  test('daylight saving time highlight', async () => {
    // Run test with environment variable TZ=Australia/Sydney
    // The following test uses Australian Eastern Daylight Time (AEDT)
    // AEST -> AEDT shift happened on 2016-10-02 02:00:00
    const value = ref([new Date(2016, 9, 1), new Date(2016, 9, 3)]);
    wrapper = mount(
      () => (<DatePicker type='daterange' v-model:value={value.value} />),
      { attachTo: document.body },
    );

    const inputs = wrapper.findAll('input');
    inputs[0].trigger('blur');
    inputs[0].trigger('focus');
    await nextTick();

    const startDate = document.querySelectorAll('.start-date');
    const endDate = document.querySelectorAll('.end-date');
    expect(startDate.length).toBe(1);
    expect(endDate.length).toBe(1);
  });

  test('value-format', async () => {
    const valueFormat = 'DD/MM YYYY';
    const value = ref([
      dayjs(new Date(2021, 4, 2)).format(valueFormat),
      dayjs(new Date(2021, 4, 12)).format(valueFormat),
    ]);
    wrapper = mount(
      () => (<DatePicker type='daterange' v-model:value={value.value} format='YYYY-MM-DD' value-format={valueFormat} />),
      { attachTo: document.body },
    );

    await nextTick();
    const [startInput, endInput] = wrapper.findAll('input');
    expect(startInput.element.value).toBe('2021-05-02');
    expect(endInput.element.value).toBe('2021-05-12');

    startInput.trigger('blur');
    startInput.trigger('focus');
    await nextTick();

    const panels = document.querySelectorAll('.lp-date-range-picker__content');
    expect(panels.length).toBe(2);

    panels[0].querySelector<HTMLElement>('td.available')!.click();
    await nextTick();

    panels[1].querySelector<HTMLElement>('td.available')!.click();
    await nextTick();

    expect(value.value.toString())
      .toBe(['01/05 2021', '01/06 2021'].toString());
  });

  test('panel change event', async () => {
    await testDatePickerPanelChange('daterange');
  });

  test('display value', async () => {
    const value = ref([undefined, undefined]);
    const wrapper = mount(
      () => (<DatePicker type='daterange' v-model:value={value} />),
      { attachTo: document.body },
    );

    await nextTick();

    const [startInput, endInput] = wrapper.findAll('input');
    expect(startInput.element.value).toBe('');
    expect(endInput.element.value).toBe('');
  });
});

describe('MonthRange', () => {
  test('works', async () => {
    const value = ref<'' | Date[]>('');
    const wrapper = mount(
      () => (<DatePicker type='monthrange' v-model:value={value.value} />),
      { attachTo: document.body },
    );

    const inputs = wrapper.findAll('input');
    inputs[0].trigger('blur');
    inputs[0].trigger('focus');
    await nextTick();

    const panels = document.querySelectorAll('.lp-date-range-picker__content');
    expect(panels.length).toBe(2);

    const p0 = panels[0].querySelector<HTMLElement>('td:not(.disabled)')!;
    p0.click();
    await nextTick();

    const p1 = panels[1].querySelector<HTMLElement>('td:not(.disabled)')!;
    p1.click();
    await nextTick();

    inputs[0].trigger('blur');
    inputs[0].trigger('focus');

    // correct highlight
    const startDate = document.querySelectorAll('.start-date');
    const endDate = document.querySelectorAll('.end-date');
    const inRangeDate = document.querySelectorAll('.in-range');
    expect(startDate.length).toBe(1);
    expect(endDate.length).toBe(1);
    expect(inRangeDate.length).toBeGreaterThan(0);
    // value is array
    expect(Array.isArray(value.value)).toBeTruthy();
    // input text is something like date string
    expect(inputs[0].element.value.length).toBe(7);
    expect(inputs[1].element.value.length).toBe(7);

    // reverse selection
    p1.click();
    await nextTick();
    p0.click();
    await nextTick();
    expect((value.value as Date[])[0].getTime() < (value.value as Date[])[1].getTime()).toBeTruthy();
  });

  test('range, start-date and end-date', async () => {
    const value = ref('');
    wrapper = mount(
      () => (<DatePicker type='monthrange' v-model:value={value.value} />),
      { attachTo: document.body },
    );

    const table = document.querySelector('.lp-month-table');
    const tds = (table as HTMLTableElement).querySelectorAll<HTMLElement>('td');

    tds[0]!.click();
    await nextTick();
    tds[1].click();
    await nextTick();

    expect(tds[0].classList.contains('in-range')).toBeTruthy();
    expect(tds[0].classList.contains('start-date')).toBeTruthy();
    expect(tds[1].classList.contains('in-range')).toBeTruthy();
    expect(tds[1].classList.contains('end-date')).toBeTruthy();

    tds[1]!.click();
    await nextTick();

    tds[0]!.click();
    await nextTick();

    expect(tds[0].classList.contains('in-range')).toBeTruthy();
    expect(tds[0].classList.contains('start-date')).toBeTruthy();
    expect(tds[1].classList.contains('in-range')).toBeTruthy();
    expect(tds[1].classList.contains('end-date')).toBeTruthy();

    const startDate = document.querySelectorAll('.start-date');
    const endDate = document.querySelectorAll('.end-date');
    const inRangeDate = document.querySelectorAll('.in-range');
    expect(startDate.length).toBe(1);
    expect(endDate.length).toBe(1);
    expect(inRangeDate.length).toBe(2);
  });

  test('type:monthrange unlink:true', async () => {
    const value = ref([new Date(2000, 9), new Date(2002, 11)]);
    wrapper = mount(
      () => (<DatePicker type='monthrange' unlink-panels v-model:value={value.value} />),
      { attachTo: document.body },
    );

    const inputs = wrapper.findAll('input');
    inputs[0].trigger('blur');
    inputs[0].trigger('focus');
    await nextTick();
    const panels = document.querySelectorAll('.lp-date-range-picker__content');
    const left = panels[0].querySelector('.lp-date-range-picker__header')!;
    const right = panels[1].querySelector('.is-right .lp-date-range-picker__header')!;
    expect(left.textContent).toContain(2000);
    expect(right.textContent).toContain(2002);
    panels[1].querySelector<HTMLElement>('.d-arrow-right')!.click();
    await nextTick();
    expect(left.textContent).toContain(2000);
    expect(right.textContent).toContain(2003);
  });

  test('daylight saving time highlight', async () => {
    const value = ref([new Date(2016, 6), new Date(2016, 12)]);
    wrapper = mount(
      () => (<DatePicker type='monthrange' v-model:value={value.value} />),
      { attachTo: document.body },
    );

    const inputs = wrapper.findAll('input');
    inputs[0].trigger('blur');
    inputs[0].trigger('focus');
    await nextTick();
    const startDate = document.querySelectorAll('.start-date');
    const endDate = document.querySelectorAll('.end-date');
    expect(startDate.length).toBe(1);
    expect(endDate.length).toBe(1);
  });

  test('should accept popper options and pass down', async () => {
    const LpPopperOptions = {
      strategy: 'fixed',
    };
    const value = ref([new Date(2016, 6), new Date(2016, 12)]);
    const wrapper = mount(defineComponent({
      setup() {
        provide('LpPopperOptions', LpPopperOptions);
        return () => (<DatePicker type='monthrange' v-model:value={value.value} popper-options={LpPopperOptions} unlinkPanels />);
      },
    }));

    await nextTick();

    expect(
      (wrapper.findComponent(CommonPicker).vm as any).lpPopperOptions,
    ).toEqual(LpPopperOptions);
  });

  describe('form item accessibility integration', () => {
    test('automatic id attachment', async () => {
      wrapper = mount(
        () => (<LpFormItem label="Foobar" data-test-ref="item"><DatePicker /></LpFormItem>),
        { attachTo: document.body },
      );

      await nextTick();
      const formItem = wrapper.find('[data-test-ref="item"]');
      const formItemLabel = formItem.find('.lp-form-item__label');
      const datePickerInput = wrapper.find('.lp-input__inner');
      expect(formItem.attributes().role).toBeFalsy();
      expect(formItemLabel.attributes().for)
        .toBe(datePickerInput.attributes().id);
    });

    test('specified id attachment', async () => {
      wrapper = mount(
        () => (<LpFormItem label="Foobar" data-test-ref="item"><DatePicker id="foobar" /></LpFormItem>),
        { attachTo: document.body },
      );

      await nextTick();
      const formItem = wrapper.find('[data-test-ref="item"]');
      const formItemLabel = formItem.find('.lp-form-item__label');
      const datePickerInput = wrapper.find('.lp-input__inner');
      expect(formItem.attributes().role).toBeFalsy();
      expect(datePickerInput.attributes().id).toBe('foobar');
      expect(formItemLabel.attributes().for).toBe(
        datePickerInput.attributes().id,
      );
    });

    test('form item role is group when multiple inputs', async () => {
      const wrapper = mount(
        () => (<LpFormItem label="Foobar" data-test-ref="item"><DatePicker /><DatePicker /></LpFormItem>),
        { attachTo: document.body },
      );

      await nextTick();
      const formItem = wrapper.find('[data-test-ref="item"]');
      expect(formItem.attributes().role).toBe('group');
    });
  });

  test('The year which is disabled should not be selectable', async () => {
    const pickHandler = vi.fn();
    const yearValue = ref('2022');
    const validateYear = (date: Date) => (date.getFullYear() > 2022 ? true : false);
    const onPick = (e: Date) => (pickHandler(e));

    wrapper = mount(
      () => (<DatePicker type='year' v-model:value={yearValue.value} disabled-date={validateYear} onPanelChange={onPick} />),
      { attachTo: document.body },
    );

    const input = wrapper.find('input');
    input.trigger('focus');
    await nextTick();

    document.querySelector<HTMLElement>('td.disabled')!.click();
    await nextTick();
    expect(pickHandler).toHaveBeenCalledTimes(0);

    document.querySelector<HTMLElement>('td.available')!.click();
    await nextTick();
    expect(pickHandler).toHaveBeenCalledTimes(1);
  });
});
