import { nextTick, ref } from 'vue';
import type { VueWrapper } from '@vue/test-utils';
import { mount } from '@vue/test-utils';
import {  afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { rAF } from '@lemon-peel/test-utils/tick';
import LpButton from '@lemon-peel/components/button';
import Drawer from '../src/Drawer.vue';

const title = 'Drawer Title';
const content = 'content';

describe('Drawer', () => {
  let wrapper: VueWrapper<any>;

  beforeEach(() => {});

  afterEach(() => {
    wrapper?.unmount();
    document.body.innerHTML = '';
  });

  test('create', async () => {
    const visible = ref(true);
    wrapper = mount(
      () => (<Drawer title={title} v-model:visible={visible.value}></Drawer>),
      { attachTo: document.body },
    );

    await nextTick();
    await rAF();
    await nextTick();

    const wrapperEl = wrapper.find('.lp-overlay').element as HTMLDivElement;
    const headerEl = wrapper.find('.lp-drawer__header').element;

    await nextTick();
    expect(wrapperEl.style.display).not.toEqual('none');
    expect(headerEl.textContent).toEqual(title);
  });

  test('render correct content', async () => {
    const visible = ref(true);
    wrapper = mount(
      () => (<Drawer title={title} v-model:visible={visible.value}>
          <span>this is a sentence</span>
          <LpButton>Cancel</LpButton>
          <LpButton type="primary">Confirm</LpButton>
        </Drawer>),
      { attachTo: document.body },
    );

    await nextTick();
    await rAF();
    await nextTick();

    expect(wrapper.find('.lp-drawer__body span').element.textContent)
      .toEqual('this is a sentence');

    const footerBtns = wrapper.findAll('.lp-button');
    expect(footerBtns.length).toEqual(2);
    expect(footerBtns[0].find('span').element.textContent).toEqual('Cancel');
    expect(footerBtns[1].find('span').element.textContent).toEqual('Confirm');
  });

  test('should append to body, when append-to-body flag is true', async () => {
    const visible = ref(true);
    wrapper = mount(
      () => (<Drawer title={title} v-model:visible={visible.value} appendToBody={true}>
          <span> content </span>
        </Drawer>),
      { attachTo: document.body },
    );

    await nextTick();

    const overlay = document.querySelector('.lp-overlay')!;
    expect(overlay.parentElement).toEqual(document.body);
  });

  test('should open and close drawer properly', async () => {
    const onClose = vi.fn();
    const onClosed = vi.fn();
    const onOpened = vi.fn();
    const visible = ref(false);
    wrapper = mount(
      () => (<Drawer title='title' v-model:visible={visible.value} onClose={onClose} onClosed={onClosed} onOpened={onOpened}>
          <span> content </span>
        </Drawer>),
      { attachTo: document.body },
    );

    await nextTick();
    await rAF();
    await nextTick();
    expect(onOpened).not.toHaveBeenCalled();

    const drawerEl = wrapper.find('.lp-overlay').element as HTMLDivElement;
    expect(drawerEl.style.display).toEqual('none');

    visible.value = true;
    await nextTick();
    await rAF();
    expect(drawerEl.style.display).not.toEqual('none');
    expect(onOpened).toHaveBeenCalled();
  });

  test('should destroy every child after drawer was closed when destroy-on-close flag is true', async () => {
    const visible = ref(true);
    wrapper = mount(
      () => (<Drawer title='title' v-model:visible={visible.value} destroyOnClose={true} appendToBody={false}>
          <span>content</span>
        </Drawer>),
      { attachTo: document.body },
    );

    const vm = wrapper.findComponent(Drawer).vm;

    await nextTick();
    await rAF();
    await nextTick();
    expect(wrapper.find('.lp-drawer__body span').element.textContent)
      .toEqual(content);

    vm.close();
    await nextTick();
    await rAF();
    await nextTick();
    expect(wrapper.find('.lp-drawer__body').exists()).toBe(false);
  });

  test('should close dialog by clicking the close button', async () => {
    const visible = ref(true);
    const wrapper = mount(
      () => (<Drawer title='title' v-model:visible={visible.value} destroyOnClose={true} appendToBody={false}>
          <span> content </span>
        </Drawer>),
      { attachTo: document.body },
    );

    await nextTick();
    await rAF();
    await nextTick();

    await wrapper.find('.lp-drawer__close-btn').trigger('click');
    await nextTick();
    await rAF();
    await nextTick();
    expect(visible.value).toEqual(false);
  });

  test('should invoke before-close', async () => {
    const visible = ref(true);
    const beforeClose = vi.fn();
    const wrapper = mount(
      () => (<Drawer title={title} v-model:visible={visible.value} destroyOnClose={true} appendToBody={true} beforeClose={beforeClose}>
          <span> content </span>
        </Drawer>),
      { attachTo: document.body },
    );

    wrapper.findComponent(Drawer).vm.close();
    expect(beforeClose).toHaveBeenCalled();
  });

  test('should not show close button when show-close flag is false', async () => {
    const visible = ref(true);
    const wrapper = mount(
      () => (<Drawer title='title' v-model:visible={visible.value} showClose={false}>
          <span> content </span>
        </Drawer>),
      { attachTo: document.body },
    );

    expect(wrapper.find('.lp-drawer__close-btn').exists()).toBe(false);
  });

  test('should have custom classes when custom classes were given', async () => {
    const classes = 'some-custom-class';
    const visible = ref(true);
    const wrapper = mount(
      () => (<Drawer title={title} v-model:visible={visible.value} customClass={classes}>
          <span> content </span>
        </Drawer>),
      { attachTo: document.body },
    );

    expect(wrapper.find(`.${classes}`).exists()).toBe(true);
  });

  test('drawer header should have slot props', async () => {
    const visible = ref(true);
    const wrapper = mount(
      () => (<Drawer title={title} v-model:visible={visible.value} v-slots={{
        header: ({ titleId, titleClass, close }: any) => (
          <button data-title-id={titleId} data-title-class={titleClass} onClick={close} />
        ),
      }} />),
      { attachTo: document.body },
    );

    await nextTick();
    const drawer = wrapper.findComponent(Drawer);
    const headerButton = wrapper.find('button');

    expect(headerButton.attributes()['data-title-id']).toBeTruthy();
    expect(headerButton.attributes()['data-title-class'])
      .toBe('lp-drawer__title');

    expect(drawer.emitted().close).toBeFalsy();
    headerButton.trigger('click');
    await nextTick();
    expect(drawer.emitted()).toHaveProperty('close');
  });

  test('should not render header when withHeader attribute is false', async () => {
    const visible = ref(true);
    const wrapper = mount(
      () => (<Drawer title={title} v-model:visible={visible.value} withHeader={false}>
          <span> content </span>
        </Drawer>),
      { attachTo: document.body },
    );

    expect(wrapper.find('.lp-drawer__header').exists()).toBe(false);
  });

  describe('directions', () => {
    const renderer = (direction: string) => {
      const visible = ref(true);
      return mount(
        () => (<Drawer title={title} v-model:visible={visible.value} direction={direction as any}>
            <span> content </span>
          </Drawer>),
        { attachTo: document.body },
      );
    };

    test('should render from left to right', async () => {
      expect(renderer('ltr').find('.ltr').exists()).toBe(true);
    });

    test('should render from right to left', async () => {
      expect(renderer('rtl').find('.rtl').exists()).toBe(true);
    });

    test('should render from top to bottom', async () => {
      expect(renderer('ttb').find('.ttb').exists()).toBe(true);
    });

    test('should render from bottom to top', async () => {
      expect(renderer('btt').find('.btt').exists()).toBe(true);
    });
  });

  test('events', async () => {
    const open = vi.fn();
    const opened = vi.fn();
    const close = vi.fn();
    const closed = vi.fn();
    const visible = ref(false);
    const wrapper = mount(
      () => (<Drawer title={title} v-model:visible={visible.value} onClose={close} onClosed={closed} onOpened={opened} onOpen={open}>
        <span>content</span>
      </Drawer>),
      { attachTo: document.body },
    );

    const drawer = wrapper.findComponent(Drawer).vm;

    visible.value = true;
    await nextTick();
    await nextTick();
    expect(open).toHaveBeenCalled();
    drawer.afterEnter();
    expect(opened).toHaveBeenCalled();
    expect(close).not.toHaveBeenCalled();
    expect(closed).not.toHaveBeenCalled();

    visible.value = false;
    await nextTick();
    expect(close).toHaveBeenCalled();
    drawer.afterLeave();
    expect(closed).toHaveBeenCalled();
  });

  describe('size', () => {
    const renderer = (size: string, isVertical: boolean) =>
      mount(
        () => (<Drawer title='title' visible={true} direction={isVertical ? 'ltr' : 'ttb'} size={size as any}>
          <span> content </span>
        </Drawer>),
        { attachTo: document.body },
      );

    test('should effect height when drawer is vertical', async () => {
      const drawerEl = renderer('50%', true).find('.lp-drawer')
        .element as HTMLDivElement;
      expect(drawerEl.style.width).toEqual('50%');
    });

    test('should effect width when drawer is horizontal', async () => {
      const drawerEl = renderer('50%', false).find('.lp-drawer')
        .element as HTMLDivElement;
      expect(drawerEl.style.height).toEqual('50%');
    });
  });

  describe('accessibility', () => {
    test('title attribute should set aria-label', async () => {
      const wrapper = mount(
        () => (<Drawer title={title} visible={true}></Drawer>),
        { attachTo: document.body },
      );

      await nextTick();
      const drawerDialog = wrapper.find('[role="dialog"]');
      expect(drawerDialog.attributes()['aria-label']).toBe(title);
      expect(drawerDialog.attributes()['aria-labelledby']).toBeFalsy();
    });

    test('missing title attribute should point to header slot content', async () => {
      const wrapper = mount(
        () => (<Drawer visible={true} v-slots={{
          header: ({ titleId, titleClass }: any) => (<h5 id={titleId} class={titleClass}>{title}</h5>),
        }} />),
        { attachTo: document.body },
      );

      await nextTick();
      const drawerDialog = wrapper.find('[role="dialog"]');
      const drawerTitle = wrapper.find('.lp-drawer__title');
      expect(drawerDialog.attributes()['aria-label']).toBeFalsy();
      expect(drawerDialog.attributes()['aria-labelledby']).toBe(
        drawerTitle.attributes().id,
      );
    });

    test('aria-describedby should point to modal body', async () => {
      const wrapper = mount(
        () => (<Drawer title='title' visible={true}>
          <span>{content}</span>
        </Drawer>),
        { attachTo: document.body },
      );

      await nextTick();
      const drawerDialog = wrapper.find('[role="dialog"]');
      const drawerBody = wrapper.find('.lp-drawer__body');
      expect(drawerDialog.attributes()['aria-describedby'])
        .toBe(drawerBody.attributes().id);
    });
  });
});
