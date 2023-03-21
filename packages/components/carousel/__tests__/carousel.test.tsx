import { nextTick, reactive } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, describe, expect, test } from 'vitest';
import Carousel from '../src/Carousel.vue';
import CarouselItem from '../src/CarouselItem.vue';

import type { VueWrapper } from '@vue/test-utils';
import type { CarouselInstance } from '../src/instance';

const wait = (ms = 100) =>
  new Promise(resolve => setTimeout(() => resolve(0), ms));

const generateCarouselItems = (count = 3, hasLabel = false) => {
  const list = Array.from({ length: count }, (_, index) => index + 1);
  return list.map(i =>
    hasLabel ? <CarouselItem key={i} label={i} /> : <CarouselItem key={i} />,
  );
};

describe('Carousel', () => {
  let wrapper: VueWrapper<any>;

  const createComponent = (
    props: any = {},
    count?: number,
    hasLabel?: boolean,
  ) => {
    return mount({
      setup() {
        return () => (
          <div>
            <Carousel {...props}>
              {generateCarouselItems(count, hasLabel)}
            </Carousel>
          </div>
        );
      },
    });
  };

  afterEach(() => {
    wrapper.unmount();
  });

  test('create', () => {
    wrapper = createComponent({
      ref: 'carousel',
    });

    const carousel = wrapper.findComponent({ ref: 'carousel' })
      .vm as CarouselInstance;
    expect(carousel.direction).toBe('horizontal');
    expect(wrapper.findAll('.lp-carousel__item').length).toEqual(3);
  });

  test('auto play', async () => {
    wrapper = createComponent({
      interval: 50,
    });

    await nextTick();
    await wait(10);
    const items = wrapper.vm.$el.querySelectorAll('.lp-carousel__item');
    expect(items[0].classList.contains('is-active')).toBeTruthy();
    await wait(60);
    expect(items[1].classList.contains('is-active')).toBeTruthy();
  });

  test('initial index', async () => {
    wrapper = createComponent({
      autoplay: false,
      'initial-index': 1,
    });

    await nextTick();
    await wait(10);

    expect(
      wrapper.vm.$el
        .querySelectorAll('.lp-carousel__item')[1]
        .classList.contains('is-active'),
    ).toBeTruthy();
  });

  test('reset timer', async () => {
    wrapper = createComponent({
      interval: 500,
    });
    await nextTick();
    const items = wrapper.vm.$el.querySelectorAll('.lp-carousel__item');
    await wrapper.trigger('mouseenter');
    await nextTick();
    expect(items[0].classList.contains('is-active')).toBeTruthy();
    await wrapper.trigger('mouseleave');
    await nextTick();
    await wait(700);
    expect(items[1].classList.contains('is-active')).toBeTruthy();
  });

  test('change', async () => {
    const state = reactive({
      val: -1,
      oldVal: -1,
    });

    wrapper = createComponent({
      onChange(val: number, prevVal: number) {
        state.val = val;
        state.oldVal = prevVal;
      },
      interval: 50,
    });

    await nextTick();
    await wait(50);
    expect(state.val).toBe(1);
    expect(state.oldVal).toBe(0);
  });

  test('label', async () => {
    wrapper = createComponent(undefined, 3, true);
    await nextTick();
    expect(wrapper.find('.lp-carousel__button span').text()).toBe('1');
  });

  describe('manual control', () => {
    test('hover', async () => {
      wrapper = createComponent({
        autoplay: false,
      });

      await nextTick();
      await wait();
      await wrapper.findAll('.lp-carousel__indicator')[1].trigger('mouseenter');
      await nextTick();
      await wait();
      expect(
        wrapper.vm.$el
          .querySelectorAll('.lp-carousel__item')[1]
          .classList.contains('is-active'),
      ).toBeTruthy();
    });
  });

  test('card', async () => {
    wrapper = createComponent(
      {
        autoplay: false,
        type: 'card',
      },
      7,
    );

    await nextTick();
    await wait();
    const items = wrapper.vm.$el.querySelectorAll('.lp-carousel__item');
    expect(items[0].classList.contains('is-active')).toBeTruthy();
    expect(items[1].classList.contains('is-in-stage')).toBeTruthy();
    expect(items[6].classList.contains('is-in-stage')).toBeTruthy();
    await items[1].click();
    await wait();
    expect(items[1].classList.contains('is-active')).toBeTruthy();
    await wrapper.vm.$el.querySelector('.lp-carousel__arrow--left').click();
    await wait();
    expect(items[0].classList.contains('is-active')).toBeTruthy();
    await items[6].click();
    await wait();
    expect(items[6].classList.contains('is-active')).toBeTruthy();
  });

  test('vertical direction', () => {
    wrapper = createComponent({
      ref: 'carousel',
      autoplay: false,
      direction: 'vertical',
      height: '100px',
    });
    const items = wrapper.vm.$el.querySelectorAll('.lp-carousel__item');
    const carousel = wrapper.findComponent({ ref: 'carousel' })
      .vm as CarouselInstance;
    expect(carousel.direction).toBe('vertical');
    expect(items[0].style.transform.includes('translateY')).toBeTruthy();
  });

  test('pause auto play on hover', async () => {
    wrapper = createComponent({
      interval: 50,
      'pause-on-hover': false,
    });

    await nextTick();
    await wrapper.find('.lp-carousel').trigger('mouseenter');
    const items = wrapper.vm.$el.querySelectorAll('.lp-carousel__item');
    await nextTick();
    await wait(60);
    expect(items[1].classList.contains('is-active')).toBeTruthy();
  });

  test('should guarantee order of indicators', async () => {
    const data = reactive([1, 2, 3, 4]);
    wrapper = mount({
      setup() {
        return () => (
          <div>
            <Carousel>
              {data.map(value => (
                <CarouselItem label={value} key={value}>
                  {value}
                </CarouselItem>
              ))}
            </Carousel>
          </div>
        );
      },
    });
    await nextTick();

    data.splice(1, 0, 5);
    await nextTick();
    const indicators = wrapper.findAll('.lp-carousel__button');
    data.forEach((value, index) => {
      expect(indicators[index].element.textContent).toEqual(value.toString());
    });
  });
});
