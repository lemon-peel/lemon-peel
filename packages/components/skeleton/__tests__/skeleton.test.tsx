import { nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import Skeleton from '../src/Skeleton.vue';
import type { SkeletonInstance } from '../src/skeleton';

const AXIOM = 'AXIOM is the best girl';

describe('Skeleton.vue', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('render test', () => {
    const wrapper = mount(Skeleton);
    expect(wrapper.findAll('.lp-skeleton__p')).toHaveLength(4);
    expect(wrapper.classes()).toMatchInlineSnapshot(`
      [
        "lp-skeleton",
      ]
    `);
  });

  it('should render with animation', () => {
    const wrapper = mount(Skeleton, { props: { animated: true } });

    expect(wrapper.classes()).toEqual(['lp-skeleton', 'is-animated']);
  });

  it('should render x times', async () => {
    const wrapper = mount(Skeleton);

    expect(wrapper.findAll('.lp-skeleton__p')).toHaveLength(4);

    await wrapper.setProps({
      count: 2,
    });

    expect(wrapper.findAll('.lp-skeleton__p')).toHaveLength(8);
  });

  it('should render x rows', () => {
    const wrapper = mount(Skeleton, { props: { rows: 4 } });

    expect(wrapper.findAll('.lp-skeleton__p')).toHaveLength(5);
  });

  it('should render default slots', () => {
    const wrapper = mount(Skeleton, {
      props: { loading: false },
      slots: {
        default: () => AXIOM,
      },
    });

    expect(wrapper.text()).toBe(AXIOM);
  });

  it('should render templates', () => {
    const wrapper = mount(
      Skeleton,
      {
        slots: {
          template: () => AXIOM,
        },
      },
    );

    expect(wrapper.text()).toBe(AXIOM);
  });

  it('should throttle rendering', async () => {
    const wrapper = mount(Skeleton, { props: { throttle: 500 } });

    expect((wrapper.vm as SkeletonInstance).uiLoading).toBe(false);

    vi.runAllTimers();

    await nextTick();

    expect((wrapper.vm as SkeletonInstance).uiLoading).toBe(true);
  });
});
