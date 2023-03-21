import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import { Check } from '@element-plus/icons-vue';
import Breadcrumb from '../src/Breadcrumb.vue';
import BreadcrumbItem from '../src/BreadcrumbItem.vue';

import type { VNode } from 'vue';
import type { Router } from 'vue-router';

const doMount = (render: () => VNode, router = {}) => {
  return mount(render as any, {
    attachTo: 'body',
    global: {
      provide: { breadcrumb: {} },
      config: {
        globalProperties: {
          $router: router as unknown as Router,
        } as any,
      },
    },
  });
};

describe('Breadcrumb.vue', () => {
  it('separator', () => {
    const wrapper = doMount(() => (
      <Breadcrumb separator="?">
        <BreadcrumbItem>A</BreadcrumbItem>
      </Breadcrumb>
    ));
    expect(wrapper.find('.lp-breadcrumb__separator').text()).toBe('?');
  });

  it('separatorIcon', () => {
    const wrapper = doMount(() => (
      <Breadcrumb separatorIcon={Check}>
        <BreadcrumbItem>A</BreadcrumbItem>
      </Breadcrumb>
    ));
    expect(wrapper.find('.lp-breadcrumb__separator').text()).toBe('');
    expect(wrapper.findComponent(Check).exists()).toBe(true);
  });

  it('to', () => {
    const wrapper = doMount(() => (
      <Breadcrumb separator="?" separatorIcon={Check}>
        <BreadcrumbItem to="/index">A</BreadcrumbItem>
      </Breadcrumb>
    ));
    expect(wrapper.find('.lp-breadcrumb__inner').classes()).toContain('is-link');
  });

  it('single', () => {
    const wrapper = doMount(() => <BreadcrumbItem>A</BreadcrumbItem>);
    expect(wrapper.find('.lp-breadcrumb__inner').text()).toBe('A');
    expect(wrapper.find('.lp-breadcrumb__separator').text()).toBe('');
  });

  describe('BreadcrumbItem', () => {
    it('should set the last item as current page', () => {
      const wrapper = doMount(() => (
        <Breadcrumb>
          <BreadcrumbItem>A</BreadcrumbItem>
          <BreadcrumbItem>B</BreadcrumbItem>
        </Breadcrumb>
      ));

      const items = wrapper.findAllComponents(BreadcrumbItem);
      expect(items.at(1)!.element.getAttribute('aria-current')).toBe('page');
    });

    it('click event', async () => {
      const replace = vi.fn();
      const push = vi.fn();
      let wrapper = doMount(
        () => (
          <Breadcrumb>
            <BreadcrumbItem to="/path">A</BreadcrumbItem>
          </Breadcrumb>
        ),
        { replace, push },
      );
      await wrapper.find('.lp-breadcrumb__inner').trigger('click');
      expect(push).toHaveBeenCalled();

      wrapper.unmount();
      wrapper = doMount(
        () => (
          <Breadcrumb>
            <BreadcrumbItem to="/path" replace>A</BreadcrumbItem>
          </Breadcrumb>
        ),
        { replace, push },
      );
      await wrapper.find('.lp-breadcrumb__inner').trigger('click');
      expect(replace).toHaveBeenCalled();
    });
  });
});
