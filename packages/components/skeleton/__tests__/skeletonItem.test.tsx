import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import SkeletonItem from '../src/SkeletonItem.vue';

describe('<skeleton-item />', () => {
  it('should render correctly', () => {
    const wrapper = mount(SkeletonItem);

    expect(wrapper.find('.lp-skeleton__text').exists()).toBe(true);
  });

  it('should render image placeholder', () => {
    const wrapper = mount(SkeletonItem, { propsData: { variant: 'image' } });

    expect(wrapper.find('svg').exists()).toBe(true);
  });
});
